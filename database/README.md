# AffiliateFlow Database Setup

This directory contains all the SQL scripts and setup tools needed to create and configure the PostgreSQL database for the AffiliateFlow SaaS platform.

## 📁 Files Overview

| File | Description |
|------|-------------|
| `01_create_database.sql` | Creates the database, user, and extensions |
| `02_create_tables.sql` | Creates all tables, indexes, and constraints |
| `03_insert_seed_data.sql` | Inserts initial data and demo content |
| `04_create_views.sql` | Creates analytics and reporting views |
| `setup_database.sh` | Automated setup script (recommended) |
| `README.md` | This documentation file |

## 🚀 Quick Setup (Recommended)

The easiest way to set up the database is using the automated script:

```bash
cd database/
./setup_database.sh
```

The script will:
- ✅ Check PostgreSQL installation and status
- ✅ Prompt for a secure database password
- ✅ Create database and user
- ✅ Create all tables and indexes
- ✅ Insert seed data and demo content
- ✅ Create analytics views
- ✅ Update your .env file with database configuration
- ✅ Verify the installation

## 📋 Prerequisites

### 1. PostgreSQL Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Verify PostgreSQL is Running

```bash
pg_isready -h localhost -p 5432
```

## 🔧 Manual Setup (Alternative)

If you prefer to run the scripts manually:

### Step 1: Create Database and User

```bash
# Run as PostgreSQL superuser
sudo -u postgres psql -f 01_create_database.sql

# Or if you have a different setup:
psql -h localhost -U postgres -f 01_create_database.sql
```

**Important:** Edit `01_create_database.sql` first to change the default password!

### Step 2: Create Tables

```bash
PGPASSWORD=your_password psql -h localhost -U affiliateflow_user -d affiliateflow_db -f 02_create_tables.sql
```

### Step 3: Insert Seed Data

```bash
PGPASSWORD=your_password psql -h localhost -U affiliateflow_user -d affiliateflow_db -f 03_insert_seed_data.sql
```

### Step 4: Create Views

```bash
PGPASSWORD=your_password psql -h localhost -U affiliateflow_user -d affiliateflow_db -f 04_create_views.sql
```

## 🗄️ Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts and authentication |
| `user_profiles` | Extended user information |
| `subscription_plans` | Available subscription tiers |
| `user_subscriptions` | User subscription status |
| `payments` | Payment history and transactions |

### Content Management

| Table | Purpose |
|-------|---------|
| `content_types` | Types of content (blog, social, email) |
| `generated_content` | AI-generated content |
| `content_optimizations` | Content optimization history |

### Social Media

| Table | Purpose |
|-------|---------|
| `social_platforms` | Supported social media platforms |
| `user_social_accounts` | Connected social media accounts |
| `social_posts` | Social media posts |
| `social_post_platforms` | Post distribution across platforms |

### Affiliate Marketing

| Table | Purpose |
|-------|---------|
| `affiliate_programs` | Affiliate programs |
| `affiliate_links` | Tracked affiliate links |
| `link_clicks` | Click tracking data |
| `conversions` | Conversion tracking |

### Email Marketing

| Table | Purpose |
|-------|---------|
| `email_lists` | Email subscriber lists |
| `email_subscribers` | Email subscribers |
| `email_campaigns` | Email campaigns |
| `email_tracking` | Email engagement tracking |

### Analytics

| Table | Purpose |
|-------|---------|
| `analytics_events` | User behavior tracking |
| `analytics_daily_summaries` | Daily analytics aggregations |
| `revenue_records` | Revenue tracking |

## 📊 Analytics Views

The database includes several pre-built views for analytics and reporting:

| View | Purpose |
|------|---------|
| `user_dashboard_summary` | Complete user dashboard data |
| `affiliate_link_performance` | Link performance metrics |
| `social_media_performance` | Social media engagement stats |
| `email_campaign_performance` | Email marketing metrics |
| `revenue_analytics` | Revenue and growth analytics |
| `content_performance` | Content effectiveness metrics |
| `user_activity_timeline` | User activity feed |
| `platform_comparison` | Social platform comparison |
| `subscription_analytics` | Subscription and churn metrics |

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **UUID Primary Keys**: All tables use UUIDs for better security
- **Audit Logging**: Complete audit trail for all user actions
- **Session Management**: Secure session handling
- **API Key Management**: Secure API key storage and validation

## 🎯 Demo Data

The setup includes demo data for testing:

**Demo User Account:**
- Email: `demo@affiliateflow.com`
- Password: `demo123!`

**Sample Data Includes:**
- ✅ 4 subscription plans (Free, Starter, Professional, Enterprise)
- ✅ 10 content types (blog posts, social media, emails, etc.)
- ✅ 10 social media platforms
- ✅ Sample generated content
- ✅ Sample affiliate links and tracking data
- ✅ Sample analytics data (last 30 days)

## 🔧 Configuration

### Environment Variables

After setup, update your `.env` file with the database configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://affiliateflow_user:your_password@localhost:5432/affiliateflow_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=affiliateflow_db
DB_USER=affiliateflow_user
DB_PASSWORD=your_secure_password
```

### Connection Pooling (Production)

For production, consider using connection pooling:

```env
# Example with pgbouncer
DATABASE_URL=postgresql://affiliateflow_user:password@localhost:6432/affiliateflow_db
```

## 🚨 Troubleshooting

### Common Issues

**1. PostgreSQL not running:**
```bash
sudo systemctl start postgresql
# or on macOS:
brew services start postgresql
```

**2. Permission denied:**
```bash
# Make sure you're running as the correct user
sudo -u postgres psql
```

**3. Database already exists:**
```sql
-- Drop and recreate if needed
DROP DATABASE IF EXISTS affiliateflow_db;
DROP USER IF EXISTS affiliateflow_user;
```

**4. Connection refused:**
- Check PostgreSQL is running on the correct port
- Verify `pg_hba.conf` allows connections
- Check firewall settings

### Logs and Debugging

**Check PostgreSQL logs:**
```bash
# Ubuntu/Debian
sudo tail -f /var/log/postgresql/postgresql-*.log

# macOS (Homebrew)
tail -f /usr/local/var/log/postgres.log
```

**Test database connection:**
```bash
psql -h localhost -U affiliateflow_user -d affiliateflow_db -c "SELECT version();"
```

## 🔄 Maintenance

### Backup

```bash
# Create backup
pg_dump -h localhost -U affiliateflow_user affiliateflow_db > backup.sql

# Restore backup
psql -h localhost -U affiliateflow_user -d affiliateflow_db < backup.sql
```

### Updates

When updating the schema:
1. Create migration scripts
2. Test on a copy of production data
3. Run during maintenance windows
4. Always backup before migrations

## 📈 Performance Optimization

The database includes several performance optimizations:

- **Indexes**: Strategic indexes on frequently queried columns
- **Partitioning**: Ready for partitioning on large tables (analytics_events, link_clicks)
- **Views**: Pre-computed views for complex analytics queries
- **Triggers**: Automatic timestamp updates

### Monitoring Queries

```sql
-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Check PostgreSQL logs for detailed error messages
4. Ensure you're using a supported PostgreSQL version (12+)

For additional help, refer to the main project documentation or create an issue in the repository.

