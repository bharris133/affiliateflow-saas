# Stripe Integration Setup Guide

This guide will help you connect your Stripe account to the AffiliateFlow SaaS platform for payment processing.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Navigate to the Stripe Dashboard

### Step 2: Get API Keys
1. In your Stripe Dashboard, go to **Developers** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` for test mode)
3. Copy your **Secret Key** (starts with `sk_test_` for test mode)

### Step 3: Configure Environment Variables
Create a `.env` file in your backend directory:

```bash
# Backend: /backend/affiliate-marketing-api/.env

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/affiliateflow
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

Frontend `.env` file:
```bash
# Frontend: /frontend/affiliate-marketing-dashboard/.env

REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Step 4: Create Products and Prices in Stripe

#### Option A: Automatic Setup (Recommended)
Run the test endpoint to create all products automatically:

```bash
curl -X POST http://localhost:5000/api/stripe/test/create-products
```

#### Option B: Manual Setup
1. Go to **Products** in your Stripe Dashboard
2. Create the following products:

**AffiliateFlow Starter**
- Monthly Price: $29.00 USD
- Yearly Price: $290.00 USD (save $58)

**AffiliateFlow Professional** 
- Monthly Price: $79.00 USD
- Yearly Price: $790.00 USD (save $158)

**AffiliateFlow Enterprise**
- Monthly Price: $199.00 USD  
- Yearly Price: $1,990.00 USD (save $398)

3. Copy the Price IDs and update the `stripe_service.py` file:

```python
# Update these in /backend/affiliate-marketing-api/src/services/stripe_service.py

SubscriptionTier.STARTER: PricingPlan(
    # ... other fields ...
    stripe_price_id_monthly="price_1234567890",  # Your actual price ID
    stripe_price_id_yearly="price_0987654321",   # Your actual price ID
),
```

### Step 5: Configure Webhooks
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Secret** and add it to your `.env` file

## 🧪 Testing Your Integration

### Test Payment Flow
1. Start your application:
   ```bash
   # Backend
   cd backend/affiliate-marketing-api
   python src/main.py
   
   # Frontend  
   cd frontend/affiliate-marketing-dashboard
   pnpm run dev
   ```

2. Navigate to `http://localhost:5173/pricing`
3. Click "Upgrade" on any paid plan
4. Use Stripe test card numbers:
   - **Success**: `4242424242424242`
   - **Decline**: `4000000000000002`
   - **3D Secure**: `4000002500003155`

### Test Webhooks Locally
Use Stripe CLI to forward webhooks to your local development:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows/Linux: Download from https://github.com/stripe/stripe-cli

# Login to your Stripe account
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

## 🔧 Advanced Configuration

### Custom Pricing
To modify pricing plans, update the `PricingPlan` objects in `stripe_service.py`:

```python
SubscriptionTier.STARTER: PricingPlan(
    tier=SubscriptionTier.STARTER,
    name="Starter",
    price_monthly=2900,  # $29.00 in cents
    price_yearly=29000,  # $290.00 in cents
    stripe_price_id_monthly="price_your_monthly_id",
    stripe_price_id_yearly="price_your_yearly_id",
    features=[
        "100 AI-generated articles",
        "500 social media posts", 
        # Add more features...
    ],
    limits={
        "articles": 100,
        "social_posts": 500,
        # Add more limits...
    }
),
```

### Trial Periods
Modify trial length in `stripe_service.py`:

```python
subscription = stripe.Subscription.create(
    customer=customer_id,
    items=[{'price': price_id}],
    trial_period_days=14,  # Change this value
    # ...
)
```

### Tax Configuration
1. In Stripe Dashboard, go to **Settings** → **Tax**
2. Enable automatic tax calculation
3. Configure tax rates for your regions

## 🚀 Going Live

### Switch to Live Mode
1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Get your live API keys (start with `pk_live_` and `sk_live_`)
3. Update your production environment variables:

```bash
# Production Environment Variables
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### Production Checklist
- [ ] Account verification completed
- [ ] Bank account connected for payouts
- [ ] Tax settings configured
- [ ] Webhook endpoints updated with production URLs
- [ ] SSL certificate installed
- [ ] Test all payment flows in live mode

## 📊 Monitoring & Analytics

### Stripe Dashboard
Monitor your payments, subscriptions, and customers in the Stripe Dashboard:
- **Home**: Overview of revenue and activity
- **Payments**: All payment transactions
- **Subscriptions**: Active and cancelled subscriptions
- **Customers**: Customer management
- **Analytics**: Revenue analytics and reports

### Custom Analytics
The platform includes built-in analytics for:
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (CLV)
- Churn rate
- Subscription conversion rates

## 🆘 Troubleshooting

### Common Issues

**"Invalid API Key" Error**
- Check that you're using the correct key for your mode (test vs live)
- Ensure the key is properly set in environment variables

**Webhook Not Receiving Events**
- Verify the webhook URL is publicly accessible
- Check that the webhook secret matches your environment variable
- Use `stripe listen` for local development

**Payment Declined**
- Use test card numbers for testing
- Check if the customer has a valid payment method
- Review Stripe logs for detailed error messages

**Subscription Not Created**
- Verify the price ID exists in your Stripe account
- Check that the customer ID is valid
- Review webhook logs for subscription events

### Debug Mode
Enable debug logging in your application:

```python
# In your Flask app configuration
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Stripe Logs
Check Stripe logs in your dashboard:
1. Go to **Developers** → **Logs**
2. Filter by API calls, webhooks, or errors
3. Review request/response details

## 📞 Support

### Stripe Support
- **Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Support**: Available in your Stripe Dashboard
- **Community**: [Stripe Discord](https://discord.gg/stripe)

### AffiliateFlow Support
- **GitHub Issues**: [Report bugs and issues](https://github.com/bharris133/affiliateflow-saas/issues)
- **Documentation**: Check the main README.md
- **Email**: support@affiliateflow.com

## 🔐 Security Best Practices

### API Key Security
- Never commit API keys to version control
- Use environment variables for all keys
- Rotate keys regularly
- Use restricted API keys when possible

### Webhook Security
- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement idempotency for webhook handlers
- Log webhook events for debugging

### PCI Compliance
- Never store card details on your servers
- Use Stripe Elements for card collection
- Let Stripe handle all sensitive data
- Follow PCI DSS guidelines

---

## 🎉 You're Ready!

Once you've completed this setup, your AffiliateFlow platform will have:

✅ **Complete Payment Processing**
- Secure card payments via Stripe
- Subscription management
- Automatic billing and invoicing

✅ **Customer Self-Service**
- Billing portal for plan changes
- Payment method management
- Invoice downloads

✅ **Real-Time Webhooks**
- Automatic subscription updates
- Payment notifications
- Failed payment handling

✅ **Analytics & Reporting**
- Revenue tracking
- Subscription metrics
- Customer insights

Your SaaS platform is now ready to accept payments and manage subscriptions! 🚀

