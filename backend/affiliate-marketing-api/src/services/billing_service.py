import stripe
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Float, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import uuid
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
import smtplib
import logging

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    stripe_customer_id = Column(String)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    usage_records = relationship("UsageRecord", back_populates="user")
    api_keys = relationship("ApiKey", back_populates="user")

class Subscription(Base):
    __tablename__ = 'subscriptions'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    stripe_subscription_id = Column(String)
    plan_id = Column(String, nullable=False)  # free, starter, professional, enterprise
    status = Column(String, nullable=False)  # active, canceled, past_due, etc.
    current_period_start = Column(DateTime)
    current_period_end = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Plan limits
    monthly_content_limit = Column(Integer, default=10)
    monthly_social_posts_limit = Column(Integer, default=50)
    monthly_emails_limit = Column(Integer, default=100)
    affiliate_links_limit = Column(Integer, default=25)
    team_members_limit = Column(Integer, default=1)
    
    # Relationships
    user = relationship("User", back_populates="subscription")

class UsageRecord(Base):
    __tablename__ = 'usage_records'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    resource_type = Column(String, nullable=False)  # content, social_post, email, etc.
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    billing_period = Column(String)  # YYYY-MM format
    
    # Relationships
    user = relationship("User", back_populates="usage_records")

class ApiKey(Base):
    __tablename__ = 'api_keys'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    name = Column(String, nullable=False)
    key_hash = Column(String, nullable=False)
    key_prefix = Column(String, nullable=False)  # First 8 chars for display
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")

class BillingService:
    """Comprehensive billing and subscription management service"""
    
    def __init__(self, database_url: str = None):
        self.database_url = database_url or os.getenv('DATABASE_URL', 'sqlite:///affiliate_saas.db')
        self.engine = create_engine(self.database_url)
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
        
        # Plan configurations
        self.plans = {
            'free': {
                'name': 'Free',
                'price': 0,
                'stripe_price_id': None,
                'limits': {
                    'monthly_content': 10,
                    'monthly_social_posts': 50,
                    'monthly_emails': 100,
                    'affiliate_links': 25,
                    'team_members': 1
                },
                'features': [
                    'AI content generation',
                    'Social media posting',
                    'Email campaigns',
                    'Basic analytics',
                    'Email support'
                ]
            },
            'starter': {
                'name': 'Starter',
                'price': 29,
                'stripe_price_id': 'price_starter_monthly',
                'limits': {
                    'monthly_content': 100,
                    'monthly_social_posts': 500,
                    'monthly_emails': 1000,
                    'affiliate_links': 100,
                    'team_members': 1
                },
                'features': [
                    'Everything in Free',
                    'Advanced analytics',
                    'Content scheduling',
                    'SEO optimization',
                    'Priority support'
                ]
            },
            'professional': {
                'name': 'Professional',
                'price': 79,
                'stripe_price_id': 'price_professional_monthly',
                'limits': {
                    'monthly_content': -1,  # Unlimited
                    'monthly_social_posts': -1,
                    'monthly_emails': -1,
                    'affiliate_links': -1,
                    'team_members': 5
                },
                'features': [
                    'Everything in Starter',
                    'Unlimited content',
                    'A/B testing',
                    'Custom templates',
                    'Team collaboration',
                    'Phone support'
                ]
            },
            'enterprise': {
                'name': 'Enterprise',
                'price': 199,
                'stripe_price_id': 'price_enterprise_monthly',
                'limits': {
                    'monthly_content': -1,
                    'monthly_social_posts': -1,
                    'monthly_emails': -1,
                    'affiliate_links': -1,
                    'team_members': -1
                },
                'features': [
                    'Everything in Professional',
                    'White-label solution',
                    'Custom integrations',
                    'Dedicated support',
                    'SLA guarantee'
                ]
            }
        }
    
    def create_user(self, email: str, password: str, name: str) -> Dict:
        """Create a new user account"""
        try:
            # Check if user already exists
            existing_user = self.session.query(User).filter_by(email=email).first()
            if existing_user:
                raise ValueError("User with this email already exists")
            
            # Hash password
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create Stripe customer
            stripe_customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata={'source': 'affiliate_saas'}
            )
            
            # Create user
            user = User(
                email=email,
                password_hash=password_hash,
                name=name,
                stripe_customer_id=stripe_customer.id
            )
            self.session.add(user)
            self.session.flush()
            
            # Create free subscription
            subscription = Subscription(
                user_id=user.id,
                plan_id='free',
                status='active',
                current_period_start=datetime.utcnow(),
                current_period_end=datetime.utcnow() + timedelta(days=30),
                **{f"{k}_limit": v for k, v in self.plans['free']['limits'].items()}
            )
            self.session.add(subscription)
            self.session.commit()
            
            # Send welcome email
            self._send_welcome_email(user)
            
            return {
                'user_id': user.id,
                'email': user.email,
                'name': user.name,
                'subscription': {
                    'plan': 'free',
                    'status': 'active'
                }
            }
            
        except Exception as e:
            self.session.rollback()
            raise e
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """Authenticate user login"""
        user = self.session.query(User).filter_by(email=email, is_active=True).first()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            # Generate JWT token
            token = jwt.encode({
                'user_id': user.id,
                'email': user.email,
                'exp': datetime.utcnow() + timedelta(days=7)
            }, os.getenv('JWT_SECRET', 'your-secret-key'), algorithm='HS256')
            
            return {
                'user_id': user.id,
                'email': user.email,
                'name': user.name,
                'token': token,
                'subscription': self._get_user_subscription_info(user.id)
            }
        
        return None
    
    def create_subscription(self, user_id: str, plan_id: str, payment_method_id: str = None) -> Dict:
        """Create or upgrade a subscription"""
        try:
            user = self.session.query(User).filter_by(id=user_id).first()
            if not user:
                raise ValueError("User not found")
            
            plan = self.plans.get(plan_id)
            if not plan:
                raise ValueError("Invalid plan")
            
            # Handle free plan
            if plan_id == 'free':
                return self._downgrade_to_free(user_id)
            
            # Create Stripe subscription
            subscription_data = {
                'customer': user.stripe_customer_id,
                'items': [{'price': plan['stripe_price_id']}],
                'metadata': {'user_id': user_id, 'plan_id': plan_id}
            }
            
            if payment_method_id:
                subscription_data['default_payment_method'] = payment_method_id
            
            stripe_subscription = stripe.Subscription.create(**subscription_data)
            
            # Update or create subscription record
            existing_subscription = self.session.query(Subscription).filter_by(user_id=user_id).first()
            
            if existing_subscription:
                # Update existing subscription
                existing_subscription.stripe_subscription_id = stripe_subscription.id
                existing_subscription.plan_id = plan_id
                existing_subscription.status = stripe_subscription.status
                existing_subscription.current_period_start = datetime.fromtimestamp(stripe_subscription.current_period_start)
                existing_subscription.current_period_end = datetime.fromtimestamp(stripe_subscription.current_period_end)
                existing_subscription.updated_at = datetime.utcnow()
                
                # Update limits
                for limit_key, limit_value in plan['limits'].items():
                    setattr(existing_subscription, f"{limit_key}_limit", limit_value)
                
                subscription = existing_subscription
            else:
                # Create new subscription
                subscription = Subscription(
                    user_id=user_id,
                    stripe_subscription_id=stripe_subscription.id,
                    plan_id=plan_id,
                    status=stripe_subscription.status,
                    current_period_start=datetime.fromtimestamp(stripe_subscription.current_period_start),
                    current_period_end=datetime.fromtimestamp(stripe_subscription.current_period_end),
                    **{f"{k}_limit": v for k, v in plan['limits'].items()}
                )
                self.session.add(subscription)
            
            self.session.commit()
            
            # Send confirmation email
            self._send_subscription_confirmation_email(user, plan)
            
            return {
                'subscription_id': subscription.id,
                'plan': plan_id,
                'status': stripe_subscription.status,
                'current_period_end': subscription.current_period_end.isoformat()
            }
            
        except Exception as e:
            self.session.rollback()
            raise e
    
    def cancel_subscription(self, user_id: str) -> Dict:
        """Cancel a user's subscription"""
        try:
            subscription = self.session.query(Subscription).filter_by(user_id=user_id).first()
            if not subscription or subscription.plan_id == 'free':
                raise ValueError("No active subscription to cancel")
            
            # Cancel Stripe subscription
            if subscription.stripe_subscription_id:
                stripe.Subscription.modify(
                    subscription.stripe_subscription_id,
                    cancel_at_period_end=True
                )
            
            subscription.status = 'canceled'
            subscription.updated_at = datetime.utcnow()
            self.session.commit()
            
            return {
                'message': 'Subscription canceled successfully',
                'access_until': subscription.current_period_end.isoformat()
            }
            
        except Exception as e:
            self.session.rollback()
            raise e
    
    def check_usage_limits(self, user_id: str, resource_type: str) -> Dict:
        """Check if user has exceeded usage limits"""
        subscription = self.session.query(Subscription).filter_by(user_id=user_id).first()
        if not subscription:
            return {'allowed': False, 'reason': 'No subscription found'}
        
        # Get current billing period
        current_period = datetime.utcnow().strftime('%Y-%m')
        
        # Get usage for current period
        usage_count = self.session.query(UsageRecord).filter_by(
            user_id=user_id,
            resource_type=resource_type,
            billing_period=current_period
        ).count()
        
        # Get limit for resource type
        limit_attr = f"{resource_type}_limit"
        limit = getattr(subscription, limit_attr, 0)
        
        # -1 means unlimited
        if limit == -1:
            return {'allowed': True, 'usage': usage_count, 'limit': 'unlimited'}
        
        allowed = usage_count < limit
        return {
            'allowed': allowed,
            'usage': usage_count,
            'limit': limit,
            'remaining': max(0, limit - usage_count)
        }
    
    def record_usage(self, user_id: str, resource_type: str, quantity: int = 1) -> bool:
        """Record usage for billing purposes"""
        try:
            # Check limits first
            limit_check = self.check_usage_limits(user_id, resource_type)
            if not limit_check['allowed']:
                return False
            
            # Record usage
            current_period = datetime.utcnow().strftime('%Y-%m')
            usage_record = UsageRecord(
                user_id=user_id,
                resource_type=resource_type,
                quantity=quantity,
                billing_period=current_period
            )
            self.session.add(usage_record)
            self.session.commit()
            
            return True
            
        except Exception as e:
            self.session.rollback()
            logging.error(f"Error recording usage: {e}")
            return False
    
    def get_usage_analytics(self, user_id: str, period: str = None) -> Dict:
        """Get usage analytics for a user"""
        if not period:
            period = datetime.utcnow().strftime('%Y-%m')
        
        usage_records = self.session.query(UsageRecord).filter_by(
            user_id=user_id,
            billing_period=period
        ).all()
        
        # Aggregate usage by resource type
        usage_summary = {}
        for record in usage_records:
            resource_type = record.resource_type
            if resource_type not in usage_summary:
                usage_summary[resource_type] = 0
            usage_summary[resource_type] += record.quantity
        
        # Get subscription limits
        subscription = self.session.query(Subscription).filter_by(user_id=user_id).first()
        limits = {}
        if subscription:
            for resource_type in ['monthly_content', 'monthly_social_posts', 'monthly_emails', 'affiliate_links']:
                limit_attr = f"{resource_type}_limit"
                limits[resource_type] = getattr(subscription, limit_attr, 0)
        
        return {
            'period': period,
            'usage': usage_summary,
            'limits': limits,
            'subscription_plan': subscription.plan_id if subscription else 'free'
        }
    
    def create_api_key(self, user_id: str, name: str) -> Dict:
        """Create a new API key for a user"""
        try:
            # Generate API key
            api_key = f"ak_live_{uuid.uuid4().hex}"
            key_hash = bcrypt.hashpw(api_key.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            key_prefix = api_key[:8]
            
            # Store API key
            api_key_record = ApiKey(
                user_id=user_id,
                name=name,
                key_hash=key_hash,
                key_prefix=key_prefix
            )
            self.session.add(api_key_record)
            self.session.commit()
            
            return {
                'id': api_key_record.id,
                'name': name,
                'key': api_key,  # Only returned once
                'prefix': key_prefix,
                'created_at': api_key_record.created_at.isoformat()
            }
            
        except Exception as e:
            self.session.rollback()
            raise e
    
    def validate_api_key(self, api_key: str) -> Optional[str]:
        """Validate an API key and return user_id if valid"""
        api_key_records = self.session.query(ApiKey).filter_by(is_active=True).all()
        
        for record in api_key_records:
            if bcrypt.checkpw(api_key.encode('utf-8'), record.key_hash.encode('utf-8')):
                # Update last used timestamp
                record.last_used = datetime.utcnow()
                self.session.commit()
                return record.user_id
        
        return None
    
    def process_webhook(self, event_type: str, event_data: Dict) -> bool:
        """Process Stripe webhook events"""
        try:
            if event_type == 'invoice.payment_succeeded':
                subscription_id = event_data['subscription']
                subscription = self.session.query(Subscription).filter_by(
                    stripe_subscription_id=subscription_id
                ).first()
                
                if subscription:
                    subscription.status = 'active'
                    subscription.updated_at = datetime.utcnow()
                    self.session.commit()
            
            elif event_type == 'invoice.payment_failed':
                subscription_id = event_data['subscription']
                subscription = self.session.query(Subscription).filter_by(
                    stripe_subscription_id=subscription_id
                ).first()
                
                if subscription:
                    subscription.status = 'past_due'
                    subscription.updated_at = datetime.utcnow()
                    self.session.commit()
            
            elif event_type == 'customer.subscription.deleted':
                subscription_id = event_data['id']
                subscription = self.session.query(Subscription).filter_by(
                    stripe_subscription_id=subscription_id
                ).first()
                
                if subscription:
                    # Downgrade to free plan
                    self._downgrade_to_free(subscription.user_id)
            
            return True
            
        except Exception as e:
            logging.error(f"Webhook processing error: {e}")
            return False
    
    def _get_user_subscription_info(self, user_id: str) -> Dict:
        """Get subscription information for a user"""
        subscription = self.session.query(Subscription).filter_by(user_id=user_id).first()
        if not subscription:
            return {'plan': 'free', 'status': 'active'}
        
        return {
            'plan': subscription.plan_id,
            'status': subscription.status,
            'current_period_end': subscription.current_period_end.isoformat() if subscription.current_period_end else None,
            'limits': {
                'monthly_content': subscription.monthly_content_limit,
                'monthly_social_posts': subscription.monthly_social_posts_limit,
                'monthly_emails': subscription.monthly_emails_limit,
                'affiliate_links': subscription.affiliate_links_limit,
                'team_members': subscription.team_members_limit
            }
        }
    
    def _downgrade_to_free(self, user_id: str) -> Dict:
        """Downgrade user to free plan"""
        subscription = self.session.query(Subscription).filter_by(user_id=user_id).first()
        if subscription:
            subscription.plan_id = 'free'
            subscription.status = 'active'
            subscription.stripe_subscription_id = None
            subscription.current_period_start = datetime.utcnow()
            subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
            subscription.updated_at = datetime.utcnow()
            
            # Update limits to free plan
            free_limits = self.plans['free']['limits']
            for limit_key, limit_value in free_limits.items():
                setattr(subscription, f"{limit_key}_limit", limit_value)
            
            self.session.commit()
        
        return {'plan': 'free', 'status': 'active'}
    
    def _send_welcome_email(self, user: User):
        """Send welcome email to new user"""
        # Email implementation would go here
        pass
    
    def _send_subscription_confirmation_email(self, user: User, plan: Dict):
        """Send subscription confirmation email"""
        # Email implementation would go here
        pass

class UserManagementService:
    """User management and authentication service"""
    
    def __init__(self, billing_service: BillingService):
        self.billing_service = billing_service
        self.session = billing_service.session
    
    def update_user_profile(self, user_id: str, updates: Dict) -> Dict:
        """Update user profile information"""
        try:
            user = self.session.query(User).filter_by(id=user_id).first()
            if not user:
                raise ValueError("User not found")
            
            # Update allowed fields
            allowed_fields = ['name', 'email']
            for field in allowed_fields:
                if field in updates:
                    setattr(user, field, updates[field])
            
            user.updated_at = datetime.utcnow()
            self.session.commit()
            
            return {
                'user_id': user.id,
                'email': user.email,
                'name': user.name,
                'updated_at': user.updated_at.isoformat()
            }
            
        except Exception as e:
            self.session.rollback()
            raise e
    
    def change_password(self, user_id: str, current_password: str, new_password: str) -> bool:
        """Change user password"""
        try:
            user = self.session.query(User).filter_by(id=user_id).first()
            if not user:
                return False
            
            # Verify current password
            if not bcrypt.checkpw(current_password.encode('utf-8'), user.password_hash.encode('utf-8')):
                return False
            
            # Hash new password
            new_password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user.password_hash = new_password_hash
            user.updated_at = datetime.utcnow()
            
            self.session.commit()
            return True
            
        except Exception as e:
            self.session.rollback()
            return False
    
    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate a user account"""
        try:
            user = self.session.query(User).filter_by(id=user_id).first()
            if not user:
                return False
            
            user.is_active = False
            user.updated_at = datetime.utcnow()
            
            # Cancel subscription if active
            subscription = self.session.query(Subscription).filter_by(user_id=user_id).first()
            if subscription and subscription.stripe_subscription_id:
                stripe.Subscription.delete(subscription.stripe_subscription_id)
            
            self.session.commit()
            return True
            
        except Exception as e:
            self.session.rollback()
            return False
    
    def get_user_stats(self, user_id: str) -> Dict:
        """Get comprehensive user statistics"""
        user = self.session.query(User).filter_by(id=user_id).first()
        if not user:
            return {}
        
        # Get usage analytics
        usage_analytics = self.billing_service.get_usage_analytics(user_id)
        
        # Get API key count
        api_key_count = self.session.query(ApiKey).filter_by(user_id=user_id, is_active=True).count()
        
        # Get subscription info
        subscription_info = self.billing_service._get_user_subscription_info(user_id)
        
        return {
            'user_info': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'created_at': user.created_at.isoformat(),
                'email_verified': user.email_verified
            },
            'subscription': subscription_info,
            'usage': usage_analytics,
            'api_keys': api_key_count,
            'account_status': 'active' if user.is_active else 'inactive'
        }

