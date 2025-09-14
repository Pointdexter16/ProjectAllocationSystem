import React from 'react';

const Card = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`card-header ${className}`}
      {...props}
    >
  {children}
    </div>
  );
};

const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3
      className={`card-title ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className = '', children, ...props }) => {
  return (
    <p
      className={`card-description ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`card-footer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
