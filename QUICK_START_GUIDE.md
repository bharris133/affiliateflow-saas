# AffiliateFlow SaaS - Quick Start Guide

## 🚀 **GET STARTED IN 5 MINUTES**

This guide will get your AffiliateFlow SaaS platform running quickly with our **completely redesigned professional interface** and **comprehensive tutorial system**.

## ⚡ **QUICK SETUP**

### **Step 1: Database Setup (2 minutes)**

```bash
# Navigate to database directory
cd affiliateflow-saas/database

# Run automated setup (Windows PowerShell)
.\setup_complete.sh

# Or use the batch script on Windows
setup_complete.bat
```

**The script automatically:**

- Creates PostgreSQL database and user
- Sets up all tables with optimized schemas
- Inserts comprehensive sample data
- Creates database views for analytics

### **Step 2: Start Backend API (1 minute)**

```bash
# Navigate to backend
cd ..\backend\affiliate-marketing-api

# Create virtual environment (if not exists)
python -m venv venv
venv\Scripts\activate  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Start Flask development server
python src/main.py
```

**Backend Features:**

- ✅ RESTful API with JWT authentication
- ✅ OpenAI integration for content generation
- ✅ Stripe integration for subscriptions
- ✅ Comprehensive analytics endpoints

**Backend will be running on:** http://localhost:5000

### **Step 3: Start Frontend Dashboard (1 minute)**

```bash
# Navigate to frontend (new terminal)
cd ..\frontend\affiliate-marketing-dashboard

# Install dependencies with pnpm (faster than npm)
pnpm install

# Start Vite development server
pnpm run dev
```

**Frontend Features:**

- ✅ Modern React dashboard with Tailwind CSS v4
- ✅ Professional gradient design with animations
- ✅ Interactive tutorial system with guided onboarding
- ✅ Comprehensive analytics with Recharts visualizations
- ✅ Multi-platform social media management
- ✅ AI-powered content generation interface

**Frontend will be running on:** http://localhost:5173

### **Step 4: Explore the Platform (1 minute)**

1. **Open browser:** http://localhost:5173
2. **Login with demo account:**
   - Email: `demo@affiliateflow.com`
   - Password: `demo123!`
3. **Take the interactive tutorial** - Click the "?" help button
4. **Explore all features** with sample data!

## 🎯 **WHAT TO EXPLORE**

### **🎓 Interactive Tutorial System**

- **Take the Guided Tour**: Click the "?" help button for step-by-step tutorials
- **Feature Walkthroughs**: Interactive demos for each major feature
- **Demo Bot**: Contextual help with simulated workflows
- **Onboarding Checklist**: Track your progress through platform setup

### **📊 Professional Dashboard**

- **Modern Analytics**: Beautiful charts showing revenue, traffic, and performance
- **Real-time Metrics**: Live updates with professional gradient design
- **Quick Actions**: One-click access to content generation and social posting
- **Goal Tracking**: Monitor progress towards revenue targets

### **🤖 AI Content Generator**

- **Multiple Content Types**: Blog posts, product reviews, social media, email campaigns
- **Template System**: Pre-built templates for different niches and industries
- **SEO Optimization**: Automatic keyword integration and meta descriptions
- **Live Editing**: Professional editor with markdown support and preview

### **📱 Social Media Manager**

- **Multi-Platform Support**: Manage 10+ social platforms from one interface
- **Visual Scheduling**: Calendar-based posting with optimal timing suggestions
- **Content Adaptation**: Automatic formatting for each platform's requirements
- **Performance Analytics**: Track engagement, clicks, and conversions

### **📈 Advanced Analytics**

- **Revenue Tracking**: Detailed revenue analysis with trend charts
- **Traffic Sources**: Comprehensive breakdown of visitor sources
- **Content Performance**: Analyze top-performing content and optimization opportunities
- **Conversion Funnels**: Track visitor journey from views to conversions

### **🔗 Affiliate Link Management**

- **Link Creation**: Easy affiliate link generation and customization
- **Click Tracking**: Monitor click-through rates and conversion metrics
- **A/B Testing**: Test different link placements and formats
- **Revenue Attribution**: Track commission earnings and payout schedules

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

### **Database Issues:**

```powershell
# Check PostgreSQL service status (Windows)
Get-Service postgresql*

# Restart PostgreSQL service
Restart-Service postgresql-x64-13

# Verify database connection
psql -h localhost -U affiliateflow_user -d affiliateflow_db
```

### **Backend Not Starting:**

```bash
# Ensure virtual environment is activated
venv\Scripts\activate

# Check for missing dependencies
pip install -r requirements.txt

# Verify environment variables
echo $DATABASE_URL  # Should show PostgreSQL connection string

# Check if port 5000 is already in use
netstat -an | findstr :5000
```

### **Frontend Not Loading:**

```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
pnpm install

# Check Vite configuration
pnpm run build  # Test build process

# Verify Tailwind CSS v4 setup
# Check if @tailwindcss/vite plugin is properly configured
```

### **Common Issues & Solutions:**

**Issue**: Blank screen on frontend

- **Solution**: Check console for Tailwind CSS import errors, ensure Tailwind v4 is properly configured

**Issue**: Tutorial system not loading

- **Solution**: Verify all tutorial components are imported in App.jsx

**Issue**: Charts not displaying

- **Solution**: Ensure Recharts library is installed: `pnpm add recharts`

**Issue**: API calls failing

- **Solution**: Check CORS settings in backend and verify API endpoints are running

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

## 🎉 **SUCCESS CHECKLIST**

If you can complete these steps, your platform is working perfectly:

### **✅ Basic Functionality**

- [ ] Access the dashboard at http://localhost:5173
- [ ] Login with demo@affiliateflow.com / demo123!
- [ ] See the professional dashboard with analytics charts
- [ ] Navigate through all main sections (Dashboard, Content, Social, Analytics)

### **✅ Tutorial System**

- [ ] Click the "?" help button to access tutorials
- [ ] Complete the onboarding checklist
- [ ] Try the interactive feature demos
- [ ] Access contextual help in different sections

### **✅ Advanced Features**

- [ ] Generate AI content using the Content Generator
- [ ] Schedule social media posts across platforms
- [ ] View detailed analytics with interactive charts
- [ ] Create and track affiliate links
- [ ] Navigate the professional UI with smooth animations

### **✅ Technical Validation**

- [ ] Backend API responding at http://localhost:5000
- [ ] Database connected with sample data loaded
- [ ] Frontend build successful with Tailwind CSS v4
- [ ] No console errors in browser developer tools
- [ ] All components render properly with professional styling

**Your AffiliateFlow SaaS platform is ready for development and testing!**

## 🚀 **NEXT STEPS**

### **For Development:**

1. **Add API Keys**: Configure OpenAI and Stripe keys for full functionality
2. **Customize Branding**: Update colors, logos, and styling to match your brand
3. **Extend Features**: Add new components or modify existing ones
4. **Database Integration**: Connect frontend components to backend APIs

### **For Production:**

1. **Environment Setup**: Configure production environment variables
2. **Security Review**: Implement proper authentication and authorization
3. **Performance Optimization**: Optimize bundle size and loading times
4. **Deployment**: Deploy to cloud platform (AWS, DigitalOcean, etc.)

### **For Business:**

1. **Content Creation**: Start creating high-quality affiliate content
2. **Social Media Setup**: Connect your social media accounts
3. **Email Lists**: Import and segment your email subscribers
4. **Revenue Tracking**: Set up affiliate partnerships and tracking

---

**🎯 Ready to build your affiliate marketing empire?**  
**The platform is fully functional with professional design and comprehensive features!**
