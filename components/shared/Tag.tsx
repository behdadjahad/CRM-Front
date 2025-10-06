"use client";

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagProps {
  // Content
  children?: React.ReactNode;
  text?: string; // Alternative to children
  
  // Visual variants
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'hot' | 'warm' | 'cold';
  size?: 'sm' | 'md' | 'lg';
  
  // Interactive features
  closable?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  
  // Customization
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  
  // Accessibility
  'aria-label'?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  text,
  variant = 'default',
  size = 'md',
  closable = false,
  onClose,
  onClick,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  'aria-label': ariaLabel,
}) => {
  // Get the display text
  const displayText = text || children;

  // Don't render if no content
  if (!displayText) return null;

  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-gray-100 text-gray-600 border-gray-300',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    hot: 'bg-red-100 text-red-800 border-red-200',
    warm: 'bg-orange-100 text-orange-800 border-orange-200',
    cold: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  // Close button styles
  const closeButtonStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const closeIconStyles = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-1 rounded-full border font-medium transition-colors duration-200';

  // Interactive styles
  const interactiveStyles = onClick && !disabled 
    ? 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1' 
    : '';

  // Disabled styles
  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  // Combine all styles
  const combinedStyles = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    interactiveStyles,
    disabledStyles,
    className
  );

  // Handle click
  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  // Handle close
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose && !disabled) {
      onClose();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    if (e.key === 'Escape' && closable && onClose) {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <span
      className={combinedStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick && !disabled ? 0 : -1}
      role={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {/* Left icon */}
      {icon && iconPosition === 'left' && (
        <span className="flex items-center justify-center">
          {icon}
        </span>
      )}

      {/* Content */}
      <span className="flex-1 whitespace-nowrap">
        {displayText}
      </span>

      {/* Right icon */}
      {icon && iconPosition === 'right' && (
        <span className="flex items-center justify-center">
          {icon}
        </span>
      )}

      {/* Close button */}
      {closable && onClose && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            'flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-10 transition-colors duration-200',
            closeButtonStyles[size]
          )}
          aria-label="Remove tag"
          disabled={disabled}
        >
          <X className={cn('text-current', closeIconStyles[size])} />
        </button>
      )}
    </span>
  );
};

export default Tag;

