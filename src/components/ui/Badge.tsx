'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
}

const variants = {
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
};

export default function Badge({ children, variant = 'blue', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${variants[variant]}`}>
      {children}
    </span>
  );
}
