import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { content } = useContent();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const number = content.cta.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus servicios digitales.');
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <nav 
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-secondary/95 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={(e) => handleNavClick(e as any, 'top')}>
            {content.logo ? (
              <img 
                src={content.logo} 
                alt="Logo Agency" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-110" 
              />
            ) : (
              <div className="bg-white rounded-md w-10 h-10 flex items-center justify-center font-bold text-secondary text-xl shadow-md transition-transform group-hover:scale-110">
                  {content.siteName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-white font-semibold text-lg hidden sm:block tracking-tight">
              {content.siteName}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {['Inicio', 'Servicios', 'Planes', 'Nosotros', 'Portafolio'].map((item) => {
               const id = item === 'Inicio' ? 'top' : item.toLowerCase();
               return (
                <a 
                  key={item}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:tracking-wide duration-300"
                >
                  {item}
                </a>
               );
            })}
          </div>

          <div className="hidden md:flex">
             <button 
                onClick={openWhatsApp}
                className="bg-primary hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
             >
                <MessageCircle size={16} />
                ¡Hablemos!
             </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white hover:text-primary focus:outline-none transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-secondary border-b border-white/10 animate-fade-in-up">
           <div className="px-4 pt-2 pb-6 space-y-2">
            {['Inicio', 'Servicios', 'Planes', 'Nosotros', 'Portafolio'].map((item) => {
               const id = item === 'Inicio' ? 'top' : item.toLowerCase();
               return (
                <a 
                  key={item}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {item}
                </a>
               );
            })}
             <button 
                onClick={openWhatsApp}
                className="w-full mt-4 bg-primary hover:bg-sky-600 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
             >
                <MessageCircle size={20} />
                ¡Hablemos!
             </button>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;