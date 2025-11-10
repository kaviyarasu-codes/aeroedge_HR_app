# AeroEdge - Smart HR & Attendance Management System

A comprehensive HR and attendance management platform built with Expo and Supabase.

## Project Overview

AeroEdge is a modern, feature-rich HR management system designed to streamline workforce operations. The app provides:

- Employee management and organizational hierarchy
- Real-time attendance tracking (Check-in/Check-out)
- Leave management with approval workflows
- Shift and time tracking
- Comprehensive analytics and reports
- Role-based access control
- Full mobile and web support via Expo

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **UI Components**: Lucide React Native Icons
- **Navigation**: Expo Router
- **State Management**: React Context API

## Project Structure

```
aeroedge/
├── app/                          # Expo Router navigation
│   ├── _layout.tsx              # Root layout with auth provider
│   ├── index.tsx                # Authentication screen
│   └── (tabs)/                  # Tab-based navigation
│       ├── _layout.tsx          # Tab configuration
│       ├── index.tsx            # Dashboard
│       ├── employees.tsx        # Employee management
│       ├── attendance.tsx       # Attendance tracking
│       ├── leave.tsx            # Leave management
│       ├── reports.tsx          # Reports & analytics
│       └── profile.tsx          # User profile
├── components/                  # Reusable UI components
│   ├── Button.tsx              # Custom button component
│   └── Input.tsx               # Custom input component
├── contexts/                    # React contexts
│   └── AuthContext.tsx         # Authentication context
├── lib/                        # Utilities and API clients
│   └── supabase.ts             # Supabase client setup
├── types/                      # TypeScript type definitions
│   └── database.ts             # Database types
└── hooks/                      # Custom React hooks
    └── useFrameworkReady.ts    # Framework initialization
```

## Core Features

### 1. Authentication
- Sign up with email and password
- Sign in functionality
- Role-based access control (Admin, HR, Manager, Employee, Intern)
- Persistent sessions
- Secure logout

### 2. Dashboard
- Personalized welcome message
- Quick stats (Attendance status, Leave balance, Team info)
- Quick action shortcuts
- Recent activity feed

### 3. Employee Management
- View all employees (HR/Admin only)
- Search and filter employees
- Employee profile details
- Organizational hierarchy
- Department and designation info

### 4. Attendance Management
- Daily check-in/check-out
- Office or Remote work mode selection
- Current time display
- Work hours tracking
- Monthly attendance summary

### 5. Leave Management
- View leave balance by type
- Request new leave
- Track leave request status
- Approval workflows
- Loss of Pay (LOP) calculations

### 6. Reports & Analytics
- Employee information reports
- Attendance analytics
- Leave tracker reports
- Time tracking insights
- Team and organizational metrics

### 7. User Profile
- View personal information
- Employee details (designation, department, code)
- Account settings
- Password management
- Sign out functionality

## Database Schema

The app uses Supabase PostgreSQL with the following main tables:

### Organizations & Structure
- `organizations` - Company details
- `departments` - Organizational departments
- `designations` - Job titles
- `locations` - Office locations
- `streams` - Custom employee classifications

### User Management
- `profiles` - User profile information
- `employees` - Employee records with hierarchy

### Attendance
- `attendance_records` - Daily check-in/check-out
- `shifts` - Shift definitions
- `employee_shifts` - Shift assignments

### Leave
- `leave_types` - Leave categories
- `leave_balances` - Employee entitlements
- `leave_requests` - Leave applications

### Time Tracking
- `projects` - Project definitions
- `time_entries` - Work log entries

### Approvals
- `approval_workflows` - Workflow definitions
- `approval_requests` - Pending approvals

All tables have Row Level Security (RLS) policies enforcing role-based access control.

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Expo CLI
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   cd aeroedge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - The `.env` file contains your Supabase credentials
   - Ensure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set

4. **Database Setup**
   - All database migrations have been applied
   - The schema includes all necessary tables with RLS policies

### Running the App

```bash
# Development mode
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Web build
npm run build:web
```

## User Roles & Permissions

### Admin
- Full access to all features
- User management
- Organization configuration
- System settings

### HR Manager
- Employee management
- Attendance oversight
- Leave approvals
- Reports generation

### Manager
- View team details
- Approve team leave requests
- Team analytics
- Report generation for team

### Employee
- Personal attendance tracking
- Leave management
- Personal reports
- Profile management

### Intern
- Basic attendance tracking
- Limited leave access
- Restricted feature access

## API Endpoints

All data access goes through Supabase REST/RealTime APIs. Key data flows:

- Authentication: `supabase.auth.*`
- Employee data: `supabase.from('employees').select()`
- Attendance: `supabase.from('attendance_records')`
- Leave management: `supabase.from('leave_requests')`
- Reports: Query multiple tables with aggregations

## Security Features

1. **Row Level Security (RLS)**: All tables enforce RLS policies
2. **Authentication**: Supabase Auth with secure session management
3. **Role-Based Access**: Features restricted by user role
4. **Data Encryption**: SSL/TLS for all data transmission
5. **Session Management**: Auto-refresh tokens for persistent sessions

## Styling Conventions

- **Color Scheme**:
  - Primary: `#2563eb` (Blue)
  - Success: `#16a34a` (Green)
  - Warning: `#f59e0b` (Amber)
  - Danger: `#dc2626` (Red)
  - Neutral: `#64748b` (Slate)

- **Typography**:
  - Display: 28px, 700 weight
  - Title: 16-20px, 700 weight
  - Body: 14-16px, 400-600 weight
  - Caption: 12px, 400-600 weight

- **Spacing**: 8px grid system (8, 16, 24, 32, etc.)
- **Border Radius**: 8px (small), 12px (medium), 16px (large)
- **Shadows**: Subtle elevation with 0.05 opacity

## Best Practices

1. **Component Organization**: Keep components focused and reusable
2. **State Management**: Use Context API for global state
3. **Error Handling**: Display user-friendly error messages
4. **Loading States**: Show feedback during data operations
5. **Type Safety**: Leverage TypeScript for type checking
6. **Accessibility**: Use semantic components and proper labels

## Troubleshooting

### App Won't Start
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo start -c`
- Check environment variables in `.env`

### Type Errors
- Run `npm run typecheck` to identify issues
- Ensure all imports use correct paths with `@/` alias

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check network connectivity
- Ensure RLS policies aren't blocking queries

### Authentication Issues
- Clear app cache and restart
- Verify email/password credentials
- Check Supabase Auth settings

## Future Enhancements

- Payroll management integration
- Recruitment module
- Performance appraisals
- Expense claims
- Chat and collaboration
- Advanced analytics with AI
- Mobile app notifications
- Biometric attendance
- Geo-fencing support

## Performance Optimization

- Implement pagination for large datasets
- Use React.memo for component optimization
- Implement lazy loading for screens
- Cache frequently accessed data
- Optimize database queries with indexes
- Monitor bundle size

## Support & Documentation

- Supabase Docs: https://supabase.com/docs
- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev
- Lucide Icons: https://lucide.dev

## License

This project is provided as-is for organizational use.

## Contact

For questions or issues, please refer to the project documentation or contact the development team.
