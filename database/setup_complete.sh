#!/bin/bash

# AffiliateFlow SaaS Platform - Complete Database Setup Script
# This script automates the entire database setup process
# Run this script with: ./setup_complete.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if PostgreSQL is installed and running
check_postgresql() {
    print_status "Checking PostgreSQL installation..."
    
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed. Please install PostgreSQL first."
        echo "Ubuntu/Debian: sudo apt update && sudo apt install postgresql postgresql-contrib"
        echo "CentOS/RHEL: sudo yum install postgresql postgresql-server"
        echo "macOS: brew install postgresql"
        exit 1
    fi
    
    if ! sudo systemctl is-active --quiet postgresql; then
        print_warning "PostgreSQL is not running. Starting PostgreSQL..."
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    fi
    
    print_success "PostgreSQL is installed and running"
}

# Function to check if database exists
database_exists() {
    sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$1"
}

# Function to check if user exists
user_exists() {
    sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$1'" | grep -q 1
}

# Function to run SQL file as postgres user
run_sql_as_postgres() {
    local sql_file="$1"
    print_status "Running $sql_file as postgres user..."
    
    if [ ! -f "$sql_file" ]; then
        print_error "SQL file $sql_file not found!"
        exit 1
    fi
    
    sudo -u postgres psql -f "$sql_file"
    
    if [ $? -eq 0 ]; then
        print_success "Successfully executed $sql_file"
    else
        print_error "Failed to execute $sql_file"
        exit 1
    fi
}

# Function to run SQL file as application user
run_sql_as_user() {
    local sql_file="$1"
    local db_name="$2"
    local username="$3"
    local password="$4"
    
    print_status "Running $sql_file as $username..."
    
    if [ ! -f "$sql_file" ]; then
        print_error "SQL file $sql_file not found!"
        exit 1
    fi
    
    PGPASSWORD="$password" psql -h localhost -U "$username" -d "$db_name" -f "$sql_file"
    
    if [ $? -eq 0 ]; then
        print_success "Successfully executed $sql_file"
    else
        print_error "Failed to execute $sql_file"
        exit 1
    fi
}

# Function to update .env file
update_env_file() {
    local db_password="$1"
    local env_file="../.env"
    
    print_status "Updating .env file with database configuration..."
    
    if [ ! -f "$env_file" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f "../.env.example" ]; then
            cp "../.env.example" "$env_file"
        else
            print_error ".env.example file not found!"
            return 1
        fi
    fi
    
    # Update database configuration in .env file
    sed -i -e "s|^DATABASE_URL=.*|DATABASE_URL=postgresql://affiliateflow_user:${db_password}@localhost:5432/affiliateflow_db|" \
           -e "s|^DB_HOST=.*|DB_HOST=localhost|" \
           -e "s|^DB_PORT=.*|DB_PORT=5432|" \
           -e "s|^DB_NAME=.*|DB_NAME=affiliateflow_db|" \
           -e "s|^DB_USER=.*|DB_USER=affiliateflow_user|" \
           -e "s|^DB_PASSWORD=.*|DB_PASSWORD=${db_password}|" \
           "$env_file"
    
    print_success "Updated .env file with database configuration"
}

# Function to verify installation
verify_installation() {
    local db_password="$1"
    
    print_status "Verifying database installation..."
    
    # Check if we can connect to the database
    PGPASSWORD="$db_password" psql -h localhost -U affiliateflow_user -d affiliateflow_db -c "SELECT 'Database connection successful' as status;" > /dev/null 2>&1
    
    if [ $? -ne 0 ]; then
        print_error "Cannot connect to database!"
        return 1
    fi
    
    # Check if tables exist
    local table_count=$(PGPASSWORD="$db_password" psql -h localhost -U affiliateflow_user -d affiliateflow_db -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    
    if [ "$table_count" -lt 20 ]; then
        print_error "Expected at least 20 tables, found $table_count"
        return 1
    fi
    
    # Check if demo user exists
    local demo_user_exists=$(PGPASSWORD="$db_password" psql -h localhost -U affiliateflow_user -d affiliateflow_db -tAc "SELECT COUNT(*) FROM users WHERE email = 'demo@affiliateflow.com';")
    
    if [ "$demo_user_exists" -eq 0 ]; then
        print_error "Demo user not found!"
        return 1
    fi
    
    # Check if views exist
    local view_count=$(PGPASSWORD="$db_password" psql -h localhost -U affiliateflow_user -d affiliateflow_db -tAc "SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public';")
    
    if [ "$view_count" -lt 8 ]; then
        print_error "Expected at least 8 views, found $view_count"
        return 1
    fi
    
    print_success "Database verification completed successfully!"
    print_success "Tables created: $table_count"
    print_success "Views created: $view_count"
    print_success "Demo user created: demo@affiliateflow.com"
}

# Main execution
main() {
    echo "=============================================="
    echo "  AffiliateFlow SaaS Database Setup Script"
    echo "=============================================="
    echo ""
    
    # Check if running from correct directory
    if [ ! -f "01_create_database_complete.sql" ]; then
        print_error "Please run this script from the database directory"
        print_error "Expected files: 01_create_database_complete.sql, 02_create_tables_complete.sql, etc."
        exit 1
    fi
    
    # Check PostgreSQL
    check_postgresql
    
    # Database configuration
    DB_NAME="affiliateflow_db"
    DB_USER="affiliateflow_user"
    DB_PASSWORD="AffiliateFlow2024!SecurePass"
    
    print_status "Database configuration:"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Password: $DB_PASSWORD"
    echo ""
    
    # Ask for confirmation
    read -p "Do you want to proceed with the database setup? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelled by user"
        exit 0
    fi
    
    # Check if database already exists
    if database_exists "$DB_NAME"; then
        print_warning "Database $DB_NAME already exists!"
        read -p "Do you want to drop and recreate it? This will DELETE ALL DATA! (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Dropping existing database..."
            sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
            if user_exists "$DB_USER"; then
                sudo -u postgres psql -c "DROP ROLE IF EXISTS $DB_USER;"
            fi
        else
            print_warning "Setup cancelled. Existing database preserved."
            exit 0
        fi
    fi
    
    # Step 1: Create database and user
    print_status "Step 1: Creating database and user..."
    run_sql_as_postgres "01_create_database_complete.sql"
    
    # Step 2: Create tables
    print_status "Step 2: Creating tables..."
    run_sql_as_user "02_create_tables_complete.sql" "$DB_NAME" "$DB_USER" "$DB_PASSWORD"
    
    # Step 3: Insert seed data
    print_status "Step 3: Inserting seed data..."
    run_sql_as_user "03_insert_seed_data_complete.sql" "$DB_NAME" "$DB_USER" "$DB_PASSWORD"
    
    # Step 4: Create views
    print_status "Step 4: Creating analytics views..."
    run_sql_as_user "04_create_views_complete.sql" "$DB_NAME" "$DB_USER" "$DB_PASSWORD"
    
    # Step 5: Update .env file
    print_status "Step 5: Updating configuration..."
    update_env_file "$DB_PASSWORD"
    
    # Step 6: Verify installation
    print_status "Step 6: Verifying installation..."
    verify_installation "$DB_PASSWORD"
    
    # Success message
    echo ""
    echo "=============================================="
    print_success "AffiliateFlow Database Setup Complete!"
    echo "=============================================="
    echo ""
    echo "Database Details:"
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo "  Database: $DB_NAME"
    echo "  Username: $DB_USER"
    echo "  Password: $DB_PASSWORD"
    echo ""
    echo "Demo Account:"
    echo "  Email: demo@affiliateflow.com"
    echo "  Password: demo123!"
    echo ""
    echo "Next Steps:"
    echo "1. Start your backend server: cd ../backend/affiliate-marketing-api && python src/main.py"
    echo "2. Start your frontend server: cd ../frontend/affiliate-marketing-dashboard && npm run dev"
    echo "3. Open your browser to: http://localhost:5173"
    echo "4. Login with the demo account to test all features"
    echo ""
    echo "Configuration:"
    echo "- Database configuration has been updated in ../.env"
    echo "- Add your API keys (OpenAI, Stripe, etc.) to the .env file"
    echo ""
    print_success "Setup completed successfully!"
}

# Run main function
main "$@"

