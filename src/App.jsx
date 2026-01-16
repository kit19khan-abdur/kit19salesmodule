import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ConfigProvider } from 'antd';
import { antdTheme } from './antd-config';
import 'antd/dist/reset.css';
import Task from './pages/Task/Task';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import {Enquiries, Login} from './pages';
import Dashboard from './pages/Dashboard';
import PipelinePage from './pages/PipelinePage';
import Leads from './pages/Lead/Leads/Leads';
import FollowUpPage from './pages/FollowUp/FollowUpPage';
import MergeDuplicate from './pages/MergeDuplicate/MergeDuplicate';
import Conversion from './pages/Conversion/Conversion';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Public route wrapper
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('Token') !== null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('Token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
           <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/followups" element={<FollowUpPage />} />
        <Route path="/merge" element={<MergeDuplicate />} />
        <Route path="/conversions" element={<Conversion />} />
        <Route path="/call-list" element={<div className="text-2xl font-bold">Call List</div>} />
        <Route path="/tasks" element={<Task />} />
        <Route path="/appointments" element={<div className="text-2xl font-bold">Appointments</div>} />
        <Route path="/physical-appointments" element={<div className="text-2xl font-bold">Physical Appointments</div>} />
        <Route path="/activities" element={<div className="text-2xl font-bold">Lead Activities</div>} />
        <Route path="/custom-events" element={<div className="text-2xl font-bold">Custom Events</div>} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/pipeline-history" element={<div className="text-2xl font-bold">Pipeline History</div>} />
        <Route path="/quotations" element={<div className="text-2xl font-bold">Quotations</div>} />
        <Route path="/invoices" element={<div className="text-2xl font-bold">Invoices</div>} />
        <Route path="/revenue" element={<div className="text-2xl font-bold">Revenue</div>} />
        <Route path="/credit-notes" element={<div className="text-2xl font-bold">Credit Notes</div>} />
        <Route path="/ledger" element={<div className="text-2xl font-bold">Customer Ledger</div>} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ConfigProvider theme={antdTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
        {/* React Query Devtools removed to avoid overlay in the app UI */}
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;  