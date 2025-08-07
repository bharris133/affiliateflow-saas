# AffiliateFlow SaaS - Quick Start Guide

## 🚀 **GET STARTED IN 5 MINUTES**

This guide will get your AffiliateFlow SaaS platform running quickly with our **completely redesigned professional interface** and **comprehensive tutorial system**.

## ⚡ **QUICK COMMANDS REFERENCE**

**Backend startup (WORKING SOLUTION):**

- **Git Bash/WSL**: `source venv/Scripts/activate` then `python src/main.py`
- **PowerShell Alternative**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` then `.\venv\Scripts\Activate.ps1` then `python src\main.py`
- **Direct Path**: `.\venv\Scripts\python.exe src\main.py` (skip activation)

**Frontend startup:**

- Any terminal: `pnpm run dev`

**Database demo login:**

- Email: `demo@affiliateflow.com`
- Password: `demo123!`

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
cd backend/affiliate-marketing-api

# Activate virtual environment (Git Bash/WSL)
source venv/Scripts/activate

# Start Flask development server
python src/main.py
```

**Note**: Git Bash or WSL works best for virtual environment activation. After activation, you should see `(venv)` in your prompt.

**Backend Features:**

- ✅ RESTful API with JWT authentication
- ✅ OpenAI integration for content generation
- ✅ Stripe integration for subscriptions
- ✅ Comprehensive analytics endpoints

**Backend will be running on:** http://localhost:5000

### **Step 3: Start Frontend Dashboard (1 minute)**

```bash
# Navigate to frontend (new terminal)
cd frontend/affiliate-marketing-dashboard

# Start Vite development server (dependencies already installed)
pnpm run dev
```

**Note**: After initial setup, `pnpm run dev` works directly since dependencies are already installed.

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

- **Comprehensive Coverage**: Step-by-step tutorials for ALL platform features - Dashboard, Content Generation, Social Media, Analytics, Affiliate Links, Email Marketing, Subscription Management, and Settings
- **Smart Suggestions**: Page-specific tour recommendations based on your current location
- **Progress Tracking**: Visual completion indicators and progress tracking across all tours
- **Complete Workflows**: End-to-end demonstrations showing real affiliate marketing workflows
- **Quick Actions**: One-click shortcuts to jump directly to key features
- **Feature Categories**: Organized into Core Platform, Advanced Features, and Setup & Configuration
- **Interactive Highlighting**: Real element highlighting with contextual tooltips and smooth navigation

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

### **Backend Not Starting (ModuleNotFoundError):**

If you get `ModuleNotFoundError: No module named 'dotenv'`, the virtual environment isn't properly activated. Try these solutions:

**SOLUTION 1: PowerShell Script Execution (Most Common Fix)**

```powershell
cd backend/affiliate-marketing-api
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
python src/main.py
```

**SOLUTION 2: Batch File Activation**

```cmd
cd backend/affiliate-marketing-api
venv\Scripts\activate.bat
python src/main.py
```

**SOLUTION 3: Direct Python Path**

```powershell
cd backend/affiliate-marketing-api
.\venv\Scripts\python.exe src/main.py
```

**SOLUTION 4: Force PowerShell Activation**

```powershell
cd backend/affiliate-marketing-api
& ".\venv\Scripts\Activate.ps1"
python src/main.py
```

**Verify Activation Works:**
After activation, your prompt should show `(venv)` at the beginning. Test with:

```powershell
python -c "import dotenv; print('Virtual environment is working!')"
```

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
./venv/Scripts/activate

# Check for missing dependencies
pip install -r requirements.txt

# Verify environment variables
echo $DATABASE_URL  # Should show PostgreSQL connection string

# Check if port 5000 is already in use
netstat -an | findstr :5000
```

### **Frontend Not Loading:**

**If you see a blank page at localhost:5173, try these solutions in order:**

**SOLUTION 1: Check for JavaScript errors**

```bash
# Open browser developer tools (F12) and check Console tab for errors
# Look for red error messages
```

**SOLUTION 2: Restart the Vite dev server**

```bash
cd frontend/affiliate-marketing-dashboard
# Stop the server (Ctrl+C) then restart
pnpm run dev
```

**SOLUTION 3: Clear cache and reinstall**

```bash
cd frontend/affiliate-marketing-dashboard
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue
pnpm install
pnpm run dev
```

**SOLUTION 4: Check Vite configuration**

```bash
# Test if the build process works
pnpm run build

# If build fails, check vite.config.js
```

**SOLUTION 5: Verify React components**

```bash
# Check if main files exist
ls src/main.jsx
ls src/App.jsx
ls src/index.css
```

### **Common Issues & Solutions:**

**Issue**: Blank screen on frontend

- **Solution**: Check console for Tailwind CSS import errors, ensure Tailwind v4 is properly configured

**Issue**: Tutorial system not loading properly

- **Solution**: The tutorial system now uses modern backdrop blur overlays instead of dark backgrounds. Click the "?" help button in the lower right corner to access tutorials with the improved interface.

**Issue**: Tutorial overlay appears black or dark

**Issue**: Tutorial overlay appears black or dark

- **Solution**: Updated to use modern transparent blur effects. If you see old dark overlays, restart the frontend server with `pnpm run dev`.

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
