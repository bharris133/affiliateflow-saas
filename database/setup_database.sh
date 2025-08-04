#!/bin/bash

# AffiliateFlow SaaS Platform - Database Setup Script
# This script sets up the complete PostgreSQL database for AffiliateFlow

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="affiliateflow_db"
DB_USER="affiliateflow_user"
DB_PASSWORD="your_secure_password_here"
DB_HOST="localhost"
DB_PORT="5432"
POSTGRES_USER="postgres"

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

# Function to check if PostgreSQL is running
check_postgresql() {
    print_status "Checking if PostgreSQL is running..."
    
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed. Please install PostgreSQL first."
        exit 1
    fi
    
    if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
        print_error "PostgreSQL is not running on $DB_HOST:$DB_PORT"
        print_status "Please start PostgreSQL service:"
        echo "  sudo systemctl start postgresql"
        echo "  # or on macOS with Homebrew:"
        echo "  brew services start postgresql"
        exit 1
    fi
    
    print_success "PostgreSQL is running"
}

# Function to prompt for database password
prompt_for_password() {
    echo
    print_warning "You need to set a secure password for the database user."
    print_status "Current password in script: $DB_PASSWORD"
    echo
    read -p "Do you want to use a different password? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -n "Enter new password for database user '$DB_USER': "
        read -s NEW_PASSWORD
        echo
        echo -n "Confirm password: "
        read -s CONFIRM_PASSWORD
        echo
        
        if [ "$NEW_PASSWORD" != "$CONFIRM_PASSWORD" ]; then
            print_error "Passwords do not match!"
            exit 1
        fi
        
        if [ ${#NEW_PASSWORD} -lt 8 ]; then
            print_error "Password must be at least 8 characters long!"
            exit 1
        fi
        
        DB_PASSWORD="$NEW_PASSWORD"
        print_success "Password updated"
    fi
}

# Function to create database and user
create_database() {
    print_status "Creating database and user..."
    
    # Update the SQL file with the actual password
    sed "s/your_secure_password_here/$DB_PASSWORD/g" 01_create_database.sql > /tmp/01_create_database_temp.sql
    
    # Execute the database creation script
    if psql -h $DB_HOST -p $DB_PORT -U $POSTGRES_USER -f /tmp/01_create_database_temp.sql; then
        print_success "Database and user created successfully"
    else
        print_error "Failed to create database and user"
        print_status "You may need to run this as the PostgreSQL superuser:"
        echo "  sudo -u postgres psql -f 01_create_database.sql"
        exit 1
    fi
    
    # Clean up temporary file
    rm -f /tmp/01_create_database_temp.sql
}

# Function to create tables
create_tables() {
    print_status "Creating database tables..."
    
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 02_create_tables.sql; then
        print_success "Tables created successfully"
    else
        print_error "Failed to create tables"
        exit 1
    fi
}

# Function to insert seed data
insert_seed_data() {
    print_status "Inserting seed data..."
    
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 03_insert_seed_data.sql; then
        print_success "Seed data inserted successfully"
    else
        print_error "Failed to insert seed data"
        exit 1
    fi
}

# Function to create views
create_views() {
    print_status "Creating database views..."
    
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 04_create_views.sql; then
        print_success "Views created successfully"
    else
        print_error "Failed to create views"
        exit 1
    fi
}

# Function to verify installation
verify_installation() {
    print_status "Verifying database installation..."
    
    # Check if we can connect and query
    local table_count=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>/dev/null | xargs)
    
    if [ "$table_count" -gt 0 ]; then
        print_success "Database verification passed - $table_count tables created"
        
        # Check demo user
        local demo_user_exists=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users WHERE email = 'demo@affiliateflow.com';" 2>/dev/null | xargs)
        
        if [ "$demo_user_exists" -eq 1 ]; then
            print_success "Demo user created successfully"
            print_status "Demo login credentials:"
            echo "  Email: demo@affiliateflow.com"
            echo "  Password: demo123!"
        fi
        
    else
        print_error "Database verification failed - no tables found"
        exit 1
    fi
}

# Function to create .env file
create_env_file() {
    print_status "Creating .env file with database configuration..."
    
    local env_file="../.env"
    
    if [ -f "$env_file" ]; then
        print_warning ".env file already exists"
        read -p "Do you want to update the database configuration? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return
        fi
    fi
    
    # Create or update .env file with database configuration
    if [ ! -f "$env_file" ]; then
        cp ../.env.example "$env_file"
        print_status "Created .env file from template"
    fi
    
    # Update database configuration in .env file
    sed -i.bak \
        -e "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME|" \
        -e "s|DB_HOST=.*|DB_HOST=$DB_HOST|" \
        -e "s|DB_PORT=.*|DB_PORT=$DB_PORT|" \
        -e "s|DB_NAME=.*|DB_NAME=$DB_NAME|" \
        -e "s|DB_USER=.*|DB_USER=$DB_USER|" \
        -e "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" \
        "$env_file"
    
    print_success "Database configuration updated in .env file"
}

# Function to show next steps
show_next_steps() {
    echo
    print_success "🎉 AffiliateFlow database setup completed successfully!"
    echo
    print_status "Next steps:"
    echo "1. Update your .env file with other required API keys (Stripe, OpenAI, etc.)"
    echo "2. Start the backend server:"
    echo "   cd ../backend/affiliate-marketing-api"
    echo "   python -m venv venv"
    echo "   source venv/bin/activate  # Windows: venv\\Scripts\\activate"
    echo "   pip install -r requirements.txt"
    echo "   python src/main.py"
    echo
    echo "3. Start the frontend server:"
    echo "   cd ../frontend/affiliate-marketing-dashboard"
    echo "   npm install  # or pnpm install"
    echo "   npm run dev"
    echo
    echo "4. Access the application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend API: http://localhost:5000"
    echo
    print_status "Demo login credentials:"
    echo "   Email: demo@affiliateflow.com"
    echo "   Password: demo123!"
    echo
    print_status "Database connection details:"
    echo "   Host: $DB_HOST"
    echo "   Port: $DB_PORT"
    echo "   Database: $DB_NAME"
    echo "   User: $DB_USER"
    echo "   Connection URL: postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME"
}

# Main execution
main() {
    echo
    echo "=============================================="
    echo "  AffiliateFlow SaaS Database Setup"
    echo "=============================================="
    echo
    
    # Check if we're in the right directory
    if [ ! -f "01_create_database.sql" ]; then
        print_error "Database SQL files not found!"
        print_status "Please run this script from the database/ directory"
        exit 1
    fi
    
    # Check prerequisites
    check_postgresql
    
    # Prompt for password
    prompt_for_password
    
    # Execute setup steps
    create_database
    create_tables
    insert_seed_data
    create_views
    verify_installation
    create_env_file
    show_next_steps
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "AffiliateFlow Database Setup Script"
        echo
        echo "Usage: $0 [options]"
        echo
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --skip-prompt  Skip password prompt (use default)"
        echo
        echo "Environment variables:"
        echo "  DB_HOST        Database host (default: localhost)"
        echo "  DB_PORT        Database port (default: 5432)"
        echo "  POSTGRES_USER  PostgreSQL superuser (default: postgres)"
        exit 0
        ;;
    --skip-prompt)
        print_warning "Skipping password prompt - using default password"
        ;;
esac

# Run main function
main

