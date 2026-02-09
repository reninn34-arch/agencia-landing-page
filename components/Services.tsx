import React from 'react';
import { MessageSquare, Laptop, LineChart, Database } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Services: React.FC = () => {
  const { content } = useContent();
  const { services } = content;

  // Map icons roughly to the HTML design's intention
  const icons = [
    <MessageSquare size={40} className="text-primary" />,
    <Laptop size={40} className="text-primary" />,
    <LineChart size={40} className="text-primary" />,
    <Database size={40} className="text-primary" />
  ];

  return (
    <section id="servicios" className="py-24 bg-gradient-to-b from-secondary to-slate-900 relative">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {services.sectionTitle.split(' ')[0]} <span className="text-primary">{services.sectionTitle.split(' ').slice(1).join(' ')}</span>
             </h2>
             <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-slate-600"></div>
                <p className="text-slate-400">{services.sectionSubtitle}</p>
                <div className="h-px w-12 bg-slate-600"></div>
             </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {services.items.map((item, index) => (
                <div 
                  key={item.id}
                  className={`group bg-white rounded-xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 relative ${index === 1 ? 'lg:-mt-4' : ''}`}
                >
                   {/* "Popular" badge simulation for the 2nd item if you want, or just keep uniform */}
                   {index === 1 && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                         Destacado
                      </div>
                   )}

                   <div className="p-8 flex flex-col items-center text-center h-full">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                         {icons[index] || icons[0]}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                         {item.description}
                      </p>
                      <div className="mt-auto w-full h-1 bg-slate-100 group-hover:bg-primary transition-colors"></div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};

export default Services;