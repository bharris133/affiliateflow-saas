# API Documentation

## 🚀 **AffiliateFlow Backend API**

This document provides comprehensive API documentation for the AffiliateFlow SaaS platform backend services.

## 🏗️ **API Architecture**

### **Base URL**

- **Development**: `http://localhost:5000`
- **Production**: `https://api.affiliateflow.com`

### **Authentication**

- **Type**: JWT (JSON Web Tokens)
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 24 hours (configurable)
- **Refresh**: Available via `/api/auth/refresh` endpoint

### **Response Format**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-08-04T10:30:00Z"
}
```

### **Error Format**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { ... }
  },
  "timestamp": "2025-08-04T10:30:00Z"
}
```

## 🔐 **Authentication Endpoints**

### **POST /api/auth/register**

Register a new user account

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "subscriptionTier": "starter"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "subscriptionTier": "starter",
      "createdAt": "2025-08-04T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **POST /api/auth/login**

Authenticate user and receive access token

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "subscriptionTier": "starter"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### **POST /api/auth/refresh**

Refresh expired access token

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **POST /api/auth/logout**

Invalidate user session and tokens

**Headers:**

```
Authorization: Bearer <token>
```

## 📝 **Content Management Endpoints**

### **GET /api/content**

Retrieve user's content library

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20)
- `type` (string): Content type filter (blog_post, product_review, social_media, email)
- `status` (string): Content status (draft, published, archived)
- `search` (string): Search term for title/content

**Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Best Travel Credit Cards 2025",
        "type": "blog_post",
        "status": "published",
        "wordCount": 2847,
        "viewCount": 1234,
        "revenue": 127.5,
        "createdAt": "2025-08-01T10:00:00Z",
        "updatedAt": "2025-08-01T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 47,
      "pages": 3
    }
  }
}
```

### **POST /api/content/generate**

Generate new content using AI

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "type": "blog_post",
  "title": "Ultimate Guide to Digital Nomad Lifestyle",
  "niche": "travel",
  "targetAudience": "Digital nomads and remote workers",
  "keywords": ["digital nomad", "remote work", "travel"],
  "wordCount": 2000,
  "tone": "professional",
  "includeAffiliateLinks": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "content": {
      "id": 2,
      "title": "Ultimate Guide to Digital Nomad Lifestyle",
      "content": "# Digital Nomad Lifestyle: The Complete Guide\n\n...",
      "metaDescription": "Complete guide to digital nomad lifestyle...",
      "keywords": ["digital nomad", "remote work", "travel"],
      "wordCount": 2000,
      "estimatedReadTime": 10,
      "seoScore": 85,
      "affiliateLinks": [
        {
          "product": "MacBook Air M2",
          "url": "https://affiliate-link.com",
          "position": 450
        }
      ]
    }
  }
}
```

### **PUT /api/content/{id}**

Update existing content

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content body...",
  "status": "published",
  "metaDescription": "Updated meta description"
}
```

### **DELETE /api/content/{id}**

Delete content item

**Headers:**

```
Authorization: Bearer <token>
```

## 📱 **Social Media Management Endpoints**

### **GET /api/social/platforms**

Get connected social media platforms

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "id": "facebook",
        "name": "Facebook",
        "connected": true,
        "accountName": "John Doe",
        "followers": 1234,
        "lastPost": "2025-08-03T14:30:00Z"
      },
      {
        "id": "twitter",
        "name": "Twitter",
        "connected": false,
        "followers": 0
      }
    ]
  }
}
```

### **POST /api/social/connect**

Connect a social media platform

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "platform": "facebook",
  "accessToken": "platform_access_token",
  "accountId": "account_id"
}
```

### **POST /api/social/post**

Create and schedule social media post

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "platforms": ["facebook", "twitter", "linkedin"],
  "content": {
    "text": "Check out this amazing travel guide!",
    "image": "https://example.com/image.jpg",
    "link": "https://myblog.com/travel-guide"
  },
  "scheduleTime": "2025-08-05T10:00:00Z",
  "timezone": "UTC"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "postId": "post_12345",
    "scheduledFor": "2025-08-05T10:00:00Z",
    "platforms": [
      {
        "platform": "facebook",
        "status": "scheduled",
        "platformPostId": "fb_123456"
      },
      {
        "platform": "twitter",
        "status": "scheduled",
        "platformPostId": "tw_789012"
      }
    ]
  }
}
```

### **GET /api/social/analytics**

Get social media analytics

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `platform` (string): Specific platform or "all"
- `startDate` (string): Start date (ISO format)
- `endDate` (string): End date (ISO format)

**Response:**

```json
{
  "success": true,
  "data": {
    "totalReach": 12543,
    "totalEngagement": 1847,
    "totalClicks": 456,
    "platforms": {
      "facebook": {
        "reach": 8234,
        "engagement": 1123,
        "clicks": 289
      },
      "twitter": {
        "reach": 4309,
        "engagement": 724,
        "clicks": 167
      }
    }
  }
}
```

## 🔗 **Affiliate Link Management Endpoints**

### **GET /api/links**

Get all affiliate links

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (integer): Page number
- `limit` (integer): Items per page
- `status` (string): Link status (active, paused, expired)

**Response:**

```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": 1,
        "shortUrl": "https://aff.ly/abc123",
        "originalUrl": "https://merchant.com/product?ref=affiliate",
        "title": "MacBook Air M2",
        "merchant": "Apple",
        "commission": 5.5,
        "clicks": 234,
        "conversions": 12,
        "revenue": 156.78,
        "createdAt": "2025-08-01T10:00:00Z"
      }
    ]
  }
}
```

### **POST /api/links**

Create new affiliate link

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "originalUrl": "https://merchant.com/product?ref=affiliate",
  "title": "MacBook Air M2",
  "merchant": "Apple",
  "commission": 5.5,
  "category": "technology"
}
```

### **GET /api/links/{id}/stats**

Get detailed link statistics

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "link": {
      "id": 1,
      "title": "MacBook Air M2",
      "totalClicks": 234,
      "totalConversions": 12,
      "totalRevenue": 156.78,
      "conversionRate": 5.1
    },
    "dailyStats": [
      {
        "date": "2025-08-01",
        "clicks": 23,
        "conversions": 1,
        "revenue": 12.5
      }
    ],
    "topSources": [
      {
        "source": "blog",
        "clicks": 145,
        "conversions": 8
      }
    ]
  }
}
```

## 📊 **Analytics Endpoints**

### **GET /api/analytics/dashboard**

Get dashboard analytics overview

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `timeRange` (string): 7d, 30d, 90d, 1y

**Response:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "revenue": {
        "current": 1247.5,
        "previous": 892.3,
        "change": 39.8
      },
      "visitors": {
        "current": 12543,
        "previous": 9876,
        "change": 27.0
      },
      "content": {
        "current": 47,
        "previous": 32,
        "change": 46.9
      },
      "conversionRate": {
        "current": 3.2,
        "previous": 2.8,
        "change": 14.3
      }
    },
    "charts": {
      "revenue": [
        {
          "date": "2025-07-28",
          "revenue": 120.5,
          "visitors": 450
        }
      ],
      "topContent": [
        {
          "title": "Best Travel Credit Cards",
          "views": 2847,
          "revenue": 127.5
        }
      ]
    }
  }
}
```

### **GET /api/analytics/revenue**

Get detailed revenue analytics

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRevenue": 4247.5,
    "monthlyGoal": 5000.0,
    "goalProgress": 84.95,
    "revenueBySource": {
      "affiliate": 3456.78,
      "direct": 567.89,
      "sponsored": 222.83
    },
    "dailyRevenue": [
      {
        "date": "2025-08-01",
        "revenue": 156.78,
        "clicks": 234,
        "conversions": 12
      }
    ]
  }
}
```

### **GET /api/analytics/content**

Get content performance analytics

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "topPerforming": [
      {
        "contentId": 1,
        "title": "Best Travel Credit Cards",
        "views": 2847,
        "clicks": 234,
        "conversions": 12,
        "revenue": 127.5,
        "conversionRate": 5.1
      }
    ],
    "contentByType": {
      "blog_post": {
        "count": 25,
        "avgRevenue": 89.5,
        "totalViews": 15674
      },
      "product_review": {
        "count": 12,
        "avgRevenue": 145.3,
        "totalViews": 8234
      }
    }
  }
}
```

## 💳 **Subscription Management Endpoints**

### **GET /api/subscription**

Get current subscription details

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_12345",
      "tier": "professional",
      "status": "active",
      "currentPeriodStart": "2025-08-01T00:00:00Z",
      "currentPeriodEnd": "2025-09-01T00:00:00Z",
      "amount": 79.0,
      "currency": "USD"
    },
    "usage": {
      "contentGenerated": 23,
      "contentLimit": 100,
      "socialPosts": 145,
      "socialPostLimit": 500
    }
  }
}
```

### **POST /api/subscription/upgrade**

Upgrade subscription tier

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "tier": "professional",
  "paymentMethodId": "pm_12345"
}
```

### **GET /api/subscription/invoices**

Get billing history

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_12345",
        "amount": 79.0,
        "currency": "USD",
        "status": "paid",
        "date": "2025-08-01T00:00:00Z",
        "downloadUrl": "https://invoice-url.com"
      }
    ]
  }
}
```

## 🔧 **Utility Endpoints**

### **GET /api/health**

Health check endpoint

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 86400,
    "database": "connected",
    "redis": "connected"
  }
}
```

### **GET /api/config**

Get application configuration

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "features": {
      "aiContentGeneration": true,
      "socialMediaPosting": true,
      "emailMarketing": false
    },
    "limits": {
      "contentPerMonth": 100,
      "socialPostsPerMonth": 500
    }
  }
}
```

## 🚨 **Error Codes**

### **Authentication Errors**

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Token invalid
- `AUTH_004`: Account suspended

### **Validation Errors**

- `VAL_001`: Missing required fields
- `VAL_002`: Invalid email format
- `VAL_003`: Password too weak
- `VAL_004`: Invalid date format

### **Business Logic Errors**

- `BIZ_001`: Subscription limit exceeded
- `BIZ_002`: Feature not available in current tier
- `BIZ_003`: Content generation failed
- `BIZ_004`: Social platform connection error

### **System Errors**

- `SYS_001`: Internal server error
- `SYS_002`: Database connection error
- `SYS_003`: External API error
- `SYS_004`: Rate limit exceeded

## 📝 **Rate Limiting**

### **Limits by Endpoint Type**

- **Authentication**: 5 requests per minute
- **Content Generation**: 10 requests per hour
- **Social Media Posting**: 50 requests per hour
- **Analytics**: 100 requests per hour
- **General API**: 1000 requests per hour

### **Rate Limit Headers**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1628097600
```

## 🔐 **Security**

### **API Keys**

- Environment-specific API keys
- Automatic key rotation
- Audit logging for all requests

### **Data Protection**

- All passwords hashed with bcrypt
- PII data encrypted at rest
- HTTPS required for all endpoints

### **CORS Configuration**

```javascript
{
  origin: ['http://localhost:5173', 'https://app.affiliateflow.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 🧪 **Testing**

### **Test Endpoints**

- **Base URL**: `http://localhost:5000/test`
- **Demo Data**: Available at `/api/test/seed`
- **Reset Database**: `POST /api/test/reset`

### **Example API Calls**

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Generate content
curl -X POST http://localhost:5000/api/content/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"type":"blog_post","title":"Test Article"}'
```

---

**🚀 Ready to integrate with the AffiliateFlow API?**  
**This documentation covers all available endpoints and integration patterns!**
