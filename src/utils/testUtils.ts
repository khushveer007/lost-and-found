/**
 * Test utilities for the application
 * These functions help validate code quality and component behavior
 */

/**
 * Validates if a component is properly handling loading states
 * @param component The component to test
 * @param loadingProp The prop name for loading state
 */
export function validateLoadingState(component: any, loadingProp: string = 'isLoading'): boolean {
  // Check if component properly uses loading prop 
  if (!component.hasOwnProperty(loadingProp)) {
    console.warn(`Component doesn't handle ${loadingProp} prop properly`);
    return false;
  }
  return true;
}

/**
 * Validates element accessibility 
 * @param element The DOM element to check
 * @returns Object with validation results
 */
export function validateAccessibility(element: HTMLElement): { 
  hasAria: boolean;
  hasTabIndex: boolean;
  hasLabel: boolean;
  valid: boolean;
} {
  const hasAria = element.hasAttribute('aria-label') || 
    element.hasAttribute('aria-labelledby') ||
    element.hasAttribute('aria-describedby');
    
  const hasTabIndex = element.hasAttribute('tabindex');
  
  // Check if element has label (for inputs)
  const hasLabel = element instanceof HTMLInputElement && 
    !!document.querySelector(`label[for="${element.id}"]`);
  
  return {
    hasAria,
    hasTabIndex,
    hasLabel,
    valid: hasAria || hasLabel
  };
}

/**
 * Validates form input fields
 * @param formData The form data object
 * @param rules Validation rules object
 * @returns Object with error messages
 */
export function validateForm<T extends Record<string, any>>(
  formData: T, 
  rules: Record<keyof T, Array<(value: any) => string | null>>
): Record<keyof T, string | null> {
  const errors: Partial<Record<keyof T, string | null>> = {};
  
  // Apply each validation rule to its field
  Object.keys(rules).forEach((key) => {
    const fieldKey = key as keyof T;
    const fieldRules = rules[fieldKey];
    
    // Apply all rules and find first error (if any)
    for (const rule of fieldRules) {
      const error = rule(formData[fieldKey]);
      if (error) {
        errors[fieldKey] = error;
        break;
      }
    }
    
    // If no error found, set to null
    if (!errors[fieldKey]) {
      errors[fieldKey] = null;
    }
  });
  
  return errors as Record<keyof T, string | null>;
}

// Common validation rules
export const validationRules = {
  required: (message: string = 'This field is required') => 
    (value: any) => !value || (typeof value === 'string' && !value.trim()) 
      ? message 
      : null,
      
  email: (message: string = 'Must be a valid email address') =>
    (value: string) => !value || /\S+@\S+\.\S+/.test(value) 
      ? null 
      : message,
      
  minLength: (length: number, message?: string) =>
    (value: string) => !value || value.length >= length 
      ? null 
      : message || `Must be at least ${length} characters`,
      
  maxLength: (length: number, message?: string) =>
    (value: string) => !value || value.length <= length 
      ? null 
      : message || `Must be no more than ${length} characters`,
      
  pattern: (pattern: RegExp, message: string) =>
    (value: string) => !value || pattern.test(value) 
      ? null 
      : message,
      
  match: (matchField: string, message: string = 'Fields do not match') =>
    (value: string, allValues: Record<string, any>) => 
      value === allValues[matchField] 
        ? null 
        : message
};
