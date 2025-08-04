from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import stripe
import os
from datetime import datetime, timedelta
from src.models.subscription import db, Subscription, SubscriptionTier, PaymentHistory
from src.models.user import User

subscription_bp = Blueprint('subscription', __name__)

# Initialize Stripe (use test keys for development)
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')

# Subscription pricing (in cents)
SUBSCRIPTION_PRICES = {
    SubscriptionTier.FREE: 0,
    SubscriptionTier.STARTER: 2900,  # $29/month
    SubscriptionTier.PROFESSIONAL: 7900,  # $79/month
    SubscriptionTier.ENTERPRISE: 19900  # $199/month
}

@subscription_bp.route('/plans', methods=['GET'])
@cross_origin()
def get_subscription_plans():
    """Get available subscription plans"""
    plans = {
        'free': {
            'name': 'Free',
            'price': 0,
            'billing_period': 'forever',
            'features': {
                'content_per_month': 10,
                'social_posts_per_month': 50,
                'emails_per_month': 100,
                'affiliate_links': 25,
                'platforms': ['Instagram', 'Facebook'],
                'analytics_retention_days': 7,
                'support': 'Community'
            },
            'popular': False
        },
        'starter': {
            'name': 'Starter',
            'price': 29,
            'billing_period': 'month',
            'features': {
                'content_per_month': 100,
                'social_posts_per_month': 500,
                'emails_per_month': 1000,
                'affiliate_links': 100,
                'platforms': ['Instagram', 'Facebook', 'TikTok', 'Pinterest'],
                'analytics_retention_days': 30,
                'support': 'Email'
            },
            'popular': True
        },
        'professional': {
            'name': 'Professional',
            'price': 79,
            'billing_period': 'month',
            'features': {
                'content_per_month': 500,
                'social_posts_per_month': 2000,
                'emails_per_month': 5000,
                'affiliate_links': 500,
                'platforms': ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'YouTube'],
                'analytics_retention_days': 90,
                'support': 'Priority'
            },
            'popular': False
        },
        'enterprise': {
            'name': 'Enterprise',
            'price': 199,
            'billing_period': 'month',
            'features': {
                'content_per_month': 'Unlimited',
                'social_posts_per_month': 'Unlimited',
                'emails_per_month': 'Unlimited',
                'affiliate_links': 'Unlimited',
                'platforms': ['All Platforms', 'LinkedIn', 'Twitter'],
                'analytics_retention_days': 365,
                'support': 'Dedicated Account Manager'
            },
            'popular': False
        }
    }
    
    return jsonify({
        'success': True,
        'plans': plans
    })

@subscription_bp.route('/current', methods=['GET'])
@cross_origin()
def get_current_subscription():
    """Get user's current subscription"""
    try:
        user_id = request.args.get('user_id')
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        
        if not subscription:
            # Create free subscription for new users
            subscription = Subscription(
                user_id=user_id,
                tier=SubscriptionTier.FREE,
                status='active'
            )
            db.session.add(subscription)
            db.session.commit()
        
        return jsonify({
            'success': True,
            'subscription': subscription.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/upgrade', methods=['POST'])
@cross_origin()
def upgrade_subscription():
    """Upgrade user's subscription"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        new_tier = data.get('tier')
        payment_method_id = data.get('payment_method_id')
        
        # Validate tier
        try:
            tier_enum = SubscriptionTier(new_tier)
        except ValueError:
            return jsonify({'error': 'Invalid subscription tier'}), 400
        
        # Get user and current subscription
        user = User.query.get_or_404(user_id)
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        
        if not subscription:
            subscription = Subscription(
                user_id=user_id,
                tier=SubscriptionTier.FREE,
                status='active'
            )
            db.session.add(subscription)
            db.session.commit()
        
        # Handle free tier
        if tier_enum == SubscriptionTier.FREE:
            subscription.tier = tier_enum
            subscription.status = 'active'
            db.session.commit()
            
            return jsonify({
                'success': True,
                'subscription': subscription.to_dict(),
                'message': 'Downgraded to free tier'
            })
        
        # Handle paid tiers
        price = SUBSCRIPTION_PRICES[tier_enum]
        
        try:
            # Create or get Stripe customer
            if not subscription.stripe_customer_id:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=user.name,
                    metadata={'user_id': user_id}
                )
                subscription.stripe_customer_id = customer.id
            else:
                customer = stripe.Customer.retrieve(subscription.stripe_customer_id)
            
            # Attach payment method to customer
            if payment_method_id:
                stripe.PaymentMethod.attach(
                    payment_method_id,
                    customer=customer.id
                )
                
                # Set as default payment method
                stripe.Customer.modify(
                    customer.id,
                    invoice_settings={'default_payment_method': payment_method_id}
                )
            
            # Create subscription in Stripe
            stripe_subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f'Affiliate Marketing SaaS - {tier_enum.value.title()}'
                        },
                        'unit_amount': price,
                        'recurring': {'interval': 'month'}
                    }
                }],
                default_payment_method=payment_method_id,
                expand=['latest_invoice.payment_intent']
            )
            
            # Update local subscription
            subscription.tier = tier_enum
            subscription.status = 'active'
            subscription.stripe_subscription_id = stripe_subscription.id
            subscription.current_period_start = datetime.fromtimestamp(stripe_subscription.current_period_start)
            subscription.current_period_end = datetime.fromtimestamp(stripe_subscription.current_period_end)
            
            # Reset usage counters for new billing period
            subscription.reset_monthly_usage()
            
            db.session.commit()
            
            # Record payment
            if stripe_subscription.latest_invoice:
                payment = PaymentHistory(
                    user_id=user_id,
                    subscription_id=subscription.id,
                    stripe_payment_intent_id=stripe_subscription.latest_invoice.payment_intent.id,
                    amount=price / 100,  # Convert from cents
                    currency='USD',
                    status='succeeded',
                    invoice_number=stripe_subscription.latest_invoice.number,
                    description=f'Subscription upgrade to {tier_enum.value.title()}'
                )
                db.session.add(payment)
                db.session.commit()
            
            return jsonify({
                'success': True,
                'subscription': subscription.to_dict(),
                'message': f'Successfully upgraded to {tier_enum.value.title()} plan'
            })
            
        except stripe.error.StripeError as e:
            return jsonify({
                'error': f'Payment failed: {str(e)}',
                'payment_failed': True
            }), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/cancel', methods=['POST'])
@cross_origin()
def cancel_subscription():
    """Cancel user's subscription"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        # Cancel Stripe subscription if exists
        if subscription.stripe_subscription_id:
            try:
                stripe.Subscription.delete(subscription.stripe_subscription_id)
            except stripe.error.StripeError as e:
                print(f"Stripe cancellation error: {e}")
        
        # Update local subscription
        subscription.status = 'cancelled'
        subscription.tier = SubscriptionTier.FREE
        subscription.stripe_subscription_id = None
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'subscription': subscription.to_dict(),
            'message': 'Subscription cancelled successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/usage', methods=['GET'])
@cross_origin()
def get_usage():
    """Get user's current usage statistics"""
    try:
        user_id = request.args.get('user_id')
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        limits = subscription.get_limits()
        
        usage = {
            'content_generated': {
                'used': subscription.content_generated_count,
                'limit': limits['content_per_month'],
                'percentage': (subscription.content_generated_count / limits['content_per_month'] * 100) if limits['content_per_month'] > 0 else 0
            },
            'social_posts': {
                'used': subscription.social_posts_count,
                'limit': limits['social_posts_per_month'],
                'percentage': (subscription.social_posts_count / limits['social_posts_per_month'] * 100) if limits['social_posts_per_month'] > 0 else 0
            },
            'emails_sent': {
                'used': subscription.emails_sent_count,
                'limit': limits['emails_per_month'],
                'percentage': (subscription.emails_sent_count / limits['emails_per_month'] * 100) if limits['emails_per_month'] > 0 else 0
            },
            'affiliate_links': {
                'used': subscription.affiliate_links_count,
                'limit': limits['affiliate_links'],
                'percentage': (subscription.affiliate_links_count / limits['affiliate_links'] * 100) if limits['affiliate_links'] > 0 else 0
            }
        }
        
        return jsonify({
            'success': True,
            'usage': usage,
            'limits': limits,
            'subscription': subscription.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/payment-history', methods=['GET'])
@cross_origin()
def get_payment_history():
    """Get user's payment history"""
    try:
        user_id = request.args.get('user_id')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        pagination = PaymentHistory.query.filter_by(user_id=user_id)\
            .order_by(PaymentHistory.payment_date.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        payments = [payment.to_dict() for payment in pagination.items]
        
        return jsonify({
            'success': True,
            'payments': payments,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/webhook', methods=['POST'])
@cross_origin()
def stripe_webhook():
    """Handle Stripe webhooks"""
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET', '')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError:
            return jsonify({'error': 'Invalid payload'}), 400
        except stripe.error.SignatureVerificationError:
            return jsonify({'error': 'Invalid signature'}), 400
        
        # Handle the event
        if event['type'] == 'invoice.payment_succeeded':
            invoice = event['data']['object']
            _handle_successful_payment(invoice)
            
        elif event['type'] == 'invoice.payment_failed':
            invoice = event['data']['object']
            _handle_failed_payment(invoice)
            
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            _handle_subscription_cancelled(subscription)
            
        elif event['type'] == 'customer.subscription.updated':
            subscription = event['data']['object']
            _handle_subscription_updated(subscription)
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/create-payment-intent', methods=['POST'])
@cross_origin()
def create_payment_intent():
    """Create a payment intent for one-time payments"""
    try:
        data = request.get_json()
        amount = data.get('amount')  # in cents
        currency = data.get('currency', 'usd')
        user_id = data.get('user_id')
        
        # Get or create customer
        user = User.query.get_or_404(user_id)
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        
        customer_id = None
        if subscription and subscription.stripe_customer_id:
            customer_id = subscription.stripe_customer_id
        else:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
                metadata={'user_id': user_id}
            )
            customer_id = customer.id
            
            if subscription:
                subscription.stripe_customer_id = customer_id
                db.session.commit()
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            customer=customer_id,
            metadata={'user_id': user_id}
        )
        
        return jsonify({
            'success': True,
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def _handle_successful_payment(invoice):
    """Handle successful payment webhook"""
    try:
        customer_id = invoice['customer']
        subscription_id = invoice['subscription']
        
        # Find subscription by Stripe customer ID
        subscription = Subscription.query.filter_by(stripe_customer_id=customer_id).first()
        
        if subscription:
            # Record payment
            payment = PaymentHistory(
                user_id=subscription.user_id,
                subscription_id=subscription.id,
                stripe_payment_intent_id=invoice['payment_intent'],
                amount=invoice['amount_paid'] / 100,  # Convert from cents
                currency=invoice['currency'].upper(),
                status='succeeded',
                invoice_number=invoice['number'],
                description=f'Subscription payment for {subscription.tier.value.title()}'
            )
            db.session.add(payment)
            
            # Update subscription status
            subscription.status = 'active'
            subscription.current_period_start = datetime.fromtimestamp(invoice['period_start'])
            subscription.current_period_end = datetime.fromtimestamp(invoice['period_end'])
            
            # Reset usage counters for new billing period
            subscription.reset_monthly_usage()
            
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling successful payment: {e}")

def _handle_failed_payment(invoice):
    """Handle failed payment webhook"""
    try:
        customer_id = invoice['customer']
        
        # Find subscription by Stripe customer ID
        subscription = Subscription.query.filter_by(stripe_customer_id=customer_id).first()
        
        if subscription:
            # Record failed payment
            payment = PaymentHistory(
                user_id=subscription.user_id,
                subscription_id=subscription.id,
                stripe_payment_intent_id=invoice['payment_intent'],
                amount=invoice['amount_due'] / 100,  # Convert from cents
                currency=invoice['currency'].upper(),
                status='failed',
                invoice_number=invoice['number'],
                description=f'Failed subscription payment for {subscription.tier.value.title()}'
            )
            db.session.add(payment)
            
            # Update subscription status (could implement grace period logic here)
            subscription.status = 'past_due'
            
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling failed payment: {e}")

def _handle_subscription_cancelled(stripe_subscription):
    """Handle subscription cancellation webhook"""
    try:
        subscription = Subscription.query.filter_by(
            stripe_subscription_id=stripe_subscription['id']
        ).first()
        
        if subscription:
            subscription.status = 'cancelled'
            subscription.tier = SubscriptionTier.FREE
            subscription.stripe_subscription_id = None
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling subscription cancellation: {e}")

def _handle_subscription_updated(stripe_subscription):
    """Handle subscription update webhook"""
    try:
        subscription = Subscription.query.filter_by(
            stripe_subscription_id=stripe_subscription['id']
        ).first()
        
        if subscription:
            subscription.current_period_start = datetime.fromtimestamp(stripe_subscription['current_period_start'])
            subscription.current_period_end = datetime.fromtimestamp(stripe_subscription['current_period_end'])
            subscription.status = stripe_subscription['status']
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling subscription update: {e}")

