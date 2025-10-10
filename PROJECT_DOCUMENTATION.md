# CRM-Front Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Authentication & Authorization](#authentication--authorization)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [UI/UX Design](#uiux-design)
9. [Calendar System](#calendar-system)
10. [Key Utilities](#key-utilities)
11. [Development Features](#development-features)
12. [Data Flow](#data-flow)
13. [Business Logic](#business-logic)
14. [Security Features](#security-features)
15. [Responsive Design](#responsive-design)
16. [Getting Started](#getting-started)
17. [File Structure Details](#file-structure-details)
18. [Component Architecture](#component-architecture)
19. [API Endpoints](#api-endpoints)
20. [Configuration](#configuration)

---

## 🏗️ Project Overview

**CRM-Front** is a comprehensive Customer Relationship Management (CRM) frontend application built with modern web technologies. It's designed for managing customers, contracts, leads, and business operations with a Persian/Farsi interface supporting RTL (Right-to-Left) layout.

### Key Characteristics:
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit + TanStack React Query
- **Interface**: Persian/Farsi with RTL support
- **Target**: Business management and customer relationship operations

---

## 🛠️ Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.15 | React framework with App Router |
| React | 18 | UI library |
| TypeScript | 5+ | Type safety and development experience |
| Tailwind CSS | 3.4.1 | Utility-first CSS framework |

### State Management
| Library | Version | Purpose |
|---------|---------|---------|
| Redux Toolkit | 2.5.0 | Global state management |
| TanStack React Query | 5.62.16 | Server state management and caching |
| React Redux | 9.2.0 | React bindings for Redux |

### UI Components & Styling
| Library | Version | Purpose |
|---------|---------|---------|
| @radix-ui/* | Various | Accessible UI primitives |
| Framer Motion | 12.12.1 | Animation library |
| Lucide React | 0.453.0 | Icon library |
| React Icons | 5.3.0 | Additional icons |

### Forms & Validation
| Library | Version | Purpose |
|---------|---------|---------|
| Formik | 2.4.6 | Form handling |
| Yup | 1.4.0 | Schema validation |

### Data Visualization & Charts
| Library | Version | Purpose |
|---------|---------|---------|
| ApexCharts | 3.54.1 | Chart library |
| React ApexCharts | 1.5.0 | React wrapper for ApexCharts |
| Recharts | 2.15.3 | Alternative chart library |

### Calendar & Date Handling
| Library | Version | Purpose |
|---------|---------|---------|
| React Big Calendar | 1.19.4 | Calendar component |
| @fullcalendar/* | 6.1.19 | Full-featured calendar |
| Moment.js | 2.30.1 | Date manipulation |
| Moment Hijri | 3.0.0 | Islamic calendar support |
| Moment Jalaali | 0.10.4 | Persian calendar support |
| Day.js | 4.1.0 | Lightweight date library |

### PDF & Export
| Library | Version | Purpose |
|---------|---------|---------|
| React PDF | 4.3.0 | PDF generation |
| jsPDF | 3.0.1 | PDF creation |
| XLSX | 0.18.5 | Excel file handling |

### Maps & Location
| Library | Version | Purpose |
|---------|---------|---------|
| Leaflet | 1.9.4 | Interactive maps |
| React Leaflet | 4.2.1 | React wrapper for Leaflet |

---

## 📁 Project Structure

```
CRM-Front/
├── app/                          # Next.js App Router
│   ├── (admin-layout)/          # Admin section layout
│   │   ├── admin/               # Admin pages
│   │   │   ├── category/        # Category management
│   │   │   ├── package/         # Package management
│   │   │   ├── permission/      # Permission management
│   │   │   └── role/           # Role management
│   │   └── layout.tsx          # Admin layout
│   ├── (dashboard-layout)/      # Main dashboard layout
│   │   ├── calendar/           # Calendar page
│   │   ├── contract/           # Contract pages
│   │   ├── customer/           # Customer pages
│   │   ├── lead/              # Lead management
│   │   ├── notification/      # Notifications
│   │   ├── report/            # Reports
│   │   ├── sale/              # Sales/Contracts
│   │   └── setting/           # Settings
│   └── (login-layout)/         # Authentication layout
│       ├── login/             # Login pages
│       ├── signup/            # Registration
│       └── post-signup/       # Post-registration
├── components/                  # React components
│   ├── admin/                 # Admin components
│   ├── chart/                 # Chart components
│   ├── contract/              # Contract components
│   ├── customer/              # Customer components
│   ├── events/                # Calendar/Event components
│   ├── lead/                  # Lead components
│   ├── login/                 # Authentication components
│   ├── menu/                  # Navigation components
│   ├── notification/          # Notification components
│   ├── register/              # Registration components
│   ├── report/                # Report components
│   ├── sale/                  # Sales components
│   ├── section/               # Section components
│   ├── service/               # Service components
│   ├── setting/               # Settings components
│   ├── shared/                # Shared components
│   ├── signup/                # Signup components
│   └── ui/                    # UI primitives
├── api/                        # API service functions
│   ├── auth.ts                # Authentication API
│   ├── customer.ts            # Customer API
│   ├── contract.ts            # Contract API
│   ├── lead.ts                # Lead API
│   └── ...                    # Other API modules
├── boot/                       # Bootstrap/initialization
│   └── fetch-service.ts       # Centralized HTTP client
├── config/                     # Configuration files
│   └── config.ts              # App configuration
├── constants/                  # Application constants
│   ├── navigation-links.tsx   # Navigation configuration
│   ├── pages-data.tsx         # Page data configuration
│   └── ...                    # Other constants
├── contexts/                   # React contexts
│   └── AccessContext.tsx      # Access control context
├── hooks/                      # Custom React hooks
│   ├── usePageData.tsx        # Page data hook
│   └── ...                    # Other custom hooks
├── lib/                        # Utility libraries
│   ├── utils.ts               # General utilities
│   ├── date.ts                # Date utilities
│   ├── calendar.ts            # Calendar utilities
│   └── ...                    # Other utilities
├── store/                      # Redux store
│   ├── index.ts               # Store configuration
│   ├── user-slice.ts          # User state
│   ├── customer-slice.ts      # Customer state
│   ├── contract-slice.ts      # Contract state
│   ├── lead-slice.ts          # Lead state
│   ├── access-slice.ts        # Access control state
│   └── ...                    # Other slices
├── types/                      # TypeScript definitions
│   └── globals.ts             # Global type definitions
├── public/                     # Static assets
├── globals.css                 # Global styles
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## 🎯 Core Features

### 1. Customer Management
- **Customer Listing**: Paginated list with advanced filtering
- **Customer Details**: Comprehensive customer profiles
- **Customer Search**: Real-time search functionality
- **Customer Ranking**: Profit-based customer classification
- **Export Capabilities**: Excel and PDF export
- **Satisfaction Tracking**: Customer satisfaction scoring

### 2. Contract Management
- **Contract Creation**: Multi-step contract creation process
- **Contract Types**: Support for various contract types (Flight, Visa, Hotel, etc.)
- **Contract Status**: Workflow-based status management
- **Financial Calculations**: Automatic profit/loss calculations
- **Contract History**: Complete contract timeline
- **Service Integration**: Multi-service contract support

### 3. Lead Management
- **Lead Creation**: Comprehensive lead entry forms
- **Lead Temperature**: Hot/Warm/Cold classification system
- **Lead Status**: Progress tracking (Initial → In Progress → Contracted/Failed)
- **Tag System**: Flexible tagging for lead organization
- **Follow-up Tracking**: Scheduled follow-up management
- **Lead Conversion**: Convert leads to contracts

### 4. Calendar & Events
- **Multi-Calendar Support**: Jalali, Hijri, and Gregorian calendars
- **Event Scheduling**: Create and manage events
- **Follow-up Management**: Track customer follow-ups
- **View Modes**: Daily, Weekly, and Monthly views
- **Event Types**: Different event types (Call, SMS, Email, Meeting, VOIP)
- **Date Navigation**: Easy date navigation and selection

### 5. Reports & Analytics
- **Dashboard KPIs**: Key performance indicators
- **Chart Visualizations**: Various chart types (Bar, Pie, Line)
- **Time-based Filtering**: Flexible date range selection
- **Export Functionality**: Export reports in multiple formats
- **Real-time Data**: Live data updates
- **Custom Reports**: Configurable report generation

### 6. Admin Panel
- **User Management**: Create and manage users
- **Role-based Permissions**: Granular permission system
- **System Settings**: Configure system parameters
- **Package Management**: Manage service packages
- **Category Management**: Organize services and products
- **Access Control**: Page and feature-level permissions

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Login Process**: Username/password authentication
2. **Token Management**: JWT access and refresh tokens
3. **Automatic Refresh**: Seamless token renewal
4. **Logout Handling**: Secure session termination

### Authorization System
```typescript
interface PageAccess {
  url: string;
  code: string;
  show: boolean;
  title: string;
  pageId: number;
  enabled: boolean;
  features: string[];
}
```

### Access Control Features
- **Page-level Permissions**: Control access to specific pages
- **Feature-level Permissions**: Granular feature access
- **Role-based Access**: User roles with different permissions
- **Dynamic Navigation**: Show/hide menu items based on permissions
- **Context-based Access**: AccessContext for permission checking

### Key Components
- **AccessContext**: React context for permission management
- **access-slice**: Redux slice for access state
- **fetch-service**: Automatic token refresh and permission headers

---

## 🗄️ State Management

### Redux Store Structure
```typescript
interface RootState {
  user: UserState;
  customer: CustomerState;
  contract: ContractState;
  lead: LeadState;
  access: AccessState;
  notification: NotificationState;
  // ... other slices
}
```

### Key Redux Slices

#### User Slice
```typescript
interface UserData {
  fullName: string;
  id: number;
  chadcoCustomerId: number;
  userRole: UserRole[];
  registerationRequestId: number;
  status: string;
  code: string;
}
```

#### Customer Slice
```typescript
interface CustomerState {
  items: Customer[];
  currentPage: number;
  totalPages: number;
  filters: FilterOptions;
  checkedItems: Customer[];
  total: number;
  allItems: Customer[];
  dateTimeRange: DateRange;
}
```

#### Contract Slice
```typescript
interface ContractState {
  items: Contract[];
  currentPage: number;
  totalPages: number;
  filters: FilterOptions;
  ContractOverviewList: OverviewItem[];
  limit: number;
  scrollPosition: number;
  allItems: Contract[];
  total: number;
  checkedItems: Contract[];
  dateTimeRange: DateRange;
}
```

#### Lead Slice
```typescript
interface LeadState {
  items: Lead[];
  currentPage: number;
  totalPages: number;
  filters: FilterOptions;
  limit: number;
  allItems: Lead[];
  total: number;
  checkedItems: Lead[];
  dateTimeRange: DateRange;
}
```

### Async Actions
- **fetchCustomers**: Load customer data with pagination
- **fetchContracts**: Load contract data with filtering
- **fetchLeads**: Load lead data with search
- **fetchUserData**: Load user profile information

---

## 🌐 API Integration

### Centralized HTTP Client
The `fetch-service.ts` provides a centralized HTTP client with the following features:

#### Key Features
- **Automatic Token Refresh**: Handles 401 errors by refreshing tokens
- **Request Interceptors**: Adds authentication headers
- **Response Interceptors**: Handles common response patterns
- **Error Handling**: Centralized error management
- **Toast Notifications**: User-friendly error messages

#### Usage Example
```typescript
const result = await fetchService("customer/rank", {
  method: "POST",
  body: filters
});
```

### API Structure
```
/api/v1/
├── auth/                    # Authentication endpoints
├── user/                    # User management
├── customer/                # Customer operations
├── contract-chadco-customer/ # Contract management
├── lead/                    # Lead management
├── calendar/                # Calendar events
├── notification/            # Notifications
└── ...                      # Other endpoints
```

### Request/Response Pattern
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationInfo;
  meta?: MetaInfo;
  ui?: {
    type: "toast";
    message: string;
  };
}
```

---

## 🎨 UI/UX Design

### Design System
The application uses a comprehensive design system with:

#### Color Palette
```css
:root {
  --primary: 226, 48%, 21%;
  --secondary: 218, 72%, 63%;
  --tertiary: 220, 24%, 12%;
  --quartiery: 210, 14%, 13%;
  --success: 171, 23%, 84%;
  --warning: 42, 86%, 89%;
  --negative: 0, 74.78%, 54.9%;
  --info: 35, 73%, 54%;
  /* ... more colors */
}
```

#### Typography
- **Primary Font**: IRANSans (Persian)
- **Font Weights**: Regular (400), Medium (500), Bold (700)
- **RTL Support**: Right-to-left text direction
- **Responsive Typography**: Scalable font sizes

#### Spacing System
- **Container Padding**: 15px (mobile), 15px (tablet), 15px (desktop)
- **Custom Spacing**: Extended spacing values (3.5, 4.5, 5.5, etc.)
- **Consistent Margins**: Standardized margin system

### Key UI Components

#### FormMaker
Dynamic form generation component with support for:
- Input fields with floating labels
- Select dropdowns
- Radio buttons
- Checkboxes
- Date pickers
- Multi-select components
- Tag inputs

#### FilterContainer
Advanced filtering component with:
- Multiple filter types
- Date range selection
- Sort options
- Reset functionality
- Real-time filtering

#### ExportDataContainer
Data export functionality with:
- Excel export
- PDF generation
- Custom headers
- Filtered data export
- Loading states

### Responsive Design
- **Mobile-first Approach**: Designed for mobile devices first
- **Breakpoint System**: sm, md, lg, xl breakpoints
- **Adaptive Layouts**: Different layouts for different screen sizes
- **Touch-friendly**: Optimized for touch interactions

---

## 📅 Calendar System

### Multi-Calendar Support
The application supports three calendar systems:

#### 1. Jalali (Persian) Calendar
- **Primary Calendar**: Main calendar for Persian users
- **Date Conversion**: Automatic conversion to/from Gregorian
- **Leap Year Handling**: Proper leap year calculations
- **Month Names**: Persian month names

#### 2. Hijri (Islamic) Calendar
- **Islamic Dates**: Support for Islamic calendar
- **Date Conversion**: Conversion utilities
- **Religious Events**: Support for Islamic holidays

#### 3. Gregorian Calendar
- **International Standard**: Standard Gregorian calendar
- **Business Operations**: Used for business date calculations

### Calendar Features
- **Multiple Views**: Daily, Weekly, Monthly views
- **Event Management**: Create, edit, delete events
- **Event Types**: Different event types with color coding
- **Date Navigation**: Easy navigation between dates
- **Event Filtering**: Filter events by type
- **Responsive Design**: Works on all device sizes

### Event Types
```typescript
enum EventType {
  CALL = "CALL",      // Phone calls
  SMS = "SMS",        // Text messages
  EMAIL = "EMAIL",    // Email communications
  MEET = "MEET",      // Meetings
  VOIP = "VOIP"       // VoIP calls
}
```

---

## 🔧 Key Utilities

### Date Handling
```typescript
// Date conversion utilities
convertDateWithTimeZone(date: string, calendarType: CalendarType)
convertToGregorianYMD(jalaliDate: JalaliDate)
getCalendarInfo(date: string, calendarType: CalendarType)
generateVisibleRange(date: string, calendarType: CalendarType)
```

### Data Processing
```typescript
// Price formatting
formatPrice(price: number): string
cleanFormatPrice(priceString: string): number

// Data cleaning
cleanObject(obj: any): any
buildQueryString(params: Record<string, any>): string
```

### Export Utilities
```typescript
// Excel export
exportToExcel(data: any[], filename: string)

// PDF generation
generatePDF(data: any[], options: PDFOptions)
```

### Validation
```typescript
// Form validation schemas
const customerValidationSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required()
});
```

---

## 🚀 Development Features

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Path Aliases**: `@/*` for clean imports
- **Modular Architecture**: Well-organized component structure

### Performance Optimizations
- **React Query**: Intelligent caching and background updates
- **Lazy Loading**: Code splitting for better performance
- **Image Optimization**: Next.js image optimization
- **Bundle Optimization**: Optimized build output

### Development Tools
- **Hot Reload**: Fast development iteration
- **Type Checking**: Real-time type checking
- **Error Boundaries**: Graceful error handling
- **Development Server**: Optimized development experience

---

## 🔄 Data Flow

### 1. Authentication Flow
```
User Login → API Call → Token Storage → Permission Check → Dashboard Access
```

### 2. Data Loading Flow
```
Component Mount → Redux Action → API Call → Response Processing → State Update → UI Render
```

### 3. Form Submission Flow
```
User Input → Form Validation → API Call → Success/Error Handling → State Update → UI Feedback
```

### 4. Permission Check Flow
```
Route Access → AccessContext Check → Permission Validation → Component Render/Redirect
```

---

## 💼 Business Logic

### Customer Ranking System
```typescript
interface CustomerRanking {
  profit: number;           // Total profit from customer
  satisfactionScore: number; // Average satisfaction rating
  contractCount: number;    // Number of contracts
  lastActivity: Date;       // Last interaction date
  rank: number;             // Calculated rank
}
```

### Lead Temperature System
```typescript
enum LeadTemperature {
  HOT = "HOT",     // High probability of conversion
  WARM = "WARM",   // Medium probability
  COLD = "COLD"    // Low probability
}
```

### Contract Processing
```typescript
interface ContractProcessing {
  services: Service[];      // Available services
  pricing: PricingInfo;     // Cost and profit calculations
  timeline: TimelineInfo;   // Contract timeline
  status: ContractStatus;   // Current status
}
```

### Financial Calculations
- **Profit Calculation**: `sellPrice - buyPrice`
- **Customer Value**: Total profit from all contracts
- **Satisfaction Scoring**: Average rating from 1-10
- **Performance Metrics**: KPIs and analytics

---

## 🛡️ Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Session Management**: Secure session handling
- **Logout Security**: Proper session cleanup

### Authorization Security
- **Role-based Access**: Granular permission system
- **Page Protection**: Route-level access control
- **Feature Flags**: Dynamic feature access
- **API Security**: Protected API endpoints

### Data Security
- **Input Validation**: Yup schema validation
- **XSS Protection**: Proper data sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security headers in requests

---

## 📱 Responsive Design

### Breakpoint System
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Mobile Optimization
- **Touch-friendly**: Large touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Responsive Navigation**: Collapsible sidebar
- **Optimized Forms**: Mobile-friendly form layouts

### Desktop Features
- **Full Navigation**: Complete sidebar navigation
- **Multi-column Layouts**: Efficient use of screen space
- **Keyboard Shortcuts**: Power user features
- **Advanced Filtering**: Complex filter options

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd CRM-Front

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint"          // Code linting
}
```

### Environment Setup
1. Configure API endpoints in `config/config.ts`
2. Set up authentication tokens
3. Configure database connections
4. Set up file storage for uploads

---

## 📂 File Structure Details

### App Router Structure
```
app/
├── (admin-layout)/          # Route group for admin
│   ├── admin/              # Admin pages
│   └── layout.tsx          # Admin layout
├── (dashboard-layout)/     # Route group for dashboard
│   ├── customer/           # Customer pages
│   ├── contract/           # Contract pages
│   └── layout.tsx          # Dashboard layout
└── (login-layout)/         # Route group for auth
    ├── login/              # Login pages
    └── layout.tsx          # Auth layout
```

### Component Organization
```
components/
├── shared/                 # Reusable components
│   ├── layout.tsx         # Main layout
│   ├── header.tsx         # App header
│   ├── drawer.tsx         # Sidebar navigation
│   └── form-maker.tsx     # Dynamic forms
├── customer/              # Customer-specific components
│   ├── customer-card.tsx  # Customer display card
│   ├── customer-table.tsx # Customer data table
│   └── customer-form.tsx  # Customer forms
└── ui/                    # UI primitives
    ├── button.tsx         # Button component
    ├── input.tsx          # Input component
    └── modal.tsx          # Modal component
```

---

## 🏗️ Component Architecture

### Component Hierarchy
```
App
├── Layout
│   ├── Header
│   │   ├── Search
│   │   ├── Notifications
│   │   └── ProfileDropdown
│   └── Drawer
│       └── Navigation
├── Pages
│   ├── CustomerPage
│   │   ├── FilterContainer
│   │   ├── CustomerContainer
│   │   └── CustomerTable
│   ├── ContractPage
│   │   ├── ContractContainer
│   │   └── ContractCard
│   └── LeadPage
│       ├── LeadContainer
│       └── LeadTable
└── Modals
    ├── CustomerModal
    ├── ContractModal
    └── LeadModal
```

### Component Patterns
- **Container Components**: Handle data and business logic
- **Presentation Components**: Handle UI rendering
- **Custom Hooks**: Reusable logic extraction
- **Higher-Order Components**: Cross-cutting concerns

---

## 🌐 API Endpoints

### Authentication Endpoints
```
POST /api/v1/auth/login              # User login
POST /api/v1/auth/logout             # User logout
POST /api/v1/auth/forgot-password    # Password reset request
POST /api/v1/auth/reset-password     # Password reset
POST /api/v1/auth/renew              # Token refresh
```

### Customer Endpoints
```
GET  /api/v1/customer/rank           # Get customer list
GET  /api/v1/customer/personal-info/:id  # Get customer details
POST /api/v1/customer/filter         # Filter customers
```

### Contract Endpoints
```
GET  /api/v1/contract-chadco-customer/filter-contracts  # Get contracts
GET  /api/v1/contract-chadco-customer/:id              # Get contract details
POST /api/v1/contract-chadco-customer/:id              # Create contract
PUT  /api/v1/contract-chadco-customer/:id              # Update contract
```

### Lead Endpoints
```
GET  /api/v1/lead                    # Get leads
POST /api/v1/lead                    # Create lead
PUT  /api/v1/lead/:id                # Update lead
DELETE /api/v1/lead/:id              # Delete lead
GET  /api/v1/lead-tag                # Get lead tags
```

### Calendar Endpoints
```
GET  /api/v1/calendar                # Get calendar events
POST /api/v1/calendar                # Create event
PUT  /api/v1/calendar/:id            # Update event
DELETE /api/v1/calendar/:id          # Delete event
```

---

## ⚙️ Configuration

### Next.js Configuration
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "185.126.203.246",
        port: "3000",
        pathname: "/public/file-storage/**",
      },
    ],
  },
};
```

### Tailwind Configuration
```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-iran-sans)"],
        "primary-medium": ["var(--font-iran-sans-medium)"],
        "primary-bold": ["var(--font-iran-sans-bold)"],
      },
      // ... custom theme extensions
    },
  },
};
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📊 Performance Considerations

### Optimization Strategies
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component lazy loading
- **Caching**: React Query caching strategy
- **Bundle Analysis**: Regular bundle size monitoring

### Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Error boundary implementation
- **User Analytics**: User behavior tracking
- **API Monitoring**: API response time monitoring

---

## 🔧 Maintenance & Updates

### Regular Maintenance Tasks
- **Dependency Updates**: Keep dependencies up to date
- **Security Patches**: Apply security updates
- **Performance Monitoring**: Monitor application performance
- **Code Quality**: Regular code reviews and refactoring

### Update Procedures
1. **Backup**: Create backup before updates
2. **Testing**: Test in development environment
3. **Staging**: Deploy to staging environment
4. **Production**: Deploy to production with monitoring

---

## 📞 Support & Documentation

### Development Resources
- **API Documentation**: Comprehensive API documentation
- **Component Library**: Storybook for component documentation
- **Code Comments**: Inline code documentation
- **README Files**: Module-specific documentation

### Troubleshooting
- **Common Issues**: Known issues and solutions
- **Debug Tools**: Development debugging tools
- **Logging**: Application logging strategy
- **Error Handling**: Comprehensive error handling

---

*This documentation provides a comprehensive overview of the CRM-Front project. For specific implementation details, refer to the source code and inline comments.*

