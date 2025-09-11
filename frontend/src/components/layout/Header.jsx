import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        {/* Left side - Menu button and search */}
        <div className="header-left">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="header-menu-btn"
          >
            <Menu style={{ width: '20px', height: '20px' }} />
          </Button>
          
          <div className="header-search">
            <Search style={{ width: '16px', height: '16px' }} />
            <input
              type="text"
              placeholder="Search projects, tasks, employees..."
              className="header-search-input"
            />
          </div>
        </div>

        {/* Right side - Notifications and user */}
        <div className="header-right">
          {/* <Button variant="ghost" size="sm" className="header-notification-btn">
            <Bell style={{ width: '20px', height: '20px' }} />
            <span className="notification-badge">
              3
            </span>
          </Button> */}
          
          <div className="header-user">
            <div className="header-user-avatar">
              <User style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="header-user-info">
              <p className="header-user-name">{user?.name}</p>
              <p className="header-user-role">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
