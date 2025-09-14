import React, { Suspense} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EmployeeProvider } from './contexts/EmployeeContext';
import './styles/globals.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './components/dashboard/AdminDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import ProjectsManagement from './components/projects/ProjectsManagement';
import EmployeesManagement from './components/employees/EmployeesManagement';
import CapacityDashboard from './components/capacity/CapacityDashboard';


// Dashboard Router Component
const DashboardRouter = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading || !isAuthenticated) {
    return <div className="loading-spinner">Loading...</div>; // or a skeleton/spinner
  }

  console.log("🧠 User in DashboardRouter:", user);

  if (user?.role === 'manager') {
    return <AdminDashboard />;
  } else if (user?.role === 'employee') {
    return <EmployeeDashboard />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

// Placeholder components for routes
const EmployeesPage = () => {
  return (
    <React.Suspense fallback={<div className="loading-spinner">Loading...</div>}>
      <EmployeesManagement />
    </React.Suspense>
  );
};

const ProjectsPage = () => {
  return (
    <React.Suspense fallback={<div className="loading-spinner">Loading...</div>}>
      <ProjectsManagement />
    </React.Suspense>
  );
};

const CapacityPage = () => {
  return (
    <React.Suspense fallback={<div className="loading-spinner">Loading...</div>}>
      <CapacityDashboard />
    </React.Suspense>
  );
};

const TasksPage = () => (
  <div className="p-6">
    <h1 className="page-title">Task Management</h1>
    <p className="page-description">Task management functionality will be implemented here.</p>
  </div>
);

const CalendarPage = () => (
  <div className="p-6">
    <h1 className="page-title">Calendar</h1>
    <p className="page-description">Calendar functionality will be implemented here.</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="p-6">
    <h1 className="page-title">Analytics</h1>
    <p className="page-description">Analytics functionality will be implemented here.</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <h1 className="page-title">Settings</h1>
    <p className="page-description">Settings functionality will be implemented here.</p>
  </div>
);

const MyTasksPage = () => (
  <div className="p-6">
    <h1 className="page-title">My Tasks</h1>
    <p className="page-description">Employee task management functionality will be implemented here.</p>
  </div>
);

const MyProjectsPage = () => (
  <div className="p-6">
    <h1 className="page-title">My Projects</h1>
    <p className="page-description">Employee project view functionality will be implemented here.</p>
  </div>
);

const SchedulePage = () => (
  <div className="p-6">
    <h1 className="page-title">Schedule</h1>
    <p className="page-description">Employee schedule functionality will be implemented here.</p>
  </div>
);

const TimesheetPage = () => (
  <div className="p-6">
    <h1 className="page-title">Timesheet</h1>
    <p className="page-description">Employee timesheet functionality will be implemented here.</p>
  </div>
);

const ProfilePage = () => (
  <div className="p-6">
    <h1 className="page-title">Profile</h1>
    <p className="page-description">Employee profile functionality will be implemented here.</p>
  </div>
);

const UnauthorizedPage = () => (
  <div className="error-page">
    <div className="error-content">
      <h1 className="error-code">403</h1>
      <p className="error-title">Unauthorized Access</p>
      <p className="error-description">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()}
        className="btn btn-primary"
      >
        Go Back
      </button>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="error-page">
    <div className="error-content">
      <h1 className="error-code">404</h1>
      <p className="error-title">Page Not Found</p>
      <p className="error-description">The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => window.history.back()}
        className="btn btn-primary"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard - role-based routing */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardRouter />} />
              
              {/* Admin Routes */}
              {/* <Route path="my-tasks" element={
                <ProtectedRoute requiredRole="manager">
                  <MyTasksPage />
                </ProtectedRoute>
              } /> */}
              {/* <Route path="my-projects" element={
                <ProtectedRoute requiredRole="manager">
                  <MyProjectsPage />
                </ProtectedRoute>
              } /> */}

              <Route path="profile" element={
                <ProtectedRoute requiredRole="manager">
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="my-tasks" element={
                <ProtectedRoute requiredRole="manager">
                  <EmployeesPage />
                </ProtectedRoute>
              } />
              <Route path="my-projects" element={
                <ProtectedRoute requiredRole="manager">
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="my-tasks" element={
                <ProtectedRoute requiredRole="manager">
                  <TasksPage />
                </ProtectedRoute>
              } />
              <Route path="calendar" element={
                <ProtectedRoute requiredRole="manager">
                  <CalendarPage />
                </ProtectedRoute>
              } />
              <Route path="capacity" element={
                <ProtectedRoute requiredRole="manager">
                  <CapacityPage />
                </ProtectedRoute>
              } />
              <Route path="analytics" element={
                <ProtectedRoute requiredRole="manager">
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requiredRole="manager">
                  <SettingsPage />
                </ProtectedRoute>
              } />
               
              {/* Employee Routes */}
              
              {/* <Route path="schedule" element={
                <ProtectedRoute requiredRole="manager">
                  <SchedulePage />
                </ProtectedRoute>
              } />
              <Route path="timesheet" element={
                <ProtectedRoute requiredRole="manager">
                  <TimesheetPage />
                </ProtectedRoute>
              } /> */}
              
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

const AppWithProviders = () => {
  return (
    <EmployeeProvider>
      <App />
    </EmployeeProvider>
  );
};

export default AppWithProviders;
