
import { useState, useCallback, useEffect } from 'react';
import { validateForm } from '../utils/validation';
import { logger } from '../utils/logger';

/**
 * Custom hook for form handling with validation
 * 
 * @param {Object} options - Hook options
 * @param {Object} [options.initialValues={}] - Initial form values
 * @param {Object} [options.validationSchema={}] - Validation schema
 * @param {Function} [options.onSubmit] - Form submission handler
 * @param {boolean} [options.validateOnChange=true] - Whether to validate on field change
 * @param {boolean} [options.validateOnBlur=true] - Whether to validate on field blur
 * @param {boolean} [options.validateOnMount=false] - Whether to validate when the component mounts
 * @returns {Object} Form state and handlers
 */
export function useForm({
  initialValues = {},
  validationSchema = {},
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnMount = false,
}) {
  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Check if the form is valid
  const isValid = Object.keys(errors).length === 0;

  // Run validation on initial mount if enabled
  useEffect(() => {
    if (validateOnMount && Object.keys(validationSchema).length > 0) {
      const { isValid, errors: validationErrors } = validateForm(values, validationSchema);
      if (!isValid) {
        setErrors(validationErrors);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate form values
  const validate = useCallback((formValues = values) => {
    if (Object.keys(validationSchema).length === 0) {
      return { isValid: true, errors: {} };
    }

    const result = validateForm(formValues, validationSchema);
    setErrors(result.errors);
    return result;
  }, [validationSchema, values]);

  // Reset form to initial state or new values
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set a single form value
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Validate the field if validateOnChange is enabled
    if (validateOnChange) {
      const updatedValues = { ...values, [name]: value };
      validate(updatedValues);
    }
  }, [validate, validateOnChange, values]);

  // Handle field change from input elements
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFieldValue(name, fieldValue);
  }, [setFieldValue]);

  // Set a field as touched (usually on blur)
  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate the field if validateOnBlur is enabled
    if (validateOnBlur) {
      validate();
    }
  }, [validate, validateOnBlur]);

  // Handle field blur event
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setFieldTouched(name);
  }, [setFieldTouched]);

  // Submit the form
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Increment submit count
    setSubmitCount(prev => prev + 1);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate the form
    const { isValid } = validate();

    if (!isValid) {
      return;
    }

    // Submit the form if onSubmit is provided
    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        logger.error('Form submission error', { error });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [onSubmit, validate, values]);

  // Check if a field has an error and has been touched
  const hasError = useCallback((name) => {
    return touched[name] && errors[name];
  }, [errors, touched]);

  // Get error message for a field
  const getError = useCallback((name) => {
    return hasError(name) ? errors[name] : '';
  }, [errors, hasError]);

  // Return form state and handlers
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submitCount,

    // Methods
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
    validate,

    // Helpers
    hasError,
    getError,
  };
}
