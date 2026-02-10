// Validation utilities

export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  minLength: (min: number) => ({
    validate: (val: string) => val.length >= min,
    message: `Mínimo ${min} caracteres requeridos`
  }),
  maxLength: (max: number) => ({
    validate: (val: string) => val.length <= max,
    message: `Máximo ${max} caracteres permitidos`
  }),
  url: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: 'URL inválida'
  },
  phone: {
    pattern: /^[\d\s\+\-\(\)]{10,}$/,
    message: 'Número de teléfono inválido'
  }
};

export const validateField = (value: string, rules: any): string | null => {
  if (!value && !rules.required) return null;
  if (!value && rules.required) return 'Este campo es requerido';

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || 'Formato inválido';
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Mínimo ${rules.minLength} caracteres`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `Máximo ${rules.maxLength} caracteres`;
  }

  return null;
};

export const validateFileSize = (file: File, maxSizeMB: number = 2): string | null => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `El archivo no debe exceder ${maxSizeMB}MB`;
  }
  return null;
};

export const validateImageFile = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return 'El archivo debe ser una imagen (JPG, PNG, WebP, GIF)';
  }
  return validateFileSize(file, 2);
};

export const validateVideoFile = (file: File): string | null => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (!validTypes.includes(file.type)) {
    return 'El archivo debe ser un video (MP4, WebM, OGG)';
  }
  return validateFileSize(file, 5);
};

export const validateFormField = (fieldName: string, value: any): string | null => {
  switch (fieldName) {
    case 'email':
      return !value ? 'Email es requerido' : validationRules.email.pattern.test(value) ? null : 'Email inválido';
    
    case 'title':
    case 'name':
      return !value ? 'Requerido' : value.length < 2 ? 'Mínimo 2 caracteres' : value.length > 255 ? 'Máximo 255 caracteres' : null;
    
    case 'description':
    case 'text':
    case 'message':
      return !value ? 'Requerido' : value.length < 5 ? 'Mínimo 5 caracteres' : value.length > 2000 ? 'Máximo 2000 caracteres' : null;
    
    case 'price':
      const price = parseFloat(value);
      return !value ? 'Precio requerido' : isNaN(price) ? 'Debe ser un número' : price < 0 ? 'No puede ser negativo' : null;
    
    case 'url':
    case 'image':
    case 'link':
      if (!value) return null; // URLs are optional
      return validationRules.url.pattern.test(value) ? null : 'URL inválida';
    
    case 'whatsapp':
      if (!value) return null;
      return value.match(/^\d{10,}$/) ? null : 'Número de WhatsApp debe tener al menos 10 dígitos';
    
    default:
      return null;
  }
};

export const validateForm = (formData: Record<string, any>, requiredFields: string[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  requiredFields.forEach(field => {
    const error = validateFormField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.values(errors).some(error => error !== '');
};
