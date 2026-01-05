# Kit19 CRM - Frontend Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Component Hierarchy](#component-hierarchy)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Routing Structure](#routing-structure)
9. [Authentication & Authorization](#authentication--authorization)
10. [Performance Optimizations](#performance-optimizations)
11. [Error Handling](#error-handling)
12. [Accessibility](#accessibility)

---

## System Overview

Kit19 CRM is a production-ready, enterprise-level customer relationship management system designed for scalability and microservices architecture. The frontend is built as a Single Page Application (SPA) consuming RESTful APIs.

### Key Capabilities
- Handle 10,000+ records with server-side pagination
- Real-time updates without page reloads
- Role-based access control (RBAC)
- Offline-ready with intelligent caching
- Responsive design (mobile, tablet, desktop)

---

## Architecture Principles

### 1. **Separation of Concerns**
- **Presentation Layer:** React components (UI only)
- **Business Logic:** Custom hooks and utilities
- **Data Layer:** React Query + Axios
- **Configuration:** Centralized constants and endpoints

### 2. **Feature-Based Structure**
```
features/
├── enquiries/
│   ├── EnquiryList.jsx
│   ├── EnquiryDrawer.jsx
│   └── EnquiryDetail.jsx
├── leads/
│   ├── LeadList.jsx
│   ├── LeadDrawer.jsx
│   └── LeadDetail.jsx
```

### 3. **Component Composition**
- Atomic design pattern
- Reusable, single-responsibility components
- Props-based configuration
- Controlled vs Uncontrolled components

### 4. **Clean Code**
- SOLID principles
- DRY (Don't Repeat Yourself)
- Consistent naming conventions
- PropTypes or TypeScript for type safety

---

## Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 19 | UI library |
| **Language** | JavaScript (ES6+) | Programming language |
| **State Management** | React Query (TanStack) | Server state management |
| **HTTP Client** | Axios | API calls |
| **Routing** | React Router v6 | Client-side routing |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Icons** | React Icons | Icon library |
| **Forms** | React Hook Form (optional) | Form handling |
| **Notifications** | React Hot Toast | Toast notifications |
| **Date/Time** | date-fns | Date formatting |
| **Build Tool** | Create React App | Development server |

---

## Folder Structure

```
salesmodule/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Drawer.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── enquiries/           # Enquiry module
│   │   │   ├── EnquiryList.jsx
│   │   │   └── EnquiryDrawer.jsx
│   │   ├── leads/               # Lead module
│   │   │   ├── LeadList.jsx
│   │   │   └── LeadDrawer.jsx
│   │   └── ProtectedRoute.jsx   # Route guard
│   ├── pages/                   # Page-level components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── FollowupsList.jsx
│   │   ├── PipelinePage.jsx
│   │   ├── QuotationsList.jsx
│   │   └── RevenuePage.jsx
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.jsx
│   ├── hooks/                   # Custom hooks
│   │   └── useApi.js
│   ├── config/                  # Configuration files
│   │   ├── constants.js
│   │   └── apiEndpoints.js
│   ├── utils/                   # Utility functions
│   │   └── helpers.js
│   ├── App.jsx                  # Root component
│   ├── App.css                  # Global styles
│   ├── index.js                 # Entry point
│   └── index.css                # Tailwind imports
├── .env.example                 # Environment template
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── package.json
└── README.md
```

---

## Component Hierarchy

### Module Structure (Example: Enquiries)

```
EnquiryList (Page)
├── Card (Layout)
│   ├── Header (Actions: Refresh, Import, Export, Add)
│   ├── SearchBar (Input with icon)
│   ├── FilterPanel (Button)
│   ├── BulkActionBar (Conditional)
│   ├── Table
│   │   ├── TableHeader
│   │   │   ├── Checkbox (Select All)
│   │   │   └── Column Headers
│   │   └── TableBody
│   │       └── TableRow (per enquiry)
│   │           ├── Checkbox
│   │           ├── Data Cells
│   │           └── Action Buttons (View, Edit, Delete)
│   └── Pagination
└── EnquiryDrawer (Modal)
    ├── Form
    │   ├── Input fields
    │   ├── Select dropdowns
    │   └── Textarea
    └── Footer (Cancel, Submit buttons)
```

---

## State Management

### Strategy Overview

#### 1. **Server State** (React Query)
All data from APIs is managed by React Query:
- Automatic caching
- Background refetching
- Stale-while-revalidate pattern
- Optimistic updates

**Example:**
```javascript
const { data, isLoading, error } = useEnquiries(filters);
```

#### 2. **Global UI State** (Context API)
Cross-cutting concerns:
- Authentication (user, token)
- User permissions
- Theme preferences
- Notification settings

**Example:**
```javascript
const { user, isAuthenticated, hasPermission } = useAuth();
```

#### 3. **Local Component State** (useState)
Component-specific UI state:
- Form inputs
- Modal visibility
- Drawer open/close
- Selected items

**Example:**
```javascript
const [drawerOpen, setDrawerOpen] = useState(false);
```

### Data Flow

```
API Server → Axios → React Query → Component → UI
                ↓
            Cache Layer
                ↓
         Background Sync
```

---

## API Integration

### Axios Configuration

**Base Instance:** `axiosinstance.js`
```javascript
const axiosinstance = axios.create({
    baseURL: process.env.REACT_APP_KIT19_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
```

### API Endpoints Structure

Centralized in `config/apiEndpoints.js`:
```javascript
ENQUIRIES: {
  LIST: '/enquiries',
  CREATE: '/enquiries',
  GET: (id) => `/enquiries/${id}`,
  UPDATE: (id) => `/enquiries/${id}`,
  DELETE: (id) => `/enquiries/${id}`,
  CONVERT_TO_LEAD: (id) => `/enquiries/${id}/convert-to-lead`
}
```

### React Query Hooks

**Custom hooks in `hooks/useApi.js`:**
```javascript
export const useEnquiries = (filters = {}) => {
  return useQuery({
    queryKey: ['enquiries', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const response = await axiosinstance.get(`/enquiries?${params}`);
      return response.data;
    }
  });
};
```

### Error Handling

```javascript
export const useCreateEnquiry = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post('/enquiries', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['enquiries']);
      toast.success('Enquiry created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};
```

---

## Routing Structure

### Route Configuration

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />

  {/* Protected Routes */}
  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/enquiries" element={<EnquiryList />} />
    <Route path="/leads" element={<LeadList />} />
    <Route path="/leads/:id" element={<LeadDetail />} />
    <Route path="/followups" element={<FollowupsList />} />
    <Route path="/pipeline" element={<PipelinePage />} />
    <Route path="/quotations" element={<QuotationsList />} />
    <Route path="/revenue" element={<RevenuePage />} />
    {/* ... 12 more routes */}
  </Route>

  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

### Route Guards

**ProtectedRoute.jsx:**
```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
```

---

## Authentication & Authorization

### Authentication Flow

1. **Login:** POST `/auth/login` → Receive JWT token
2. **Store Token:** `localStorage.setItem('token', token)`
3. **Set Header:** `Authorization: Bearer <token>`
4. **Verify:** GET `/auth/me` on app load
5. **Logout:** Clear token, redirect to login

### Role-Based Access Control

**Roles:**
- Admin (all permissions)
- Manager (view all, edit assigned)
- SalesRep (own leads only)
- Viewer (read-only)

**Permission Check:**
```javascript
const { hasPermission } = useAuth();

{hasPermission('enquiry.create') && (
  <Button onClick={handleCreate}>Add Enquiry</Button>
)}
```

---

## Performance Optimizations

### 1. **Server-Side Pagination**
- Fetch only visible records
- Default: 25 items per page
- Options: 10, 25, 50, 100, 200

### 2. **React Query Caching**
- Stale time: 5 minutes
- Cache time: 10 minutes
- Background refetching

### 3. **Debounced Search**
```javascript
const debouncedSearch = debounce((value) => {
  setFilters({ ...filters, search: value });
}, 300);
```

### 4. **Code Splitting** (Future)
```javascript
const EnquiryList = lazy(() => import('./components/enquiries/EnquiryList'));
```

### 5. **Memoization**
```javascript
const MemoizedTable = React.memo(Table);
```

---

## Error Handling

### Centralized Error Handler

```javascript
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred'
  );
};
```

### Usage in Components

```javascript
try {
  await createEnquiry.mutateAsync(formData);
} catch (error) {
  toast.error(getErrorMessage(error));
}
```

### Error Boundaries (Future)
```javascript
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

---

## Accessibility

### Best Practices

1. **Semantic HTML:** Use proper tags (`<button>`, `<nav>`, `<main>`)
2. **Keyboard Navigation:** All interactive elements focusable
3. **ARIA Labels:** Screen reader support
4. **Color Contrast:** WCAG AA compliance
5. **Focus Indicators:** Visible focus states

### Example
```javascript
<button
  aria-label="Delete enquiry"
  title="Delete"
  onClick={handleDelete}
>
  <FiTrash2 />
</button>
```

---

## API Contract Examples

### Enquiries API

#### GET /enquiries
**Request:**
```
GET /api/enquiries?page=1&pageSize=25&search=john
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "personName": "John Doe",
      "countryCode": "+91",
      "mobile": "9876543210",
      "email": "john@example.com",
      "source": "Website",
      "type": "Open",
      "createdAt": "2025-12-15T10:30:00Z"
    }
  ],
  "page": 1,
  "pageSize": 25,
  "totalItems": 150,
  "totalPages": 6
}
```

#### POST /enquiries
**Request:**
```json
{
  "personName": "Jane Smith",
  "countryCode": "+91",
  "mobile": "9876543211",
  "email": "jane@example.com",
  "source": "Referral",
  "type": "Open"
}
```

**Response:**
```json
{
  "id": 2,
  "personName": "Jane Smith",
  ...
  "createdAt": "2025-12-16T12:00:00Z"
}
```

---

## Deployment Checklist

- [ ] Set production API URL in `.env`
- [ ] Enable production build optimizations
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry)
- [ ] Enable HTTPS
- [ ] Configure CORS on backend
- [ ] Add service worker for offline support
- [ ] Optimize bundle size
- [ ] Enable gzip compression
- [ ] Set cache headers

---

## Future Enhancements

1. **TypeScript Migration:** Add type safety
2. **Unit Tests:** Jest + React Testing Library
3. **E2E Tests:** Cypress or Playwright
4. **PWA Support:** Offline functionality
5. **Real-time Updates:** WebSockets
6. **Advanced Analytics:** Charts and dashboards
7. **Export Scheduler:** Background jobs
8. **Email Templates:** WYSIWYG editor
9. **Mobile App:** React Native version
10. **Multi-language Support:** i18n

---

## Contact & Support

**Development Team:** Kit19 CRM Frontend Team  
**Documentation:** This file  
**API Documentation:** Separate backend docs  
**Support:** support@kit19crm.com
