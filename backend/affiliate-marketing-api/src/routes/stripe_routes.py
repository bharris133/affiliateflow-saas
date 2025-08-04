"""
Stripe API Routes for AffiliateFlow SaaS Platform
Handles all payment-related API endpoints
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import asyncio
import logging
from ..services.stripe_service import stripe_service, SubscriptionTier

# Configure logging
logger = logging.getLogger(__name__)

# Create Blueprint
stripe_bp = Blueprint('stripe', __name__, url_prefix='/api/stripe')

@stripe_bp.route('/pricing', methods=['GET'])
def get_pricing_plans():
    """Get all available pricing plans"""
    try:
        plans = stripe_service.get_pricing_plans()
        return jsonify({
            'success': True,
            'plans': plans
        }), 200
    except Exception as e:
        logger.error(f"Error getting pricing plans: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get pricing plans'
        }), 500

@stripe_bp.route('/create-customer', methods=['POST'])
@jwt_required()
def create_customer():
    """Create a new Stripe customer"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        email = data.get('email')
        name = data.get('name')
        
        if not email:
            return jsonify({
                'success': False,
                'error': 'Email is required'
            }), 400
        
        # Run async function
        result = asyncio.run(stripe_service.create_customer(user_id, email, name))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error creating customer: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create customer'
        }), 500

@stripe_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    """Create a Stripe Checkout session"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        customer_id = data.get('customer_id')
        tier = data.get('tier')
        billing_cycle = data.get('billing_cycle', 'monthly')
        success_url = data.get('success_url')
        cancel_url = data.get('cancel_url')
        
        if not customer_id or not tier:
            return jsonify({
                'success': False,
                'error': 'customer_id and tier are required'
            }), 400
        
        try:
            subscription_tier = SubscriptionTier(tier)
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid subscription tier'
            }), 400
        
        result = asyncio.run(stripe_service.create_checkout_session(
            customer_id, subscription_tier, billing_cycle, success_url, cancel_url
        ))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create checkout session'
        }), 500

@stripe_bp.route('/create-subscription', methods=['POST'])
@jwt_required()
def create_subscription():
    """Create a subscription directly"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        customer_id = data.get('customer_id')
        tier = data.get('tier')
        billing_cycle = data.get('billing_cycle', 'monthly')
        
        if not customer_id or not tier:
            return jsonify({
                'success': False,
                'error': 'customer_id and tier are required'
            }), 400
        
        try:
            subscription_tier = SubscriptionTier(tier)
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid subscription tier'
            }), 400
        
        result = asyncio.run(stripe_service.create_subscription(
            customer_id, subscription_tier, billing_cycle
        ))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error creating subscription: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create subscription'
        }), 500

@stripe_bp.route('/update-subscription', methods=['PUT'])
@jwt_required()
def update_subscription():
    """Update an existing subscription"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        subscription_id = data.get('subscription_id')
        new_tier = data.get('new_tier')
        billing_cycle = data.get('billing_cycle', 'monthly')
        
        if not subscription_id or not new_tier:
            return jsonify({
                'success': False,
                'error': 'subscription_id and new_tier are required'
            }), 400
        
        try:
            subscription_tier = SubscriptionTier(new_tier)
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid subscription tier'
            }), 400
        
        result = asyncio.run(stripe_service.update_subscription(
            subscription_id, subscription_tier, billing_cycle
        ))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error updating subscription: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to update subscription'
        }), 500

@stripe_bp.route('/cancel-subscription', methods=['DELETE'])
@jwt_required()
def cancel_subscription():
    """Cancel a subscription"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        subscription_id = data.get('subscription_id')
        at_period_end = data.get('at_period_end', True)
        
        if not subscription_id:
            return jsonify({
                'success': False,
                'error': 'subscription_id is required'
            }), 400
        
        result = asyncio.run(stripe_service.cancel_subscription(
            subscription_id, at_period_end
        ))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error cancelling subscription: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to cancel subscription'
        }), 500

@stripe_bp.route('/subscription-status/<subscription_id>', methods=['GET'])
@jwt_required()
def get_subscription_status(subscription_id):
    """Get subscription status and details"""
    try:
        user_id = get_jwt_identity()
        
        result = asyncio.run(stripe_service.get_subscription_status(subscription_id))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error getting subscription status: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get subscription status'
        }), 500

@stripe_bp.route('/billing-portal', methods=['POST'])
@jwt_required()
def create_billing_portal():
    """Create billing portal session"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        customer_id = data.get('customer_id')
        return_url = data.get('return_url')
        
        if not customer_id:
            return jsonify({
                'success': False,
                'error': 'customer_id is required'
            }), 400
        
        result = asyncio.run(stripe_service.create_billing_portal_session(
            customer_id, return_url
        ))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error creating billing portal: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create billing portal'
        }), 500

@stripe_bp.route('/usage-billing/<customer_id>', methods=['GET'])
@jwt_required()
def get_usage_and_billing(customer_id):
    """Get customer usage and billing information"""
    try:
        user_id = get_jwt_identity()
        
        result = asyncio.run(stripe_service.get_usage_and_billing(customer_id))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error getting usage and billing: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get usage and billing'
        }), 500

@stripe_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    try:
        payload = request.get_data(as_text=True)
        sig_header = request.headers.get('Stripe-Signature')
        
        if not sig_header:
            return jsonify({
                'success': False,
                'error': 'Missing Stripe signature'
            }), 400
        
        result = asyncio.run(stripe_service.handle_webhook(payload, sig_header))
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error handling webhook: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to handle webhook'
        }), 500

@stripe_bp.route('/test/create-products', methods=['POST'])
def create_test_products():
    """Create test products and prices in Stripe (development only)"""
    try:
        # Only allow in development mode
        if current_app.config.get('ENV') == 'production':
            return jsonify({
                'success': False,
                'error': 'Not available in production'
            }), 403
        
        result = asyncio.run(stripe_service.create_test_data())
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Error creating test products: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create test products'
        }), 500

# Error handlers
@stripe_bp.errorhandler(400)
def bad_request(error):
    return jsonify({
        'success': False,
        'error': 'Bad request'
    }), 400

@stripe_bp.errorhandler(401)
def unauthorized(error):
    return jsonify({
        'success': False,
        'error': 'Unauthorized'
    }), 401

@stripe_bp.errorhandler(403)
def forbidden(error):
    return jsonify({
        'success': False,
        'error': 'Forbidden'
    }), 403

@stripe_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Not found'
    }), 404

@stripe_bp.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

