'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Form section wrapper
interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Form row for side-by-side fields
interface FormRowProps {
  children: ReactNode;
  className?: string;
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {children}
    </div>
  );
}

// Form grid for multiple columns
interface FormGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

// Form divider
interface FormDividerProps {
  className?: string;
}

export function FormDivider({ className }: FormDividerProps) {
  return (
    <div className={cn("border-t border-border my-6", className)} />
  );
}

// Form actions container
interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3 pt-6 border-t border-border", className)}>
      {children}
    </div>
  );
}

// Form field group
interface FormFieldGroupProps {
  label: string;
  description?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export function FormFieldGroup({ label, description, children, required, className }: FormFieldGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Form help text
interface FormHelpTextProps {
  children: ReactNode;
  className?: string;
}

export function FormHelpText({ children, className }: FormHelpTextProps) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </p>
  );
}

// Form error display
interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <p className={cn("text-xs text-red-500", className)}>
      {error}
    </p>
  );
}

// Form success message
interface FormSuccessProps {
  message: string;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  return (
    <p className={cn("text-xs text-green-600", className)}>
      {message}
    </p>
  );
}
