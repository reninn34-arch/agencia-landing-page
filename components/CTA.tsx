import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { MessageCircle, ChevronDown } from 'lucide-react';
import ContactForm from './ContactForm';

const CTA: React.FC = () => {
  const { content } = useContent();
  const { cta } = content;
  const [showForm, setShowForm] = useState(false);

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const number = cta.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus servicios digitales.');
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <section 
      id="contacto" 
      className="py-24 bg-cover bg-center bg-no-repeat relative bg-fixed transition-all duration-700"
      style={{ backgroundImage: `url('${cta.backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-secondary/90"></div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
            {cta.title}
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-10">
             <div className="h-px w-24 bg-slate-500"></div>
             <p className="text-xl text-slate-300">¡Hablemos hoy!</p>
             <div className="h-px w-24 bg-slate-500"></div>
          </div>

          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            {cta.text}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={openWhatsApp}
              className="bg-primary hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg shadow-primary/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle size={24} />
              WhatsApp
            </button>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-white hover:bg-slate-100 text-primary font-bold py-4 px-8 rounded-lg text-lg shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <span>Formulario</span>
              <ChevronDown size={24} className={`transition-transform ${showForm ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Contact Form */}
        {showForm && (
          <div className="mt-16 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Envíanos un Mensaje</h3>
            <ContactForm whatsappNumber={cta.whatsappNumber} />
          </div>
        )}
      </div>
    </section>
  );
};

export default CTA;