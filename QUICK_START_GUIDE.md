# AffiliateFlow SaaS - Quick Start Guide

## 🚀 **GET STARTED IN 5 MINUTES**

This guide will get your AffiliateFlow SaaS platform running quickly.

## ⚡ **QUICK SETUP**

### **Step 1: Database Setup (2 minutes)**

```bash
# Navigate to database directory
cd affiliate-marketing-saas/database

# Run automated setup
./setup_complete.sh
```

**Follow the prompts** - the script handles everything automatically!

### **Step 2: Start Backend (1 minute)**

```bash
# Navigate to backend
cd ../backend/affiliate-marketing-api

# Install dependencies (if not already done)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start server
python src/main.py
```

**Backend will be running on:** http://localhost:5000

### **Step 3: Start Frontend (1 minute)**

```bash
# Navigate to frontend (new terminal)
cd ../frontend/affiliate-marketing-dashboard

# Install dependencies (if not already done)
npm install  # or pnpm install

# Start development server
npm run dev
```

**Frontend will be running on:** http://localhost:5173

### **Step 4: Login and Test (1 minute)**

1. **Open browser:** http://localhost:5173
2. **Login with demo account:**
   - Email: `demo@affiliateflow.com`
   - Password: `demo123!`
3. **Explore the dashboard** and test features!

## 🎯 **WHAT TO TEST**

✅ **Dashboard Analytics** - View user metrics and performance  
✅ **Content Generation** - Create AI-powered content (requires OpenAI API key)  
✅ **Social Media Management** - Multi-platform posting simulation  
✅ **Affiliate Link Tracking** - Create and monitor affiliate links  
✅ **Email Marketing** - Manage lists and campaigns  
✅ **Interactive Tutorials** - Guided onboarding system  

## 🔑 **CREDENTIALS**

**Database:**
- Host: localhost:5432
- Database: affiliateflow_db
- User: affiliateflow_user
- Password: AffiliateFlow2024!SecurePass

**Demo Account:**
- Email: demo@affiliateflow.com
- Password: demo123!

## ⚙️ **ADD API KEYS (Optional)**

To test all features, add these to your `.env` file:

```env
# AI Content Generation
OPENAI_API_KEY=your-openai-api-key

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Social Media (optional)
FACEBOOK_APP_ID=your-facebook-app-id
TWITTER_API_KEY=your-twitter-api-key
# ... etc
```

## 🔧 **TROUBLESHOOTING**

**Database issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart if needed
sudo systemctl restart postgresql
```

**Backend not starting:**
```bash
# Check if virtual environment is activated
source venv/bin/activate

# Install missing dependencies
pip install -r requirements.txt
```

**Frontend not loading:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📱 **FEATURES TO EXPLORE**

### **Dashboard**
- User analytics and metrics
- Revenue tracking
- Performance charts

### **Content Generator**
- AI-powered blog posts
- Social media content
- Email campaigns
- Product reviews

### **Social Media Manager**
- Multi-platform posting
- Content scheduling
- Engagement tracking

### **Affiliate Marketing**
- Link creation and tracking
- Click analytics
- Conversion tracking
- Commission calculations

### **Email Marketing**
- List management
- Campaign creation
- Engagement analytics

## 🎉 **SUCCESS!**

If you can:
- ✅ Access the dashboard at http://localhost:5173
- ✅ Login with demo@affiliateflow.com
- ✅ See analytics data and charts
- ✅ Navigate through different sections

**Your AffiliateFlow SaaS platform is working perfectly!**

## 🚀 **NEXT STEPS**

1. **Add your API keys** for full functionality
2. **Customize the branding** and styling
3. **Deploy to production** when ready
4. **Start building your affiliate marketing business!**

---

**Need help?** Check the full `DATABASE_SETUP_GUIDE.md` for detailed instructions and troubleshooting.

