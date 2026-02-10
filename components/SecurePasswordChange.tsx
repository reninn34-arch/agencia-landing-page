import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FieldError } from './FormError';

interface SecurePasswordChangeProps {
  currentPassword: string;
  onPasswordChange: (newPassword: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SecurePasswordChange: React.FC<SecurePasswordChangeProps> = ({
  currentPassword,
  onPasswordChange,
  onCancel,
  isLoading = false
}) => {
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateCurrentPassword = () => {
    // Trim whitespace and compare
    const trimmedCurrent = currentPass.trim();
    const trimmedExpected = currentPassword.trim();
    
    if (trimmedCurrent !== trimmedExpected) {
      setError('Contraseña actual incorrecta');
      return false;
    }
    setError('');
    setStep('new');
    return true;
  };

  const validateNewPassword = () => {
    if (!newPass) {
      setError('La nueva contraseña es requerida');
      return false;
    }
    if (newPass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (newPass === currentPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return false;
    }
    setError('');
    setStep('confirm');
    return true;
  };

  const validateConfirmPassword = () => {
    if (newPass.trim() !== confirmPass.trim()) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    setError('');
    onPasswordChange(newPass.trim());
    return true;
  };

  const handlePrevious = () => {
    setError('');
    if (step === 'new') setStep('current');
    if (step === 'confirm') setStep('new');
  };

  const handleNext = () => {
    if (step === 'current') validateCurrentPassword();
    else if (step === 'new') validateNewPassword();
    else if (step === 'confirm') validateConfirmPassword();
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 text-blue-900 font-semibold">
        <Shield className="h-5 w-5" />
        <span>Cambio Seguro de Contraseña</span>
      </div>

      {step === 'current' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={currentPass}
              onChange={(e) => {
                setCurrentPass(e.target.value);
                setError('');
              }}
              placeholder="Ingresa tu contraseña actual"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <FieldError error={error} />}
        </div>
      )}

      {step === 'new' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPass}
              onChange={(e) => {
                setNewPass(e.target.value);
                setError('');
              }}
              placeholder="Crea una nueva contraseña (mín. 6 caracteres)"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <FieldError error={error} />}
          <div className="text-xs text-slate-500 mt-2">
            {newPass.length > 0 && (
              <>
                {newPass.length < 6 ? (
                  <span className="text-red-600">
                    Mínimo 6 caracteres (falta {6 - newPass.length})
                  </span>
                ) : (
                  <span className="text-green-600">✓ Contraseña fuerte</span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                setError('');
              }}
              placeholder="Confirma tu nueva contraseña"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <FieldError error={error} />}
          {confirmPass && newPass === confirmPass && (
            <p className="text-xs text-green-600 mt-2">✓ Las contraseñas coinciden</p>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {step !== 'current' && (
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Atrás
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isLoading || (step === 'current' && !currentPass) || (step === 'new' && !newPass) || (step === 'confirm' && !confirmPass)
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={isLoading || (step === 'current' && !currentPass) || (step === 'new' && !newPass) || (step === 'confirm' && !confirmPass)}
        >
          {isLoading ? 'Procesando...' : step === 'confirm' ? 'Confirmar Cambio' : 'Siguiente'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
