import React from 'react';

const Button = React.forwardRef(({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled,
  loading,
  ...props 
}, ref) => {
  const getButtonClasses = () => {
    let classes = 'btn';
    
    // Add variant classes
    switch (variant) {
      case 'primary':
        classes += ' btn-primary';
        break;
      case 'secondary':
        classes += ' btn-secondary';
        break;
      case 'success':
        classes += ' btn-success';
        break;
      case 'warning':
        classes += ' btn-warning';
        break;
      case 'danger':
        classes += ' btn-danger';
        break;
      case 'outline':
        classes += ' btn-outline';
        break;
      default:
        classes += ' btn-primary';
    }
    
    // Add size classes
    switch (size) {
      case 'sm':
        classes += ' btn-sm';
        break;
      case 'lg':
        classes += ' btn-lg';
        break;
      default:
        // md is default, no additional class needed
        break;
    }
    
    // Add additional classes
    if (loading) classes += ' cursor-not-allowed';
    if (className) classes += ' ' + className;
    
    return classes;
  };

  return (
    <button
      className={getButtonClasses()}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <svg className="animate-spin" style={{ marginLeft: '-4px', marginRight: '8px', width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
