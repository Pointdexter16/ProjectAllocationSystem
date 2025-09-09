import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  size = 'md'
}) => {
  if (!isOpen) return null;

  const getModalClasses = () => {
    let classes = 'modal-content';
    
    switch (size) {
      case 'sm':
        classes += ' modal-sm';
        break;
      case 'md':
        classes += ' modal-md';
        break;
      case 'lg':
        classes += ' modal-lg';
        break;
      case 'xl':
        classes += ' modal-xl';
        break;
      default:
        classes += ' modal-md';
    }
    
    if (className) classes += ' ' + className;
    return classes;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Backdrop */}
        <div 
          className="modal-backdrop"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={getModalClasses()}>
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title">
              {title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="modal-close-btn"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </Button>
          </div>
          
          {/* Content */}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
