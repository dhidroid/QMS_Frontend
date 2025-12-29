import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Button Component
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg' | 'icon'} [props.size='md']
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {(e: React.MouseEvent) => void} [props.onClick]
 * @param {boolean} [props.disabled]
 * @param {'button' | 'submit' | 'reset'} [props.type='button']
 */
const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled,
  type = 'button',
  ...props 
}, ref) => {
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8",
    icon: "h-10 w-10 p-2 flex items-center justify-center", // for icon buttons
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={twMerge(clsx(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        variants[variant],
        sizes[size],
        className
      ))}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
