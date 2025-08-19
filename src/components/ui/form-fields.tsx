'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Common form field props interface
interface BaseFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Text input field
export function TextField({ name, label, placeholder, required, className }: BaseFieldProps) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Email input field
export function EmailField({ name, label, placeholder, required, className }: BaseFieldProps) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <Input type="email" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Phone input field
export function PhoneField({ name, label, placeholder, required, className }: BaseFieldProps) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <Input type="tel" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Number input field
export function NumberField({ name, label, placeholder, required, className, min, max }: BaseFieldProps & { min?: number; max?: number }) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder={placeholder} 
              min={min}
              max={max}
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Textarea field
export function TextareaField({ name, label, placeholder, required, className, rows = 3 }: BaseFieldProps & { rows?: number }) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} rows={rows} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Checkbox field
export function CheckboxField({ name, label, required, className }: BaseFieldProps) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-2 space-y-0", className)}>
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange} 
            />
          </FormControl>
          <FormLabel className="font-normal">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Checkbox group field
export function CheckboxGroupField({ 
  name, 
  label, 
  options, 
  required, 
  className,
  columns = 3 
}: BaseFieldProps & { 
  options: string[]; 
  columns?: number;
}) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <div className={cn("grid gap-2", `grid-cols-2 md:grid-cols-${columns}`)}>
            {options.map((option) => (
              <FormField
                key={option}
                control={control}
                name={`${name}.${option}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{option}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Radio group field
export function RadioGroupField({ 
  name, 
  label, 
  options, 
  required, 
  className 
}: BaseFieldProps & { 
  options: { value: string; label: string }[]; 
}) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Select field
export function SelectField({ 
  name, 
  label, 
  options, 
  required, 
  className,
  placeholder = "Select an option"
}: BaseFieldProps & { 
  options: { value: string; label: string }[]; 
  placeholder?: string;
}) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Currency input field
export function CurrencyField({ name, label, placeholder, required, className, min = 0 }: BaseFieldProps & { min?: number }) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input 
                type="number" 
                placeholder={placeholder} 
                min={min}
                className="pl-8"
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
