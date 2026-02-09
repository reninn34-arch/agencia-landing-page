import React from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Pricing: React.FC = () => {
  const { content } = useContent();
  const { plans, cta } = content;

  const handleAction = (e: React.MouseEvent, planName: string) => {
    e.preventDefault();
    const number = cta.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(`¡Hola! Estoy interesado en el plan ${planName}. ¿Me podrían dar más información?`);
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <section id="planes" className="py-24 bg-secondary relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
             {plans.sectionTitle}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-slate-600"></div>
            <p className="text-slate-400">{plans.sectionSubtitle}</p>
            <div className="h-px w-12 bg-slate-600"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.items.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-4 flex flex-col h-full ${
                plan.isPopular ? 'border-4 border-primary scale-105 z-20 shadow-primary/20' : 'border border-slate-100 scale-100'
              }`}
            >
              {plan.isPopular && (
                <div className="bg-primary text-white text-center py-2 text-sm font-bold uppercase tracking-widest">
                  Más Recomendado
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tighter">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-secondary">{plan.price}</span>
                  <span className="text-slate-500 font-medium">{plan.period}</span>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-50 text-primary p-0.5 rounded-full">
                        <Check size={14} />
                      </div>
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={(e) => handleAction(e, plan.name)}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    plan.isPopular 
                      ? 'bg-primary text-white hover:bg-sky-600 shadow-lg shadow-primary/30' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MessageCircle size={18} />
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;