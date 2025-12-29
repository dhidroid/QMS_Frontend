import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(clsx(
      "rounded-xl border bg-card text-card-foreground shadow-sm bg-white",
      className
    ))}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(clsx("flex flex-col space-y-1.5 p-6", className))}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={twMerge(clsx("font-semibold leading-none tracking-tight", className))}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge(clsx("p-6 pt-0", className))} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(clsx("flex items-center p-6 pt-0", className))}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardContent };
