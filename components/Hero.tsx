import React from 'react';
import { ArrowRight, TrendingUp, Code } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { content } = useContent();
  const { hero } = content;

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('portafolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-secondary">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
               {hero.titlePart1} <br className="hidden lg:block"/>
               <span className="text-primary">{hero.titleAccent}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-light mb-2">
               Redes Sociales & Desarrollo Web
            </p>
            <div className="w-24 h-1 bg-slate-700 mx-auto lg:mx-0 mb-6"></div>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed">
               {hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#servicios" 
                onClick={scrollToServices}
                className="bg-primary hover:bg-sky-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                 {hero.buttonPrimary}
              </a>
              <a 
                href="#portafolio" 
                onClick={scrollToPortfolio}
                className="border border-slate-500 hover:border-white text-white hover:bg-white/5 px-8 py-3.5 rounded-lg text-base font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                 {hero.buttonSecondary}
              </a>
            </div>
          </div>

          {/* Image & Widgets */}
          <div className="relative mt-10 lg:mt-0 lg:pl-10">
            <img 
               src={hero.image} 
               alt="Digital Dashboard" 
               className="w-full h-auto rounded-2xl shadow-2xl border border-slate-700/50 transform rotate-1 hover:rotate-0 transition-transform duration-500 object-cover opacity-90 hover:opacity-100"
            />
            
            {/* Float Widget 1 */}
            <div className="absolute -top-4 -right-4 bg-surface-dark p-4 rounded-xl shadow-xl border border-slate-700 hidden sm:block animate-bounce" style={{animationDuration: '3s'}}>
               <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                     <TrendingUp size={20} className="text-green-400" />
                  </div>
                  <div>
                     <p className="text-xs text-slate-400">Crecimiento</p>
                     <p className="text-white font-bold">+125%</p>
                  </div>
               </div>
            </div>

            {/* Float Widget 2 */}
            <div className="absolute -bottom-6 -left-4 bg-surface-dark p-4 rounded-xl shadow-xl border border-slate-700 hidden sm:block animate-pulse" style={{animationDuration: '4s'}}>
               <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                     <Code size={20} className="text-primary" />
                  </div>
                  <div>
                     <p className="text-xs text-slate-400">Desarrollo</p>
                     <p className="text-white font-bold">Optimizado</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Hero;