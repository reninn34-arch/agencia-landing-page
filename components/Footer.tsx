import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Lock, Music2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface FooterProps {
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const { content } = useContent();
  const { socials, siteName } = content;

  const socialLinks = [
    { id: 'facebook', icon: Facebook, url: socials.facebook },
    { id: 'instagram', icon: Instagram, url: socials.instagram },
    { id: 'twitter', icon: Twitter, url: socials.twitter },
    { id: 'linkedin', icon: Linkedin, url: socials.linkedin },
    { id: 'tiktok', icon: Music2, url: socials.tiktok },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <footer className="bg-black text-slate-400 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-sm">
             <span className="block mb-2 md:mb-0">Conectamos Ideas. Crecemos Juntos.</span>
          </div>

          <div className="flex gap-4">
             {socialLinks.map((social) => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center text-white transition-colors"
                >
                   <social.icon size={18} />
                </a>
             ))}
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
           <span>&copy; {new Date().getFullYear()} {siteName}. Todos los derechos reservados.</span>
           <button 
             onClick={(e) => { e.preventDefault(); onAdminClick(); }}
             className="text-slate-700 hover:text-slate-500 mt-2 md:mt-0 flex items-center gap-1"
             title="Admin"
           >
             <Lock size={10} /> Admin
           </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;