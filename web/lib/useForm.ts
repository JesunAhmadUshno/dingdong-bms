/**
 * Custom form hooks for handling form state and validation
 */

import { useState, useCallback } from 'react';
import { ZodSchema } from 'zod';

export interface FormErrors {
  [key: string]: string;
}

export interface FormValues {
  [key: string]: any;
}

interface UseFormOptions {
  initialValues: FormValues;
  validationSchema?: ZodSchema;
  onSubmit?: (values: FormValues) => Promise<void>;
}

/**
 * Custom hook for managing form state with validation
 */
export function useForm(options: UseFormOptions) {
  const { initialValues, validationSchema, onSubmit } = options;

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(
    async (valuesToValidate: FormValues = values): Promise<boolean> => {
      if (!validationSchema) return true;

      try {
        await validationSchema.parseAsync(valuesToValidate);
        setErrors({});
        return true;
      } catch (error: any) {
        const newErrors: FormErrors = {};
        if (error.issues) {
          error.issues.forEach((issue: any) => {
            const path = issue.path.join('.');
            newErrors[path] = issue.message;
          });
        }
        setErrors(newErrors);
        return false;
      }
    },
    [validationSchema, values]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: inputValue,
      }));

      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const isValid = await validateForm(values);
      if (!isValid) return;

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    clearErrors,
    validateForm,
  };
}

/**
 * Custom hook for field object (for spreading on inputs)
 */
export function useField(name: string, form: ReturnType<typeof useForm>) {
  return {
    name,
    value: form.values[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
    'aria-invalid': !!form.errors[name],
    'aria-describedby': form.errors[name] ? `${name}-error` : undefined,
  };
}

/**
 * Hook for async field validation
 */
export function useAsyncValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(
    async (value: any, validator: (value: any) => Promise<boolean>) => {
      setIsValidating(true);
      try {
        const result = await validator(value);
        return result;
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  return { validate, isValidating };
}

export default useForm;
