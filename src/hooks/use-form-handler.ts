'use client';

import { useState, useCallback } from 'react';
import { useForm, UseFormReturn, FieldValues, Path, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Logger } from '@/lib/logger';

interface UseFormHandlerOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseFormHandlerReturn<T extends FieldValues> extends UseFormReturn<T> {
  isSubmitting: boolean;
  handleSubmit: (data: T) => Promise<void>;
  resetForm: () => void;
  setFieldError: (field: Path<T>, message: string) => void;
  clearFieldError: (field: Path<T>) => void;
}

export function useFormHandler<T extends FieldValues>({
  schema,
  onSubmit,
  onError,
  successMessage = 'Form submitted successfully!',
  errorMessage = 'An error occurred while submitting the form.',
  ...formOptions
}: UseFormHandlerOptions<T>): UseFormHandlerReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...formOptions,
  });

  const handleSubmit = useCallback(async (data: T) => {
    try {
      setIsSubmitting(true);
      Logger.debug('Form submission started', { formData: data });
      
      await onSubmit(data);
      
      toast({
        title: 'Success',
        description: successMessage,
        variant: 'default',
      });
      
      Logger.info('Form submitted successfully', { formData: data });
      
      // Reset form after successful submission
      form.reset();
      
    } catch (error) {
      Logger.error('Form submission failed', error, { formData: data });
      
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, onError, successMessage, errorMessage, toast, form]);

  const resetForm = useCallback(() => {
    form.reset();
    Logger.debug('Form reset');
  }, [form]);

  const setFieldError = useCallback((field: Path<T>, message: string) => {
    form.setError(field, {
      type: 'manual',
      message,
    });
    Logger.debug('Field error set', { field, message });
  }, [form]);

  const clearFieldError = useCallback((field: Path<T>) => {
    form.clearErrors(field);
    Logger.debug('Field error cleared', { field });
  }, [form]);

  return {
    ...form,
    isSubmitting,
    handleSubmit,
    resetForm,
    setFieldError,
    clearFieldError,
  };
}

// Specialized hooks for specific form types
export function useVenueForm(onSubmit: (data: any) => Promise<void> | void) {
  return useFormHandler({
    schema: {} as any, // Import from form-schemas when available
    onSubmit,
    successMessage: 'Venue information saved successfully!',
    errorMessage: 'Failed to save venue information.',
  });
}

export function useCateringForm(onSubmit: (data: any) => Promise<void> | void) {
  return useFormHandler({
    schema: {} as any, // Import from form-schemas when available
    onSubmit,
    successMessage: 'Catering service information saved successfully!',
    errorMessage: 'Failed to save catering service information.',
  });
}

// Utility function to validate form data
export function validateFormData<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Utility function to get field error message
export function getFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  field: Path<T>
): string | undefined {
  return form.formState.errors[field]?.message;
}

// Utility function to check if form is valid
export function isFormValid<T extends FieldValues>(form: UseFormReturn<T>): boolean {
  return form.formState.isValid && Object.keys(form.formState.errors).length === 0;
}

// Utility function to get form submission state
export function getFormState<T extends FieldValues>(form: UseFormReturn<T>) {
  return {
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    isSubmitted: form.formState.isSubmitted,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    errors: form.formState.errors,
    touchedFields: form.formState.touchedFields,
  };
}
