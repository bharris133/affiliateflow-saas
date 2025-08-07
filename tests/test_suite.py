"""
Comprehensive User Acceptance Testing (UAT) Suite for AffiliateFlow SaaS Platform
Tests all critical user workflows and system functionality
"""

import unittest
import asyncio
import requests
import json
import time
import random
import string
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AffiliateFlowUATSuite:
    """Main UAT test suite for AffiliateFlow platform"""
    
    def __init__(self, base_url="http://localhost:5000", frontend_url="http://localhost:5173"):
        self.base_url = base_url
        self.frontend_url = frontend_url
        self.test_users = []
        self.test_results = {}
        self.session = requests.Session()
        
    def generate_test_user(self):
        """Generate a test user with random data"""
        random_id = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        return {
            'email': f'test_{random_id}@affiliateflow.test',
            'password': 'TestPassword123!',
            'name': f'Test User {random_id}',
            'company': f'Test Company {random_id}'
        }
    
    def run_all_tests(self):
        """Run the complete UAT test suite"""
        logger.info("🚀 Starting AffiliateFlow UAT Test Suite")
        
        test_categories = [
            ('User Authentication', self.test_user_authentication),
            ('Content Generation', self.test_content_generation),
            ('Social Media Integration', self.test_social_media_integration),
            ('Affiliate Link Management', self.test_affiliate_link_management),
            ('Stripe Payment Integration', self.test_stripe_integration),
            ('Analytics & Reporting', self.test_analytics_reporting),
            ('API Performance', self.test_api_performance),
            ('Security & Validation', self.test_security_validation),
            ('User Interface', self.test_user_interface),
            ('Email Marketing', self.test_email_marketing),
            ('Data Export/Import', self.test_data_operations),
            ('System Integration', self.test_system_integration)
        ]
        
        overall_results = {}
        
        for category_name, test_function in test_categories:
            logger.info(f"\n📋 Testing: {category_name}")
            try:
                results = test_function()
                overall_results[category_name] = results
                self._log_test_results(category_name, results)
            except Exception as e:
                logger.error(f"❌ {category_name} failed: {str(e)}")
                overall_results[category_name] = {'status': 'FAILED', 'error': str(e)}
        
        self._generate_test_report(overall_results)
        return overall_results
    
    def test_user_authentication(self):
        """Test user registration, login, and authentication flows"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: User Registration
        test_user = self.generate_test_user()
        try:
            response = self.session.post(f"{self.base_url}/api/auth/register", json=test_user)
            if response.status_code == 201:
                results['tests'].append({'name': 'User Registration', 'status': 'PASSED'})
                results['passed'] += 1
                self.test_users.append(test_user)
            else:
                results['tests'].append({'name': 'User Registration', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'User Registration', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: User Login
        try:
            login_data = {'email': test_user['email'], 'password': test_user['password']}
            response = self.session.post(f"{self.base_url}/api/auth/login", json=login_data)
            if response.status_code == 200 and 'access_token' in response.json():
                results['tests'].append({'name': 'User Login', 'status': 'PASSED'})
                results['passed'] += 1
                # Store token for subsequent tests
                self.session.headers.update({'Authorization': f"Bearer {response.json()['access_token']}"})
            else:
                results['tests'].append({'name': 'User Login', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'User Login', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 3: Protected Route Access
        try:
            response = self.session.get(f"{self.base_url}/api/user/profile")
            if response.status_code == 200:
                results['tests'].append({'name': 'Protected Route Access', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Protected Route Access', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Protected Route Access', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 4: Password Reset Flow
        try:
            response = self.session.post(f"{self.base_url}/api/auth/forgot-password", 
                                       json={'email': test_user['email']})
            if response.status_code in [200, 202]:
                results['tests'].append({'name': 'Password Reset Request', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Password Reset Request', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Password Reset Request', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_content_generation(self):
        """Test AI content generation functionality"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Generate Blog Post
        try:
            content_request = {
                'type': 'blog_post',
                'prompt': 'Write a review of wireless headphones for fitness enthusiasts',
                'keywords': ['wireless headphones', 'fitness', 'workout', 'bluetooth'],
                'tone': 'professional',
                'length': 'medium'
            }
            response = self.session.post(f"{self.base_url}/api/content/generate", json=content_request)
            if response.status_code == 200 and len(response.json().get('content', '')) > 100:
                results['tests'].append({'name': 'Blog Post Generation', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Blog Post Generation', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Blog Post Generation', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: Generate Social Media Post
        try:
            social_request = {
                'type': 'social_post',
                'platform': 'instagram',
                'prompt': 'Promote fitness headphones with engaging caption',
                'include_hashtags': True
            }
            response = self.session.post(f"{self.base_url}/api/content/generate", json=social_request)
            if response.status_code == 200:
                results['tests'].append({'name': 'Social Media Post Generation', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Social Media Post Generation', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Social Media Post Generation', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 3: Content Optimization
        try:
            optimization_request = {
                'content': 'Basic content about headphones',
                'optimize_for': 'seo',
                'target_keywords': ['wireless headphones', 'review']
            }
            response = self.session.post(f"{self.base_url}/api/content/optimize", json=optimization_request)
            if response.status_code == 200:
                results['tests'].append({'name': 'Content Optimization', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Content Optimization', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Content Optimization', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_social_media_integration(self):
        """Test social media platform integrations"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Get Available Platforms
        try:
            response = self.session.get(f"{self.base_url}/api/social/platforms")
            if response.status_code == 200 and len(response.json().get('platforms', [])) > 0:
                results['tests'].append({'name': 'Get Available Platforms', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Get Available Platforms', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Get Available Platforms', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: Schedule Social Media Post
        try:
            post_data = {
                'platforms': ['facebook', 'twitter', 'instagram'],
                'content': 'Test post from AffiliateFlow UAT suite',
                'scheduled_time': (datetime.now() + timedelta(hours=1)).isoformat(),
                'media_urls': []
            }
            response = self.session.post(f"{self.base_url}/api/social/schedule", json=post_data)
            if response.status_code in [200, 201]:
                results['tests'].append({'name': 'Schedule Social Media Post', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Schedule Social Media Post', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Schedule Social Media Post', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 3: Get Social Media Analytics
        try:
            response = self.session.get(f"{self.base_url}/api/social/analytics")
            if response.status_code == 200:
                results['tests'].append({'name': 'Get Social Media Analytics', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Get Social Media Analytics', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Get Social Media Analytics', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_affiliate_link_management(self):
        """Test affiliate link creation and tracking"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Create Affiliate Link
        try:
            link_data = {
                'original_url': 'https://example.com/product/123',
                'campaign_name': 'UAT Test Campaign',
                'utm_source': 'affiliateflow',
                'utm_medium': 'social',
                'utm_campaign': 'test_campaign'
            }
            response = self.session.post(f"{self.base_url}/api/links/create", json=link_data)
            if response.status_code in [200, 201] and 'short_url' in response.json():
                results['tests'].append({'name': 'Create Affiliate Link', 'status': 'PASSED'})
                results['passed'] += 1
                # Store link ID for subsequent tests
                self.test_link_id = response.json().get('link_id')
            else:
                results['tests'].append({'name': 'Create Affiliate Link', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Create Affiliate Link', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: Get Link Analytics
        if hasattr(self, 'test_link_id'):
            try:
                response = self.session.get(f"{self.base_url}/api/links/{self.test_link_id}/analytics")
                if response.status_code == 200:
                    results['tests'].append({'name': 'Get Link Analytics', 'status': 'PASSED'})
                    results['passed'] += 1
                else:
                    results['tests'].append({'name': 'Get Link Analytics', 'status': 'FAILED', 'error': response.text})
                    results['failed'] += 1
            except Exception as e:
                results['tests'].append({'name': 'Get Link Analytics', 'status': 'FAILED', 'error': str(e)})
                results['failed'] += 1
        
        # Test 3: List All Links
        try:
            response = self.session.get(f"{self.base_url}/api/links/")
            if response.status_code == 200:
                results['tests'].append({'name': 'List All Links', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'List All Links', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'List All Links', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_stripe_integration(self):
        """Test Stripe payment integration"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Get Pricing Plans
        try:
            response = self.session.get(f"{self.base_url}/api/stripe/pricing")
            if response.status_code == 200 and 'plans' in response.json():
                results['tests'].append({'name': 'Get Pricing Plans', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Get Pricing Plans', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Get Pricing Plans', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: Create Test Customer
        try:
            customer_data = {
                'email': self.test_users[0]['email'] if self.test_users else 'test@example.com',
                'name': 'Test Customer'
            }
            response = self.session.post(f"{self.base_url}/api/stripe/create-customer", json=customer_data)
            if response.status_code == 200 and response.json().get('success'):
                results['tests'].append({'name': 'Create Stripe Customer', 'status': 'PASSED'})
                results['passed'] += 1
                self.test_customer_id = response.json().get('customer_id')
            else:
                results['tests'].append({'name': 'Create Stripe Customer', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Create Stripe Customer', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 3: Create Checkout Session
        if hasattr(self, 'test_customer_id'):
            try:
                checkout_data = {
                    'customer_id': self.test_customer_id,
                    'tier': 'starter',
                    'billing_cycle': 'monthly'
                }
                response = self.session.post(f"{self.base_url}/api/stripe/create-checkout-session", json=checkout_data)
                if response.status_code == 200 and response.json().get('success'):
                    results['tests'].append({'name': 'Create Checkout Session', 'status': 'PASSED'})
                    results['passed'] += 1
                else:
                    results['tests'].append({'name': 'Create Checkout Session', 'status': 'FAILED', 'error': response.text})
                    results['failed'] += 1
            except Exception as e:
                results['tests'].append({'name': 'Create Checkout Session', 'status': 'FAILED', 'error': str(e)})
                results['failed'] += 1
        
        return results
    
    def test_analytics_reporting(self):
        """Test analytics and reporting functionality"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Get Dashboard Analytics
        try:
            response = self.session.get(f"{self.base_url}/api/analytics/dashboard")
            if response.status_code == 200:
                results['tests'].append({'name': 'Get Dashboard Analytics', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Get Dashboard Analytics', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Get Dashboard Analytics', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: Generate Custom Report
        try:
            report_data = {
                'type': 'revenue',
                'date_range': {
                    'start': (datetime.now() - timedelta(days=30)).isoformat(),
                    'end': datetime.now().isoformat()
                },
                'metrics': ['clicks', 'conversions', 'revenue']
            }
            response = self.session.post(f"{self.base_url}/api/analytics/report", json=report_data)
            if response.status_code == 200:
                results['tests'].append({'name': 'Generate Custom Report', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Generate Custom Report', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Generate Custom Report', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_api_performance(self):
        """Test API performance and response times"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: API Response Time
        endpoints_to_test = [
            '/api/auth/login',
            '/api/content/generate',
            '/api/social/platforms',
            '/api/analytics/dashboard'
        ]
        
        for endpoint in endpoints_to_test:
            try:
                start_time = time.time()
                if endpoint == '/api/auth/login':
                    response = self.session.post(f"{self.base_url}{endpoint}", 
                                               json={'email': 'test@example.com', 'password': 'test'})
                else:
                    response = self.session.get(f"{self.base_url}{endpoint}")
                
                response_time = time.time() - start_time
                
                if response_time < 5.0:  # 5 second threshold
                    results['tests'].append({
                        'name': f'Response Time {endpoint}', 
                        'status': 'PASSED',
                        'response_time': f'{response_time:.2f}s'
                    })
                    results['passed'] += 1
                else:
                    results['tests'].append({
                        'name': f'Response Time {endpoint}', 
                        'status': 'FAILED',
                        'error': f'Response time {response_time:.2f}s exceeds 5s threshold'
                    })
                    results['failed'] += 1
            except Exception as e:
                results['tests'].append({
                    'name': f'Response Time {endpoint}', 
                    'status': 'FAILED', 
                    'error': str(e)
                })
                results['failed'] += 1
        
        # Test 2: Concurrent Request Handling
        try:
            def make_request():
                return self.session.get(f"{self.base_url}/api/analytics/dashboard")
            
            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = [executor.submit(make_request) for _ in range(10)]
                responses = [future.result() for future in futures]
            
            successful_responses = sum(1 for r in responses if r.status_code == 200)
            
            if successful_responses >= 8:  # At least 80% success rate
                results['tests'].append({'name': 'Concurrent Request Handling', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({
                    'name': 'Concurrent Request Handling', 
                    'status': 'FAILED',
                    'error': f'Only {successful_responses}/10 requests succeeded'
                })
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Concurrent Request Handling', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_security_validation(self):
        """Test security measures and validation"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: SQL Injection Protection
        try:
            malicious_payload = "'; DROP TABLE users; --"
            response = self.session.post(f"{self.base_url}/api/auth/login", 
                                       json={'email': malicious_payload, 'password': 'test'})
            if response.status_code in [400, 401, 422]:  # Should be rejected
                results['tests'].append({'name': 'SQL Injection Protection', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'SQL Injection Protection', 'status': 'FAILED', 'error': 'Malicious payload not rejected'})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'SQL Injection Protection', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: XSS Protection
        try:
            xss_payload = "<script>alert('xss')</script>"
            response = self.session.post(f"{self.base_url}/api/content/generate", 
                                       json={'prompt': xss_payload})
            # Should either reject or sanitize the payload
            if response.status_code in [400, 422] or (response.status_code == 200 and '<script>' not in response.text):
                results['tests'].append({'name': 'XSS Protection', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'XSS Protection', 'status': 'FAILED', 'error': 'XSS payload not handled properly'})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'XSS Protection', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 3: Rate Limiting
        try:
            # Make rapid requests to test rate limiting
            responses = []
            for _ in range(20):
                response = self.session.get(f"{self.base_url}/api/analytics/dashboard")
                responses.append(response.status_code)
            
            # Should see some 429 (Too Many Requests) responses
            if 429 in responses:
                results['tests'].append({'name': 'Rate Limiting', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Rate Limiting', 'status': 'WARNING', 'error': 'No rate limiting detected'})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Rate Limiting', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_user_interface(self):
        """Test user interface functionality (requires Selenium)"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Note: This would require Selenium WebDriver for full UI testing
        # For now, we'll test basic frontend accessibility
        
        # Test 1: Frontend Accessibility
        try:
            response = requests.get(self.frontend_url)
            if response.status_code == 200 and 'AffiliateFlow' in response.text:
                results['tests'].append({'name': 'Frontend Accessibility', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Frontend Accessibility', 'status': 'FAILED', 'error': 'Frontend not accessible'})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Frontend Accessibility', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: API Documentation
        try:
            response = requests.get(f"{self.base_url}/docs")
            if response.status_code == 200:
                results['tests'].append({'name': 'API Documentation', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'API Documentation', 'status': 'FAILED', 'error': 'API docs not accessible'})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'API Documentation', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_email_marketing(self):
        """Test email marketing functionality"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Create Email Campaign
        try:
            campaign_data = {
                'name': 'UAT Test Campaign',
                'subject': 'Test Email from AffiliateFlow',
                'content': 'This is a test email generated during UAT testing.',
                'recipients': ['test@example.com']
            }
            response = self.session.post(f"{self.base_url}/api/email/campaign", json=campaign_data)
            if response.status_code in [200, 201]:
                results['tests'].append({'name': 'Create Email Campaign', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Create Email Campaign', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Create Email Campaign', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_data_operations(self):
        """Test data export/import functionality"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Export Data
        try:
            response = self.session.get(f"{self.base_url}/api/data/export")
            if response.status_code == 200:
                results['tests'].append({'name': 'Data Export', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Data Export', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Data Export', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def test_system_integration(self):
        """Test system integration and health checks"""
        results = {'tests': [], 'passed': 0, 'failed': 0}
        
        # Test 1: Health Check
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                results['tests'].append({'name': 'System Health Check', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'System Health Check', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'System Health Check', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        # Test 2: Database Connectivity
        try:
            response = self.session.get(f"{self.base_url}/api/system/db-status")
            if response.status_code == 200:
                results['tests'].append({'name': 'Database Connectivity', 'status': 'PASSED'})
                results['passed'] += 1
            else:
                results['tests'].append({'name': 'Database Connectivity', 'status': 'FAILED', 'error': response.text})
                results['failed'] += 1
        except Exception as e:
            results['tests'].append({'name': 'Database Connectivity', 'status': 'FAILED', 'error': str(e)})
            results['failed'] += 1
        
        return results
    
    def _log_test_results(self, category, results):
        """Log test results for a category"""
        total_tests = results['passed'] + results['failed']
        success_rate = (results['passed'] / total_tests * 100) if total_tests > 0 else 0
        
        logger.info(f"   ✅ Passed: {results['passed']}")
        logger.info(f"   ❌ Failed: {results['failed']}")
        logger.info(f"   📊 Success Rate: {success_rate:.1f}%")
        
        if results['failed'] > 0:
            logger.info("   Failed Tests:")
            for test in results['tests']:
                if test['status'] == 'FAILED':
                    logger.info(f"      - {test['name']}: {test.get('error', 'Unknown error')}")
    
    def _generate_test_report(self, overall_results):
        """Generate comprehensive test report"""
        report_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        total_passed = sum(result.get('passed', 0) for result in overall_results.values() if isinstance(result, dict))
        total_failed = sum(result.get('failed', 0) for result in overall_results.values() if isinstance(result, dict))
        total_tests = total_passed + total_failed
        overall_success_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0
        
        report = f"""
# AffiliateFlow UAT Test Report
Generated: {report_time}

## Overall Results
- **Total Tests**: {total_tests}
- **Passed**: {total_passed}
- **Failed**: {total_failed}
- **Success Rate**: {overall_success_rate:.1f}%

## Category Results
"""
        
        for category, results in overall_results.items():
            if isinstance(results, dict) and 'tests' in results:
                category_total = results['passed'] + results['failed']
                category_success = (results['passed'] / category_total * 100) if category_total > 0 else 0
                
                report += f"""
### {category}
- Tests: {category_total}
- Passed: {results['passed']}
- Failed: {results['failed']}
- Success Rate: {category_success:.1f}%
"""
                
                if results['failed'] > 0:
                    report += "\n**Failed Tests:**\n"
                    for test in results['tests']:
                        if test['status'] == 'FAILED':
                            report += f"- {test['name']}: {test.get('error', 'Unknown error')}\n"
        
        # Save report to file
        with open('UAT_TEST_REPORT.md', 'w') as f:
            f.write(report)
        
        logger.info(f"\n📋 UAT Test Report saved to UAT_TEST_REPORT.md")
        logger.info(f"🎯 Overall Success Rate: {overall_success_rate:.1f}%")

if __name__ == "__main__":
    # Run the UAT test suite
    uat_suite = AffiliateFlowUATSuite()
    results = uat_suite.run_all_tests()
    
    # Print summary
    print("\n" + "="*50)
    print("UAT TEST SUITE COMPLETED")
    print("="*50)
    print(f"Check UAT_TEST_REPORT.md for detailed results")

