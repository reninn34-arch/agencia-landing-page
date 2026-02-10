import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  whatsappNumber?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ whatsappNumber }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa tu nombre');
      setStatus('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Por favor ingresa un email válido');
      setStatus('error');
      return;
    }
    if (formData.message.length < 10) {
      setErrorMsg('El mensaje debe tener al menos 10 caracteres');
      setStatus('error');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar el mensaje');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-white/80 mb-2">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
            disabled={status === 'loading'}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-white/80 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
            disabled={status === 'loading'}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-bold text-white/80 mb-2">Mensaje</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Cuéntanos qué necesitas..."
            rows={5}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all resize-none"
            disabled={status === 'loading'}
          />
        </div>

        {/* Error message */}
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Success message */}
        {status === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl animate-fade-in-up">
            <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-200 text-sm">¡Mensaje enviado! Te contactaremos pronto.</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            status === 'loading'
              ? 'bg-white/50 text-slate-900 cursor-not-allowed'
              : status === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-primary hover:bg-primary hover:text-white shadow-xl hover:shadow-2xl'
          }`}
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
              Enviando...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle size={20} />
              ¡Enviado!
            </>
          ) : (
            <>
              <Send size={20} />
              Enviar Mensaje
            </>
          )}
        </button>

        {/* WhatsApp alternative */}
        {whatsappNumber && (
          <p className="text-center text-white/60 text-sm">
            O contáctanos directamente por{' '}
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hola,%20me%20gustaría%20conocer%20más%20sobre%20tus%20servicios`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-bold"
            >
              WhatsApp
            </a>
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
