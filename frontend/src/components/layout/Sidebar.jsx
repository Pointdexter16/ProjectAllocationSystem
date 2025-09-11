import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Building2,
  CheckSquare,
  Clock
} from 'lucide-react';
import Button from '../ui/Button';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    // { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    // { icon: Calendar, label: 'Calendar', path: '/calendar' },
    // { icon: Building2, label: 'Capacity', path: '/capacity' },
    // { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const employeeNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: FolderOpen, label: 'My Projects', path: '/my-projects' },
    // { icon: Calendar, label: 'Schedule', path: '/schedule' },
    // { icon: Clock, label: 'Timesheet', path: '/timesheet' },
    { icon: Settings, label: 'Profile', path: '/profile' }
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div className="sidebar-logo-text">
              <h1>PAS</h1>
              <p>Project Allocation</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
              >
                <item.icon style={{ width: '20px', height: '20px' }} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="sidebar-user">
            <div className="sidebar-user-info">
              <div className="sidebar-user-avatar">
                <span>
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="sidebar-user-details">
                <p className="sidebar-user-name">
                  {user?.name}
                </p>
                <p className="sidebar-user-role">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
              style={{ justifyContent: 'flex-start' }}
            >
              <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
