# AeroEdge - Quick Start Guide

Get up and running with AeroEdge in minutes!

## What You Get

A fully functional HR management system with:
- 6 main modules (Dashboard, Employees, Attendance, Leave, Reports, Profile)
- User authentication with role-based access
- Real-time attendance tracking
- Employee management
- Leave request system
- Analytics and reports
- Responsive mobile/web UI

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm run dev
```

This launches the Expo dev server. You can:
- Open in web browser (auto-opens in Expo Go)
- Scan QR code with Expo Go app on mobile
- Open in iOS/Android simulator

### 3. Test the App

**Demo Credentials:**
- Email: `test@example.com`
- Password: `test123`

Note: First time? Create an account with Sign Up button.

## Features at a Glance

### Dashboard Tab
- Quick overview of your status
- Current check-in/leave balance
- Quick action shortcuts
- Manager-specific metrics

### Employees Tab (Admin/HR/Manager)
- Browse all employees
- Search by name, email, or ID
- View employee details
- Organization structure

### Attendance Tab
- Check in/out with work mode selection
- View today's status
- Track working hours
- Monthly summary

### Leave Tab
- View your leave balance
- Apply for new leave
- Track approval status
- Leave history

### Reports Tab
- Employee analytics
- Attendance statistics
- Leave reports
- Team performance metrics

### Profile Tab
- View your information
- Access account settings
- Change password
- Sign out

## File Structure Reference

```
app/                    # All screens and navigation
├── index.tsx          # Login/Register
├── _layout.tsx        # Auth provider setup
└── (tabs)/            # Main app screens
    ├── index.tsx      # Dashboard
    ├── employees.tsx  # Employee list
    ├── attendance.tsx # Check-in/out
    ├── leave.tsx      # Leave management
    ├── reports.tsx    # Analytics
    └── profile.tsx    # User profile

components/           # Reusable UI
├── Button.tsx
└── Input.tsx

contexts/            # State management
└── AuthContext.tsx  # Authentication

lib/                 # Utilities
└── supabase.ts     # Database client

types/              # TypeScript definitions
└── database.ts
```

## Key Technical Details

### Authentication Flow
1. User signs in via email/password
2. Supabase Auth creates session
3. AuthContext stores session and profile
4. App navigates to (tabs) on successful login
5. RLS policies enforce data access

### Data Access
- All queries go through Supabase
- RLS policies automatically filter data
- User can only see their own data
- Managers see team data
- Admins/HR see all data

### State Management
- `AuthContext` manages login state
- Individual screens manage local state
- Use `useAuth()` hook to access auth

## Common Tasks

### Add a New Screen
```typescript
// app/(tabs)/newscreen.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function NewScreen() {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

### Access Authenticated User
```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, profile } = useAuth();

  return <Text>{profile?.first_name}</Text>;
}
```

### Query Database
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('employees')
  .select('*')
  .limit(10);
```

## Available Scripts

```bash
# Start dev server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for web
npm run build:web
```

## Design System

### Colors
- **Primary Blue**: #2563eb
- **Success Green**: #16a34a
- **Warning Amber**: #f59e0b
- **Danger Red**: #dc2626
- **Neutral Gray**: #64748b

### Typography
- Use `fontSize: 28, fontWeight: '700'` for titles
- Use `fontSize: 16, fontWeight: '600'` for labels
- Use `fontSize: 14` for body text
- Use `fontSize: 12` for captions

### Spacing
- Small: 8px
- Medium: 16px
- Large: 24px
- Extra Large: 32px

## Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 19000
lsof -ti:19000 | xargs kill -9
npm run dev
```

### Clear Cache
```bash
npm run dev -- -c
```

### Reset Everything
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev -- -c
```

## Next Steps

1. **Customize Branding**
   - Update app.json with your company name
   - Replace logo in assets/images/
   - Modify color scheme in styles

2. **Add More Features**
   - Implement leave request workflow
   - Add notification system
   - Create advanced reporting
   - Setup email notifications

3. **Deploy**
   - Build APK for Android
   - Build IPA for iOS
   - Deploy web version
   - Setup backend services

4. **Integration**
   - Connect to payroll system
   - Integrate with email
   - Add calendar sync
   - Setup SMS alerts

## Resources

- **Expo**: https://expo.dev
- **React Native**: https://reactnative.dev
- **Supabase**: https://supabase.com
- **Lucide Icons**: https://lucide.dev

## Need Help?

- Check SETUP.md for detailed documentation
- Review component examples in `components/`
- Look at context examples in `contexts/`
- Check type definitions in `types/`

Happy coding!
