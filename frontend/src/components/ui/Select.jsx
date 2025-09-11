import React from 'react';

const Select = React.forwardRef(({ 
  className = '', 
  children, 
  label,
  error,
  helperText,
  required,
  ...props 
}, ref) => {
  const id = props.id || props.name;

  const getSelectClasses = () => {
    let classes = 'input';
    if (error) classes += ' input-error';
    if (className) classes += ' ' + className;
    return classes;
  };

  const getLabelClasses = () => {
    let classes = 'label';
    if (required) classes += ' label-required';
    return classes;
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className={getLabelClasses()}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={getSelectClasses()}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="input-error-text">{error}</p>
      )}
      {helperText && !error && (
        <p className="input-helper-text">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
