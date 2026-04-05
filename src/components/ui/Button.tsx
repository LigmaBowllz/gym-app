// Button Component
'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '',
  icon,
  ...props 
}: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    ghost: 'btn-ghost',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px] rounded-lg',
    md: 'px-6 py-3 text-base min-h-[44px] rounded-xl',
    lg: 'px-8 py-4 text-lg min-h-[52px] rounded-xl',
  };

  return (
    <button 
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`} 
      {...props}
    >
      {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
