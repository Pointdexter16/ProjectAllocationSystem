import React from 'react';

const Badge = ({ 
  className = '', 
  variant = 'default', 
  children, 
  ...props 
}) => {
  const getBadgeClasses = () => {
    let classes = 'badge';
    
    switch (variant) {
      case 'default':
        classes += ' badge-default';
        break;
      case 'success':
        classes += ' badge-success';
        break;
      case 'warning':
        classes += ' badge-warning';
        break;
      case 'danger':
        classes += ' badge-danger';
        break;
      case 'secondary':
        classes += ' badge-secondary';
        break;
      default:
        classes += ' badge-default';
    }
    
    if (className) classes += ' ' + className;
    return classes;
  };

  return (
    <span
      className={getBadgeClasses()}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
