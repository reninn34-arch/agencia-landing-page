import React from 'react';
import { ShieldCheck, Lightbulb, Handshake } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const WhyChooseUs: React.FC = () => {
  const { content } = useContent();
  const { about } = content;

  const icons = [
    <ShieldCheck size={24} className="text-white text-xl" />,
    <Lightbulb size={24} className="text-white text-xl" />,
    <Handshake size={24} className="text-white text-xl" />
  ];

  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-slate-900 mb-2">
             {about.sectionTitle}
           </h2>
           <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {about.items.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 p-6 bg-background-light rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                  {icons[index] || icons[0]}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;