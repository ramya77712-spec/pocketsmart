# SavingsPilot API Documentation

## Overview

SavingsPilot uses Supabase as the backend database with PostgreSQL. All API interactions are handled through the Supabase client with Row Level Security (RLS) policies ensuring data privacy and security.

## Database Schema

### Tables

#### user_profiles
Stores user profile information and preferences.

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  persona_id text DEFAULT 'student',
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  total_saved numeric DEFAULT 0,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can only access their own profile data
- INSERT, SELECT, UPDATE, DELETE policies based on `auth.uid() = user_id`

#### financial_data
Stores user financial information including income, expenses, and savings.

```sql
CREATE TABLE financial_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_income numeric DEFAULT 0,
  expenses jsonb DEFAULT '[]',
  emergency_fund numeric DEFAULT 0,
  current_savings numeric DEFAULT 0,
  currency text DEFAULT 'INR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can only access their own financial data
- Full CRUD operations restricted to data owner

#### user_badges
Tracks user achievements and badge unlocks.

```sql
CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  category text NOT NULL
);
```

#### learning_progress
Records user progress through learning modules.

```sql
CREATE TABLE learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  completed boolean DEFAULT false,
  score integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  time_spent integer DEFAULT 0
);
```

#### challenges
Manages user challenge participation and progress.

```sql
CREATE TABLE challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id text NOT NULL,
  is_active boolean DEFAULT true,
  progress integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  target integer NOT NULL
);
```

#### ai_conversations
Stores AI chat conversation history.

```sql
CREATE TABLE ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_data jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## API Endpoints

### Authentication

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: string,
  password: string,
  options: {
    data: {
      name: string
    }
  }
});
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string
});
```

#### Password Reset
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
});
```

### User Profile Management

#### Get User Profile
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .maybeSingle();
```

#### Save User Profile
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .upsert({
    user_id: string,
    name: string,
    persona_id: string,
    level: number,
    experience: number,
    streak_days: number,
    total_saved: number,
    preferences: object
  })
  .select()
  .single();
```

### Financial Data Management

#### Get Financial Data
```typescript
const { data, error } = await supabase
  .from('financial_data')
  .select('*')
  .eq('user_id', userId)
  .maybeSingle();
```

#### Save Financial Data
```typescript
const { error } = await supabase
  .from('financial_data')
  .upsert({
    user_id: string,
    monthly_income: number,
    expenses: Expense[],
    emergency_fund: number,
    current_savings: number,
    currency: string
  });
```

### Badge Management

#### Unlock Badge
```typescript
const { error } = await supabase
  .from('user_badges')
  .insert({
    user_id: string,
    badge_id: string,
    unlocked_at: string,
    category: string
  });
```

#### Get User Badges
```typescript
const { data, error } = await supabase
  .from('user_badges')
  .select('*')
  .eq('user_id', userId)
  .order('unlocked_at', { ascending: false });
```

### Learning Progress

#### Save Learning Progress
```typescript
const { error } = await supabase
  .from('learning_progress')
  .upsert({
    user_id: string,
    module_id: string,
    completed: boolean,
    score: number,
    completed_at: string,
    time_spent: number
  });
```

#### Get Learning Progress
```typescript
const { data, error } = await supabase
  .from('learning_progress')
  .select('*')
  .eq('user_id', userId)
  .order('completed_at', { ascending: false });
```

### Challenge Management

#### Save Challenge Progress
```typescript
const { error } = await supabase
  .from('challenges')
  .upsert({
    user_id: string,
    challenge_id: string,
    is_active: boolean,
    progress: number,
    started_at: string,
    completed_at: string | null,
    target: number
  });
```

#### Get User Challenges
```typescript
const { data, error } = await supabase
  .from('challenges')
  .select('*')
  .eq('user_id', userId)
  .order('started_at', { ascending: false });
```

### AI Conversations

#### Save Conversation
```typescript
const { error } = await supabase
  .from('ai_conversations')
  .upsert({
    user_id: string,
    conversation_data: object
  });
```

## Error Handling

### Common Error Codes

#### PGRST116 - No Rows Returned
- **Cause**: Query expects single row but returns zero rows
- **Solution**: Use `maybeSingle()` instead of `single()`
- **Handling**: Check for null data and provide defaults

#### 42P01 - Relation Does Not Exist
- **Cause**: Database table not created
- **Solution**: Run migration files to create tables
- **Prevention**: Ensure all migrations are applied

#### 23505 - Unique Violation
- **Cause**: Attempting to insert duplicate unique values
- **Solution**: Use `upsert()` for insert-or-update operations
- **Handling**: Provide user feedback for conflicts

### Error Boundary Implementation

```typescript
class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }
}
```

## Security Considerations

### Row Level Security (RLS)

All tables implement RLS policies ensuring:
- Users can only access their own data
- No cross-user data leakage
- Automatic user isolation

### Input Validation

- **Client-side**: Form validation with TypeScript types
- **Server-side**: Database constraints and triggers
- **Sanitization**: Proper data cleaning before storage

### Authentication Security

- **JWT Tokens**: Secure token-based authentication
- **Password Requirements**: Minimum 6 characters
- **Rate Limiting**: Built-in Supabase rate limiting
- **Session Management**: Automatic token refresh

## Performance Optimization

### Database Optimization

- **Indexes**: Proper indexing on frequently queried columns
- **Query Optimization**: Efficient queries with minimal data transfer
- **Connection Pooling**: Supabase handles connection management
- **Caching**: Client-side caching for static data

### Frontend Optimization

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Proper image loading and caching
- **Memoization**: React.memo and useMemo for expensive operations

## Monitoring and Analytics

### Performance Monitoring

```typescript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking

```typescript
// Error reporting setup
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error reporting service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error reporting service
});
```

### User Analytics

```typescript
// Track user interactions
const trackEvent = (eventName: string, properties: object) => {
  // Send to analytics service
  console.log('Event:', eventName, properties);
};
```

## Development Workflow

### Local Development Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd savingspilot
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Configure Supabase and Gemini AI credentials
```

4. **Database Setup**
- Connect to Supabase project
- Run migration files to create schema
- Verify RLS policies are active

5. **Start Development Server**
```bash
npm run dev
```

### Testing Strategy

#### Unit Tests
- **Utils**: Currency formatting, calculations
- **Services**: Database operations, API calls
- **Components**: Individual component functionality

#### Integration Tests
- **Authentication Flow**: Complete login/signup process
- **Data Flow**: End-to-end data persistence
- **User Journeys**: Critical user paths

#### Accessibility Tests
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliance verification

### Deployment Process

#### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Bundle size optimized
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Error monitoring setup
- [ ] Performance benchmarks met

#### Production Deployment
1. **Build Application**
```bash
npm run build
```

2. **Deploy to Hosting Platform**
- Netlify: Connect GitHub repository
- Vercel: Use Vercel CLI
- Custom: Upload dist/ folder

3. **Configure Environment**
- Set production environment variables
- Configure custom domain
- Enable HTTPS and security headers

4. **Post-deployment Verification**
- Test all critical user flows
- Verify database connectivity
- Check error monitoring
- Validate performance metrics

## Troubleshooting

### Common Issues

#### Database Connection Issues
- **Symptom**: "relation does not exist" errors
- **Solution**: Ensure all migration files are applied
- **Prevention**: Use Supabase dashboard to verify schema

#### Authentication Issues
- **Symptom**: Login/signup failures
- **Solution**: Check Supabase project configuration
- **Prevention**: Verify environment variables

#### Theme/Language Issues
- **Symptom**: Context provider errors
- **Solution**: Ensure proper provider wrapping
- **Prevention**: Check component hierarchy

### Debug Tools

#### Supabase Debugging
```typescript
// Enable debug mode
const supabase = createClient(url, key, {
  db: { schema: 'public' },
  global: { headers: { 'X-Client-Info': 'savingspilot-debug' } }
});
```

#### React DevTools
- Install React Developer Tools browser extension
- Use Profiler to identify performance bottlenecks
- Monitor component re-renders and state changes

#### Network Debugging
- Use browser DevTools Network tab
- Monitor API request/response times
- Check for failed requests and error responses

---

This documentation provides comprehensive coverage of the SavingsPilot API, database schema, security considerations, and development workflow. For additional support, refer to the main README or contact the development team.