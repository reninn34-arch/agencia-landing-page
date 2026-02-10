import React, { createContext, useContext, useState, useEffect } from 'react';

// --- TYPES ---

export interface Project {
  id: number;
  title: string;
  category: string;
  mediaType: 'image' | 'video';
  image: string; 
  description: string;
  tech: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
}

export interface ReasonItem {
  id: number;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

export interface SiteContent {
  logo: string;
  siteName: string;
  adminPassword: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
  };
  hero: {
    titlePart1: string;
    titleAccent: string;
    subtitle: string;
    buttonPrimary: string;
    buttonSecondary: string;
    image: string;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: ServiceItem[];
  };
  plans: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: PricingPlan[];
  };
  about: {
    sectionTitle: string;
    items: ReasonItem[];
  };
  cta: {
    title: string;
    text: string;
    buttonText: string;
    whatsappNumber: string;
    backgroundImage: string;
  };
}

// --- DEFAULTS ---

const defaultContent: SiteContent = {
  logo: "", 
  siteName: "Digital Agency",
  adminPassword: "admin123",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "",
    linkedin: "https://linkedin.com",
    tiktok: ""
  },
  hero: {
    titlePart1: "Impulsa tu",
    titleAccent: "Negocio Online",
    subtitle: "Estrategias Digitales que Funcionan. Transformamos tus ideas en soluciones digitales rentables y escalables.",
    buttonPrimary: "Conoce Nuestros Servicios",
    buttonSecondary: "Ver Portafolio",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  },
  services: {
    sectionTitle: "Nuestros Servicios",
    sectionSubtitle: "Soluciones a tu medida",
    items: [
      { id: 1, title: "Manejo de Redes Sociales", description: "Gestión de contenido y estrategia para tus redes. Aumenta tu comunidad." },
      { id: 2, title: "Desarrollo Web", description: "Creación de sitios web modernos y funcionales. Tiendas online y landing pages." },
      { id: 3, title: "SEO & Analítica", description: "Optimización y análisis de resultados para posicionar tu marca." },
      { id: 4, title: "Software Empresarial", description: "Sistemas personalizados para automatizar procesos." }
    ]
  },
  plans: {
    sectionTitle: "Planes de Inversión",
    sectionSubtitle: "Escoge el nivel de crecimiento para tu marca",
    items: [
      { 
        id: 1, name: "Básico", price: "$199", period: "/mes", isPopular: false, buttonText: "Empezar ahora",
        features: ["Gestión de 1 Red Social", "4 Posts Mensuales", "Soporte Vía Email", "Reporte Mensual"]
      },
      { 
        id: 2, name: "Profesional", price: "$499", period: "/mes", isPopular: true, buttonText: "Plan más elegido",
        features: ["Gestión de 3 Redes", "12 Posts Mensuales", "Atención Prioritaria", "Análisis de Competencia", "Diseño de Landing Page"]
      },
      { 
        id: 3, name: "Elite", price: "$999", period: "/mes", isPopular: false, buttonText: "Contactar para detalles",
        features: ["Redes Ilimitadas", "Contenido Diario", "Estrategia Ads Full", "Software a Medida", "Consultoría 1 a 1"]
      }
    ]
  },
  about: {
    sectionTitle: "¿Por Qué Elegirnos?",
    items: [
      { id: 1, title: "Experiencia Profesional", description: "Años de experiencia entregando resultados tangibles." },
      { id: 2, title: "Estrategias Efectivas", description: "Soluciones adaptadas específicamente a tu negocio." },
      { id: 3, title: "Atención Personalizada", description: "Comprometidos con tu éxito mediante un acompañamiento constante." }
    ]
  },
  cta: {
    title: "¿Listos para crecer tu negocio?",
    text: "¡Hablemos hoy! Descubre cómo podemos llevar tu empresa al siguiente nivel.",
    buttonText: "Contáctanos",
    whatsappNumber: "521234567890",
    backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80"
  }
};

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "Fashion Film 2024",
    category: "Redes",
    mediaType: "video",
    image: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Producción audiovisual completa para campaña de verano.",
    tech: "Producción + Edición"
  },
  {
    id: 2,
    title: "E-Commerce Moda Deluxe",
    category: "Web",
    mediaType: "image",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    description: "Tienda online completa con pasarela de pagos.",
    tech: "React + Node.js"
  }
];

interface ContentContextType {
  projects: Project[];
  content: SiteContent;
  isLoaded: boolean;
  updateContent: (newContent: SiteContent) => void;
  updateProjects: (newProjects: Project[]) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  resetToDefaults: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get initial content from localStorage
  const getInitialContent = (): SiteContent => {
    const savedContent = localStorage.getItem('el_digital_content');
    if (savedContent) {
      try {
        return JSON.parse(savedContent);
      } catch {
        return defaultContent;
      }
    }
    return defaultContent;
  };

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('el_digital_projects');
    if (savedProjects) {
      try {
        return JSON.parse(savedProjects);
      } catch {
        return defaultProjects;
      }
    }
    return defaultProjects;
  });
  
  const [content, setContent] = useState<SiteContent>(getInitialContent);
  const [isLoaded, setIsLoaded] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Load content from API or localStorage
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try loading from API first
        const response = await fetch(`${apiUrl}/api/content`);
        if (response.ok) {
          const apiContent = await response.json();
          setContent(apiContent);
          localStorage.setItem('el_digital_content', JSON.stringify(apiContent));
        } else {
          // Fallback to localStorage
          const savedContent = localStorage.getItem('el_digital_content');
          if (savedContent) {
            try {
              setContent(JSON.parse(savedContent));
            } catch {
              setContent(defaultContent);
            }
          } else {
            setContent(defaultContent);
          }
        }
      } catch (err) {
        console.log('API not available, using localStorage');
        // Fallback to localStorage if API is not available
        const savedContent = localStorage.getItem('el_digital_content');
        if (savedContent) {
          try {
            setContent(JSON.parse(savedContent));
          } catch {
            setContent(defaultContent);
          }
        }
      }
    };

    const loadProjects = async () => {
      try {
        // Try loading from API first
        const response = await fetch(`${apiUrl}/api/projects`);
        if (response.ok) {
          const apiProjects = await response.json();
          setProjects(apiProjects);
          localStorage.setItem('el_digital_projects', JSON.stringify(apiProjects));
        } else {
          // Fallback to localStorage
          const savedProjects = localStorage.getItem('el_digital_projects');
          if (savedProjects) {
            try {
              setProjects(JSON.parse(savedProjects));
            } catch {
              setProjects(defaultProjects);
            }
          } else {
            setProjects(defaultProjects);
          }
        }
      } catch (err) {
        console.log('API not available for projects, using localStorage');
        // Fallback to localStorage if API is not available
        const savedProjects = localStorage.getItem('el_digital_projects');
        if (savedProjects) {
          try {
            setProjects(JSON.parse(savedProjects));
          } catch {
            setProjects(defaultProjects);
          }
        }
      }
    };

    loadContent();
    loadProjects();
    setIsLoaded(true);
  }, [apiUrl]);

  useEffect(() => {
    if (isLoaded && content) {
      localStorage.setItem('el_digital_projects', JSON.stringify(projects));
      localStorage.setItem('el_digital_content', JSON.stringify(content));
    }
  }, [projects, content, isLoaded]);

  const updateContent = (newContent: SiteContent) => setContent(newContent);
  const updateProjects = (newProjects: Project[]) => setProjects(newProjects);
  const addProject = (projectData: Omit<Project, 'id'>) => setProjects([{ ...projectData, id: Date.now() }, ...projects]);
  const updateProject = (updatedProject: Project) => setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  const deleteProject = (id: number) => setProjects(projects.filter(p => p.id !== id));
  const resetToDefaults = () => { if(confirm("¿Restaurar todo?")) { setProjects(defaultProjects); setContent(defaultContent); } };

  return (
    <ContentContext.Provider value={{ projects, content, isLoaded, updateContent, updateProjects, addProject, updateProject, deleteProject, resetToDefaults }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent error');
  return context;
};