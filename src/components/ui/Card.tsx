// Card Component
'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'outlined' | 'glow';
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ 
  children, 
  className = '',
  variant = 'default',
  onClick,
  hoverable = true,
}: CardProps) {
  const variantClasses = {
    default: 'card',
    gradient: 'card gradient-card',
    outlined: 'card border-2',
    glow: 'card card-glow',
  };

  const hoverClass = hoverable ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${variantClasses[variant]} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
