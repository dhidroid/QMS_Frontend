import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground",
    destructive: "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
    success: "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
    warning: "border-transparent bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
    neutral: "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200",
  };

  return (
    <div className={twMerge(clsx(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variants[variant],
      className
    ))} {...props}>
      {children}
    </div>
  );
};

export default Badge;
