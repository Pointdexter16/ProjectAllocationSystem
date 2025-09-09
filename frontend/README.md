# Project Allocation System - Frontend

A comprehensive React.js frontend application for managing employee project allocations, task assignments, and resource planning in corporate environments.

## 🚀 Features

### Admin Dashboard
- **Employee Management**: CRUD operations for employee profiles with skills, teams, and bandwidth tracking
- **Project Management**: Create and manage projects with phases, deadlines, and team assignments
- **Resource Allocation**: Intelligent allocation engine to prevent over-allocation based on employee bandwidth
- **Analytics & Reporting**: Visual dashboards showing workload distribution, project progress, and team utilization
- **Gantt Charts**: Interactive project timelines with task dependencies and progress tracking
- **Calendar View**: Comprehensive scheduling and deadline management

### Employee Dashboard
- **Task Management**: View and update assigned tasks with status tracking
- **Personal Workload**: Track individual bandwidth and remaining availability
- **Project Overview**: View assigned projects and progress
- **Time Tracking**: Log work hours and manage timesheets
- **Schedule Management**: Personal calendar with deadlines and meetings

## 🛠 Tech Stack

- **React 19.1.1** - Modern React with latest features
- **React Router 6.26.0** - Client-side routing
- **Tailwind CSS 3.4.7** - Utility-first CSS framework
- **Vite 7.1.2** - Fast build tool and dev server
- **Recharts 2.12.7** - Data visualization and charts
- **React Big Calendar 1.13.1** - Calendar component
- **Gantt Task React 0.3.9** - Gantt chart functionality
- **Lucide React 0.427.0** - Modern icon library
- **React Hook Form 7.52.1** - Form management
- **React Hot Toast 2.4.1** - Toast notifications
- **Framer Motion 11.3.19** - Animations
- **Axios 1.7.2** - HTTP client

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🔐 Authentication

The application includes a mock authentication system with two demo accounts:

### Admin Account
- **Email**: `admin@company.com`
- **Password**: `admin123`
- **Access**: Full system access including employee management, project creation, and analytics

### Employee Account
- **Email**: `employee@company.com`
- **Password**: `emp123`
- **Access**: Personal dashboard, task management, and project viewing

## 🏗 Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── Login.jsx
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/            # Dashboard components
│   │   ├── AdminDashboard.jsx
│   │   └── EmployeeDashboard.jsx
│   ├── layout/               # Layout components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Select.jsx
│   │   └── Badge.jsx
│   ├── charts/               # Chart components
│   │   └── GanttChart.jsx
│   └── calendar/             # Calendar components
│       └── CalendarView.jsx
├── contexts/                 # React contexts
│   └── AuthContext.jsx
├── App.jsx                   # Main app component
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## 🎨 Design System

The application uses a comprehensive design system built with Tailwind CSS:

- **Color Palette**: Primary (Blue), Secondary (Gray), Success (Green), Warning (Orange), Danger (Red)
- **Typography**: Inter font family with consistent sizing
- **Components**: Reusable UI components with consistent styling
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Key Components

### Authentication System
- JWT-based authentication (mock implementation)
- Role-based access control (Admin/Employee)
- Protected routes with automatic redirects

### Dashboard Analytics
- Real-time statistics and KPIs
- Interactive charts and visualizations
- Workload distribution analysis
- Project progress tracking

### Task Management
- Kanban-style task boards
- Status tracking (Pending, In Progress, Completed)
- Priority management (High, Medium, Low)
- Time estimation and logging

### Resource Planning
- Employee bandwidth tracking
- Automatic over-allocation prevention
- Team capacity management
- Skill-based assignment recommendations

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open http://localhost:5173 in your browser
5. Use the demo credentials to log in and explore the features

## 🔮 Future Enhancements

- Real backend API integration
- Advanced reporting and analytics
- Mobile application
- Real-time notifications
- Integration with external tools (Slack, JIRA, etc.)
- Advanced project templates
- Resource forecasting and planning

## 📝 Notes

This is the frontend-only implementation. For full functionality, integrate with:
- Node.js backend for core business logic
- Python Flask APIs for analytics and reporting
- PostgreSQL database for data persistence

The current implementation includes mock data and simulated API calls for demonstration purposes.
