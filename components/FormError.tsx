import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface FormErrorProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export const FormError: React.FC<FormErrorProps> = ({ 
  message, 
  onDismiss, 
  type = 'error' 
}) => {
  if (!message) return null;

  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${colors[type]} text-sm`}>
      <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-inherit hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

interface FieldErrorProps {
  error?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ error }) => {
  if (!error) return null;
  return (
    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {error}
    </p>
  );
};

interface FormSuccessProps {
  message: string;
  onDismiss?: () => void;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ 
  message, 
  onDismiss 
}) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
      <div className="h-4 w-4 mt-0.5 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
        <span className="text-white text-xs font-bold">✓</span>
      </div>
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-inherit hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
