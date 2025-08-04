"""
Stripe Integration Service for AffiliateFlow SaaS Platform
Handles all payment processing, subscription management, and billing operations.
"""

import stripe
import os
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Stripe with secret key
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')

class SubscriptionTier(Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

@dataclass
class PricingPlan:
    tier: SubscriptionTier
    name: str
    price_monthly: int  # in cents
    price_yearly: int   # in cents
    stripe_price_id_monthly: str
    stripe_price_id_yearly: str
    features: List[str]
    limits: Dict[str, int]

class StripeService:
    """Comprehensive Stripe integration for AffiliateFlow SaaS platform"""
    
    def __init__(self):
        self.pricing_plans = self._initialize_pricing_plans()
        self.webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_...')
    
    def _initialize_pricing_plans(self) -> Dict[SubscriptionTier, PricingPlan]:
        """Initialize all pricing plans with Stripe price IDs"""
        return {
            SubscriptionTier.FREE: PricingPlan(
                tier=SubscriptionTier.FREE,
                name="Free",
                price_monthly=0,
                price_yearly=0,
                stripe_price_id_monthly="",
                stripe_price_id_yearly="",
                features=[
                    "10 AI-generated articles",
                    "50 social media posts",
                    "100 emails",
                    "25 affiliate links",
                    "Basic analytics"
                ],
                limits={
                    "articles": 10,
                    "social_posts": 50,
                    "emails": 100,
                    "affiliate_links": 25
                }
            ),
            SubscriptionTier.STARTER: PricingPlan(
                tier=SubscriptionTier.STARTER,
                name="Starter",
                price_monthly=2900,  # $29.00
                price_yearly=29000,  # $290.00 (2 months free)
                stripe_price_id_monthly="price_starter_monthly",
                stripe_price_id_yearly="price_starter_yearly",
                features=[
                    "100 AI-generated articles",
                    "500 social media posts",
                    "1,000 emails",
                    "100 affiliate links",
                    "Advanced analytics",
                    "Email support"
                ],
                limits={
                    "articles": 100,
                    "social_posts": 500,
                    "emails": 1000,
                    "affiliate_links": 100
                }
            ),
            SubscriptionTier.PROFESSIONAL: PricingPlan(
                tier=SubscriptionTier.PROFESSIONAL,
                name="Professional",
                price_monthly=7900,  # $79.00
                price_yearly=79000,  # $790.00 (2 months free)
                stripe_price_id_monthly="price_professional_monthly",
                stripe_price_id_yearly="price_professional_yearly",
                features=[
                    "Unlimited AI-generated content",
                    "Team collaboration (5 users)",
                    "A/B testing",
                    "Custom templates",
                    "Priority support",
                    "Advanced integrations"
                ],
                limits={
                    "articles": -1,  # Unlimited
                    "social_posts": -1,
                    "emails": -1,
                    "affiliate_links": -1,
                    "team_members": 5
                }
            ),
            SubscriptionTier.ENTERPRISE: PricingPlan(
                tier=SubscriptionTier.ENTERPRISE,
                name="Enterprise",
                price_monthly=19900,  # $199.00
                price_yearly=199000,  # $1,990.00 (2 months free)
                stripe_price_id_monthly="price_enterprise_monthly",
                stripe_price_id_yearly="price_enterprise_yearly",
                features=[
                    "White-label solution",
                    "Unlimited team members",
                    "Custom integrations",
                    "Dedicated support",
                    "SLA guarantee",
                    "Custom onboarding"
                ],
                limits={
                    "articles": -1,
                    "social_posts": -1,
                    "emails": -1,
                    "affiliate_links": -1,
                    "team_members": -1
                }
            )
        }
    
    async def create_customer(self, user_id: str, email: str, name: str = None) -> Dict[str, Any]:
        """Create a new Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata={
                    'user_id': user_id,
                    'platform': 'affiliateflow'
                }
            )
            
            logger.info(f"Created Stripe customer {customer.id} for user {user_id}")
            return {
                'success': True,
                'customer_id': customer.id,
                'customer': customer
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create Stripe customer: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def create_checkout_session(
        self, 
        customer_id: str, 
        tier: SubscriptionTier, 
        billing_cycle: str = 'monthly',
        success_url: str = None,
        cancel_url: str = None
    ) -> Dict[str, Any]:
        """Create a Stripe Checkout session for subscription"""
        try:
            plan = self.pricing_plans[tier]
            
            if tier == SubscriptionTier.FREE:
                return {
                    'success': False,
                    'error': 'Free tier does not require payment'
                }
            
            price_id = (plan.stripe_price_id_yearly if billing_cycle == 'yearly' 
                       else plan.stripe_price_id_monthly)
            
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=success_url or 'https://affiliateflow.com/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=cancel_url or 'https://affiliateflow.com/pricing',
                metadata={
                    'tier': tier.value,
                    'billing_cycle': billing_cycle
                },
                subscription_data={
                    'trial_period_days': 14,  # 14-day free trial
                    'metadata': {
                        'tier': tier.value,
                        'billing_cycle': billing_cycle
                    }
                }
            )
            
            logger.info(f"Created checkout session {session.id} for customer {customer_id}")
            return {
                'success': True,
                'session_id': session.id,
                'checkout_url': session.url
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create checkout session: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def create_subscription(
        self, 
        customer_id: str, 
        tier: SubscriptionTier, 
        billing_cycle: str = 'monthly'
    ) -> Dict[str, Any]:
        """Create a subscription directly (for API usage)"""
        try:
            plan = self.pricing_plans[tier]
            
            if tier == SubscriptionTier.FREE:
                return {
                    'success': True,
                    'subscription_id': f'free_{customer_id}',
                    'status': 'active',
                    'tier': tier.value
                }
            
            price_id = (plan.stripe_price_id_yearly if billing_cycle == 'yearly' 
                       else plan.stripe_price_id_monthly)
            
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{
                    'price': price_id,
                }],
                trial_period_days=14,
                metadata={
                    'tier': tier.value,
                    'billing_cycle': billing_cycle
                }
            )
            
            logger.info(f"Created subscription {subscription.id} for customer {customer_id}")
            return {
                'success': True,
                'subscription_id': subscription.id,
                'status': subscription.status,
                'tier': tier.value,
                'current_period_end': subscription.current_period_end
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create subscription: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def update_subscription(
        self, 
        subscription_id: str, 
        new_tier: SubscriptionTier, 
        billing_cycle: str = 'monthly'
    ) -> Dict[str, Any]:
        """Update an existing subscription (upgrade/downgrade)"""
        try:
            if subscription_id.startswith('free_'):
                # Upgrading from free tier
                customer_id = subscription_id.replace('free_', '')
                return await self.create_subscription(customer_id, new_tier, billing_cycle)
            
            subscription = stripe.Subscription.retrieve(subscription_id)
            plan = self.pricing_plans[new_tier]
            
            price_id = (plan.stripe_price_id_yearly if billing_cycle == 'yearly' 
                       else plan.stripe_price_id_monthly)
            
            updated_subscription = stripe.Subscription.modify(
                subscription_id,
                items=[{
                    'id': subscription['items']['data'][0].id,
                    'price': price_id,
                }],
                metadata={
                    'tier': new_tier.value,
                    'billing_cycle': billing_cycle
                },
                proration_behavior='create_prorations'
            )
            
            logger.info(f"Updated subscription {subscription_id} to {new_tier.value}")
            return {
                'success': True,
                'subscription_id': updated_subscription.id,
                'status': updated_subscription.status,
                'tier': new_tier.value
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to update subscription: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def cancel_subscription(self, subscription_id: str, at_period_end: bool = True) -> Dict[str, Any]:
        """Cancel a subscription"""
        try:
            if subscription_id.startswith('free_'):
                return {
                    'success': True,
                    'message': 'Free tier subscription cancelled'
                }
            
            if at_period_end:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True
                )
            else:
                subscription = stripe.Subscription.delete(subscription_id)
            
            logger.info(f"Cancelled subscription {subscription_id}")
            return {
                'success': True,
                'subscription_id': subscription_id,
                'status': subscription.status,
                'cancelled_at': subscription.canceled_at
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to cancel subscription: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def get_subscription_status(self, subscription_id: str) -> Dict[str, Any]:
        """Get current subscription status and details"""
        try:
            if subscription_id.startswith('free_'):
                return {
                    'success': True,
                    'subscription_id': subscription_id,
                    'status': 'active',
                    'tier': SubscriptionTier.FREE.value,
                    'current_period_end': None,
                    'cancel_at_period_end': False
                }
            
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            return {
                'success': True,
                'subscription_id': subscription.id,
                'status': subscription.status,
                'tier': subscription.metadata.get('tier'),
                'billing_cycle': subscription.metadata.get('billing_cycle'),
                'current_period_start': subscription.current_period_start,
                'current_period_end': subscription.current_period_end,
                'cancel_at_period_end': subscription.cancel_at_period_end,
                'trial_end': subscription.trial_end
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to get subscription status: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def create_billing_portal_session(self, customer_id: str, return_url: str = None) -> Dict[str, Any]:
        """Create a billing portal session for customer self-service"""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url or 'https://affiliateflow.com/dashboard'
            )
            
            return {
                'success': True,
                'portal_url': session.url
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create billing portal session: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def handle_webhook(self, payload: str, sig_header: str) -> Dict[str, Any]:
        """Handle Stripe webhook events"""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, self.webhook_secret
            )
            
            logger.info(f"Received Stripe webhook: {event['type']}")
            
            if event['type'] == 'customer.subscription.created':
                return await self._handle_subscription_created(event['data']['object'])
            elif event['type'] == 'customer.subscription.updated':
                return await self._handle_subscription_updated(event['data']['object'])
            elif event['type'] == 'customer.subscription.deleted':
                return await self._handle_subscription_deleted(event['data']['object'])
            elif event['type'] == 'invoice.payment_succeeded':
                return await self._handle_payment_succeeded(event['data']['object'])
            elif event['type'] == 'invoice.payment_failed':
                return await self._handle_payment_failed(event['data']['object'])
            else:
                logger.info(f"Unhandled webhook event: {event['type']}")
                return {'success': True, 'message': 'Event not handled'}
                
        except ValueError as e:
            logger.error(f"Invalid webhook payload: {str(e)}")
            return {'success': False, 'error': 'Invalid payload'}
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {str(e)}")
            return {'success': False, 'error': 'Invalid signature'}
    
    async def _handle_subscription_created(self, subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle subscription creation webhook"""
        customer_id = subscription['customer']
        tier = subscription['metadata'].get('tier')
        
        logger.info(f"Subscription created for customer {customer_id}, tier: {tier}")
        
        # Here you would update your database with the new subscription
        # Example: await self.db.update_user_subscription(customer_id, subscription['id'], tier)
        
        return {'success': True, 'message': 'Subscription created'}
    
    async def _handle_subscription_updated(self, subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle subscription update webhook"""
        customer_id = subscription['customer']
        tier = subscription['metadata'].get('tier')
        status = subscription['status']
        
        logger.info(f"Subscription updated for customer {customer_id}, tier: {tier}, status: {status}")
        
        # Update database with subscription changes
        # Example: await self.db.update_user_subscription(customer_id, subscription['id'], tier, status)
        
        return {'success': True, 'message': 'Subscription updated'}
    
    async def _handle_subscription_deleted(self, subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle subscription cancellation webhook"""
        customer_id = subscription['customer']
        
        logger.info(f"Subscription cancelled for customer {customer_id}")
        
        # Downgrade user to free tier
        # Example: await self.db.update_user_subscription(customer_id, None, 'free', 'cancelled')
        
        return {'success': True, 'message': 'Subscription cancelled'}
    
    async def _handle_payment_succeeded(self, invoice: Dict[str, Any]) -> Dict[str, Any]:
        """Handle successful payment webhook"""
        customer_id = invoice['customer']
        amount = invoice['amount_paid']
        
        logger.info(f"Payment succeeded for customer {customer_id}, amount: ${amount/100}")
        
        # Update payment history and send receipt
        # Example: await self.db.record_payment(customer_id, amount, 'succeeded')
        
        return {'success': True, 'message': 'Payment processed'}
    
    async def _handle_payment_failed(self, invoice: Dict[str, Any]) -> Dict[str, Any]:
        """Handle failed payment webhook"""
        customer_id = invoice['customer']
        amount = invoice['amount_due']
        
        logger.info(f"Payment failed for customer {customer_id}, amount: ${amount/100}")
        
        # Handle failed payment (send notification, retry logic, etc.)
        # Example: await self.db.record_payment(customer_id, amount, 'failed')
        
        return {'success': True, 'message': 'Payment failure handled'}
    
    async def get_usage_and_billing(self, customer_id: str) -> Dict[str, Any]:
        """Get customer usage and billing information"""
        try:
            # Get customer details
            customer = stripe.Customer.retrieve(customer_id)
            
            # Get active subscription
            subscriptions = stripe.Subscription.list(customer=customer_id, status='active')
            
            # Get recent invoices
            invoices = stripe.Invoice.list(customer=customer_id, limit=10)
            
            # Get payment methods
            payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
            
            return {
                'success': True,
                'customer': customer,
                'subscriptions': subscriptions.data,
                'invoices': invoices.data,
                'payment_methods': payment_methods.data
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to get usage and billing: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_pricing_plans(self) -> Dict[str, Any]:
        """Get all available pricing plans"""
        plans = {}
        for tier, plan in self.pricing_plans.items():
            plans[tier.value] = {
                'name': plan.name,
                'price_monthly': plan.price_monthly,
                'price_yearly': plan.price_yearly,
                'features': plan.features,
                'limits': plan.limits
            }
        return plans
    
    async def create_test_data(self) -> Dict[str, Any]:
        """Create test products and prices in Stripe (for development)"""
        try:
            created_items = []
            
            for tier, plan in self.pricing_plans.items():
                if tier == SubscriptionTier.FREE:
                    continue
                
                # Create product
                product = stripe.Product.create(
                    name=f"AffiliateFlow {plan.name}",
                    description=f"AffiliateFlow {plan.name} subscription tier"
                )
                
                # Create monthly price
                monthly_price = stripe.Price.create(
                    product=product.id,
                    unit_amount=plan.price_monthly,
                    currency='usd',
                    recurring={'interval': 'month'},
                    nickname=f"{plan.name} Monthly"
                )
                
                # Create yearly price
                yearly_price = stripe.Price.create(
                    product=product.id,
                    unit_amount=plan.price_yearly,
                    currency='usd',
                    recurring={'interval': 'year'},
                    nickname=f"{plan.name} Yearly"
                )
                
                created_items.append({
                    'tier': tier.value,
                    'product_id': product.id,
                    'monthly_price_id': monthly_price.id,
                    'yearly_price_id': yearly_price.id
                })
                
                logger.info(f"Created Stripe product and prices for {plan.name}")
            
            return {
                'success': True,
                'created_items': created_items,
                'message': 'Test data created successfully'
            }
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create test data: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

# Initialize global Stripe service instance
stripe_service = StripeService()

