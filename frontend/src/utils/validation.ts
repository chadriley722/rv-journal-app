type ValidatorFunction = (value: any) => string | null;

type Validators = Record<string, ValidatorFunction>;

type FormData = Record<string, any>;

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Please enter a valid email address';
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.length > 50) {
    return 'Name cannot exceed 50 characters';
  }
  return null;
};

export const validateForm = (formData: FormData, validators: Validators): string[] => {
  const errors: string[] = [];
  
  Object.entries(validators).forEach(([field, validator]) => {
    const error = validator(formData[field]);
    if (error) {
      errors.push(`${field}: ${error}`);
    }
  });
  
  return errors;
};

export default validateForm;
