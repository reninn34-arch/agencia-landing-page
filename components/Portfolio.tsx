import React, { useState } from 'react';
import { ExternalLink, PlayCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const categories = ["Todos", "Web", "Software", "Redes", "Logos"];

const Portfolio: React.FC = () => {
  const { projects } = useContent();
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredProjects = activeFilter === "Todos" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const getVideoSrc = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    return url; 
  };

  return (
    <section id="portafolio" className="py-24 bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Matching the style of "Why Choose Us" header in new design */}
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Nuestro Portafolio</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
               Explora nuestros casos de éxito recientes.
            </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeFilter === cat
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
        </div>

        {/* Grid Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group relative h-72 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-secondary"
              >
                {/* MEDIA */}
                {project.mediaType === 'video' ? (
                   <iframe 
                      className="w-full h-full object-cover"
                      src={getVideoSrc(project.image)} 
                      title={project.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                   ></iframe>
                ) : (
                   <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                   />
                )}
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent flex flex-col justify-end p-6 ${project.mediaType === 'video' ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
                            {project.category}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                        <p className="text-slate-300 text-xs line-clamp-2">{project.description}</p>
                    </div>
                </div>

                {project.mediaType === 'video' && (
                  <div className="absolute top-4 right-4 pointer-events-none">
                     <div className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                        <PlayCircle size={20} />
                     </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">No hay proyectos en esta categoría aún.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;