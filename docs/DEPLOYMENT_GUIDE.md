# SavingsPilot Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying SavingsPilot to production environments, including setup, configuration, and monitoring.

## Pre-deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests completed
- [ ] Performance benchmarks met
- [ ] Security audit completed

### ✅ Environment Setup
- [ ] Supabase project configured
- [ ] Google Gemini AI API key obtained
- [ ] Environment variables documented
- [ ] Database migrations applied
- [ ] RLS policies verified
- [ ] Error monitoring configured

### ✅ Performance Optimization
- [ ] Bundle size optimized (<500KB gzipped)
- [ ] Images optimized and compressed
- [ ] Code splitting implemented
- [ ] Lazy loading configured
- [ ] Caching strategies implemented
- [ ] Core Web Vitals targets met

## Environment Configuration

### Development Environment
```env
# Development .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_APP_NAME=SavingsPilot Dev
VITE_APP_VERSION=2.0.0-dev
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CRASH_REPORTING=false
```

### Production Environment
```env
# Production .env file
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_GEMINI_API_KEY=your_production_gemini_key
VITE_APP_NAME=SavingsPilot
VITE_APP_VERSION=2.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CRASH_REPORTING=true
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Supabase Setup

### 1. Create Supabase Project
```bash
# Create new project at https://supabase.com
# Note down project URL and anon key
```

### 2. Apply Database Migrations
```sql
-- Run all migration files in order:
-- 1. create_user_profiles_table.sql
-- 2. create_financial_data_table.sql
-- 3. create_user_badges_table.sql
-- 4. create_learning_progress_table.sql
-- 5. create_challenges_table.sql
-- 6. create_ai_conversations_table.sql
-- 7. create_delete_user_data_function.sql
```

### 3. Configure Authentication
```sql
-- Enable email authentication
-- Disable email confirmation for demo purposes
-- Set up password requirements
-- Configure session timeout
```

### 4. Set Up RLS Policies
```sql
-- Verify all tables have RLS enabled
-- Test policies with different user accounts
-- Ensure no data leakage between users
```

## Deployment Platforms

### Netlify Deployment

#### 1. Connect Repository
```bash
# Connect GitHub repository to Netlify
# Set build command: npm run build
# Set publish directory: dist
```

#### 2. Environment Variables
```bash
# Add environment variables in Netlify dashboard
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_GEMINI_API_KEY=your_gemini_key
```

#### 3. Build Settings
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Vercel Deployment

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
# Deploy to Vercel
vercel --prod

# Configure environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_GEMINI_API_KEY
```

#### 3. Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Custom Server Deployment

#### 1. Build Application
```bash
npm run build
```

#### 2. Server Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name savingspilot.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name savingspilot.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/savingspilot/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Performance Optimization

### Bundle Optimization

#### 1. Analyze Bundle
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

#### 2. Code Splitting
```typescript
// Lazy load components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Route-based code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
```

#### 3. Tree Shaking
```typescript
// Import only what you need
import { formatINR } from './utils/currency';
// Instead of: import * as currency from './utils/currency';
```

### Database Optimization

#### 1. Query Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_financial_data_user_id ON financial_data(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
```

#### 2. Connection Pooling
```typescript
// Supabase handles connection pooling automatically
// Configure connection limits in Supabase dashboard
```

### CDN Configuration

#### 1. Static Asset Optimization
```bash
# Optimize images
npm install --save-dev imagemin imagemin-webp

# Configure image optimization in build process
```

#### 2. Cache Headers
```javascript
// Configure cache headers for static assets
const cacheHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable'
};
```

## Monitoring and Analytics

### Error Monitoring

#### 1. Sentry Setup
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// Sentry configuration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### 2. Error Boundary Integration
```typescript
// Enhanced error boundary with Sentry
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  Sentry.captureException(error, {
    extra: errorInfo,
    tags: {
      component: 'ErrorBoundary'
    }
  });
}
```

### Performance Monitoring

#### 1. Web Vitals Tracking
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Track Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### 2. Custom Metrics
```typescript
// Track custom performance metrics
const trackDatabaseQuery = (queryName: string, duration: number) => {
  // Send to analytics service
  analytics.track('database_query', {
    query: queryName,
    duration,
    timestamp: Date.now()
  });
};
```

### User Analytics

#### 1. Google Analytics 4
```typescript
// GA4 setup
import { gtag } from 'ga-gtag';

gtag('config', process.env.VITE_GA_MEASUREMENT_ID, {
  page_title: document.title,
  page_location: window.location.href
});
```

#### 2. Custom Events
```typescript
// Track user interactions
const trackUserAction = (action: string, category: string, value?: number) => {
  gtag('event', action, {
    event_category: category,
    event_label: userProfile.persona.name,
    value: value
  });
};
```

## Security Configuration

### Content Security Policy

```html
<!-- CSP headers -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com;
  font-src 'self';
  frame-src 'none';
">
```

### Security Headers

```javascript
// Security headers configuration
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
```

## Backup and Recovery

### Database Backup

#### 1. Automated Backups
```bash
# Supabase provides automated daily backups
# Configure backup retention in Supabase dashboard
# Set up backup notifications
```

#### 2. Manual Backup
```bash
# Export database schema and data
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Application Backup

#### 1. Code Repository
```bash
# Ensure code is backed up in version control
git push origin main

# Tag releases for easy rollback
git tag -a v2.0.0 -m "Production release v2.0.0"
git push origin v2.0.0
```

#### 2. Configuration Backup
```bash
# Backup environment configurations
# Store securely in password manager or vault
```

## Rollback Procedures

### Quick Rollback

#### 1. Netlify/Vercel
```bash
# Rollback to previous deployment
netlify rollback
# or
vercel rollback
```

#### 2. Custom Server
```bash
# Rollback to previous build
cp -r /backup/dist /var/www/savingspilot/
systemctl reload nginx
```

### Database Rollback

#### 1. Schema Changes
```sql
-- Create rollback migration
-- Test rollback procedure in staging
-- Apply rollback if needed
```

#### 2. Data Recovery
```bash
# Restore from backup if needed
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

## Health Checks

### Application Health

#### 1. Health Check Endpoint
```typescript
// Health check implementation
const healthCheck = async () => {
  try {
    // Test database connection
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    // Test AI service
    const aiResponse = await geminiService.generateFinancialAdvice(mockData);
    
    return {
      status: 'healthy',
      database: !error,
      ai_service: !!aiResponse,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};
```

#### 2. Monitoring Dashboard
```typescript
// Monitor key metrics
const monitoringMetrics = {
  uptime: '99.9%',
  responseTime: '< 500ms',
  errorRate: '< 0.1%',
  userSatisfaction: '4.8/5'
};
```

### Database Health

#### 1. Connection Monitoring
```sql
-- Monitor active connections
SELECT count(*) FROM pg_stat_activity;

-- Monitor query performance
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

#### 2. Performance Metrics
```sql
-- Monitor table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Scaling Considerations

### Horizontal Scaling

#### 1. Load Balancing
```nginx
# Nginx load balancer configuration
upstream savingspilot_backend {
    server app1.savingspilot.com;
    server app2.savingspilot.com;
    server app3.savingspilot.com;
}

server {
    location / {
        proxy_pass http://savingspilot_backend;
    }
}
```

#### 2. CDN Configuration
```javascript
// Configure CDN for static assets
const cdnConfig = {
  domain: 'cdn.savingspilot.com',
  regions: ['us-east-1', 'eu-west-1', 'ap-south-1'],
  caching: {
    static: '1y',
    dynamic: '1h'
  }
};
```

### Database Scaling

#### 1. Read Replicas
```typescript
// Configure read replicas for analytics queries
const analyticsClient = createClient(READ_REPLICA_URL, ANON_KEY);
const mainClient = createClient(MAIN_DB_URL, ANON_KEY);
```

#### 2. Connection Pooling
```typescript
// Optimize connection pooling
const supabaseConfig = {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'savingspilot-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};
```

## Maintenance Procedures

### Regular Maintenance

#### 1. Weekly Tasks
- [ ] Review error logs and fix critical issues
- [ ] Monitor performance metrics and optimize
- [ ] Update dependencies and security patches
- [ ] Review user feedback and plan improvements
- [ ] Backup verification and testing

#### 2. Monthly Tasks
- [ ] Security audit and vulnerability assessment
- [ ] Performance optimization review
- [ ] Database maintenance and optimization
- [ ] User analytics review and insights
- [ ] Feature usage analysis and planning

#### 3. Quarterly Tasks
- [ ] Comprehensive security review
- [ ] Accessibility audit and improvements
- [ ] Performance benchmark updates
- [ ] User research and feedback integration
- [ ] Technology stack evaluation

### Emergency Procedures

#### 1. Incident Response
```bash
# Incident response checklist
1. Identify and assess the issue
2. Implement immediate fix or rollback
3. Communicate with users if needed
4. Document incident and resolution
5. Conduct post-mortem analysis
```

#### 2. Communication Plan
```markdown
# Incident Communication Template
**Status**: [Investigating/Identified/Monitoring/Resolved]
**Impact**: [Description of user impact]
**Timeline**: [When issue started and expected resolution]
**Updates**: [Regular updates every 30 minutes]
**Resolution**: [Final resolution and prevention measures]
```

## Cost Optimization

### Supabase Costs

#### 1. Database Optimization
```sql
-- Optimize queries to reduce compute usage
-- Use appropriate indexes
-- Archive old data regularly
-- Monitor query performance
```

#### 2. Storage Optimization
```sql
-- Compress large JSON fields
-- Archive old conversation data
-- Implement data retention policies
-- Monitor storage usage
```

### API Costs

#### 1. Gemini AI Optimization
```typescript
// Optimize AI API usage
const optimizeAIUsage = {
  caching: 'Cache common responses',
  batching: 'Batch multiple requests',
  fallbacks: 'Use fallback responses when appropriate',
  rateLimit: 'Implement client-side rate limiting'
};
```

#### 2. Cost Monitoring
```typescript
// Track API usage and costs
const trackAPIUsage = (service: string, tokens: number, cost: number) => {
  analytics.track('api_usage', {
    service,
    tokens,
    cost,
    timestamp: Date.now()
  });
};
```

## Compliance and Legal

### Data Protection

#### 1. GDPR Compliance
- [ ] Privacy policy updated
- [ ] Cookie consent implemented
- [ ] Data export functionality
- [ ] Data deletion functionality
- [ ] User consent management

#### 2. Data Retention
```sql
-- Implement data retention policies
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete old conversation data (older than 2 years)
  DELETE FROM ai_conversations 
  WHERE created_at < NOW() - INTERVAL '2 years';
  
  -- Archive old learning progress
  -- Implementation depends on requirements
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job
SELECT cron.schedule('cleanup-old-data', '0 2 * * 0', 'SELECT cleanup_old_data();');
```

### Accessibility Compliance

#### 1. WCAG 2.1 AA
- [ ] Automated accessibility testing
- [ ] Manual accessibility review
- [ ] User testing with disabled users
- [ ] Accessibility statement published
- [ ] Regular accessibility audits

#### 2. Legal Requirements
- [ ] Section 508 compliance (US)
- [ ] ADA compliance (US)
- [ ] EN 301 549 compliance (EU)
- [ ] Local accessibility laws compliance

## Success Metrics

### Technical Metrics
- **Uptime**: 99.9% availability
- **Performance**: < 3s load time on 3G
- **Error Rate**: < 0.1% error rate
- **Security**: Zero security incidents

### User Metrics
- **User Satisfaction**: > 4.5/5 rating
- **Task Completion**: > 90% success rate
- **Accessibility**: 100% WCAG AA compliance
- **Performance**: Core Web Vitals in green

### Business Metrics
- **User Retention**: > 70% monthly retention
- **Feature Adoption**: > 60% feature usage
- **Financial Impact**: Measurable savings improvement
- **Educational Impact**: Learning module completion rates

---

**Deployment Success**: Following this guide ensures a robust, scalable, and maintainable production deployment of SavingsPilot, ready to serve Indian users with world-class financial education and management tools.