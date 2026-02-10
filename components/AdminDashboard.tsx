import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useContent, Project, SiteContent, PricingPlan } from '../context/ContentContext';
import { 
  LayoutDashboard, 
  Type, 
  Image as ImageIcon, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Save, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  RotateCcw,
  Check,
  Upload,
  Link as LinkIcon,
  Video,
  Phone,
  CreditCard,
  Shield,
  Building,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Music2,
  Eye,
  EyeOff,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Monitor
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'general' | 'services' | 'portfolio' | 'plans' | 'about' | 'cta';

const inputBaseClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none transition-all duration-200 shadow-sm";
const labelBaseClass = "block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest flex items-center gap-2";
const cardClass = "bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6 transition-all hover:shadow-md";

interface MediaUploaderProps {
  currentValue: string;
  mediaType?: 'image' | 'video';
  onMediaChange: (value: string, type?: 'image' | 'video') => void;
  label?: string;
  helper?: string;
}

const isImageUrl = (url: string) => {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  return /\.(png|jpe?g|gif|webp|svg)(\?.*|#.*)?$/i.test(url);
};

const getVideoEmbedUrl = (url: string) => {
  if (!url) return '';
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
  if (youtubeMatch?.[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
};

const MediaUploader: React.FC<MediaUploaderProps> = ({ currentValue, mediaType = 'image', onMediaChange, label = "Multimedia", helper }) => {
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) { alert("Archivo demasiado grande. Máximo 2MB."); return; }
      const reader = new FileReader();
      reader.onloadend = () => onMediaChange(reader.result as string, 'image');
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <label className={labelBaseClass}>{label}</label>
          {helper && <p className="text-[10px] text-slate-400 -mt-1 mb-2">{helper}</p>}
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-2">
          <button type="button" onClick={() => setUploadMode('url')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${uploadMode === 'url' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}>URL</button>
          <button type="button" onClick={() => setUploadMode('upload')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${uploadMode === 'upload' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}>Subir</button>
        </div>
      </div>
      
      {uploadMode === 'upload' ? (
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="group border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary transition-all bg-slate-50/30"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Upload size={20} className="text-slate-400 group-hover:text-primary" />
          </div>
          <p className="text-xs text-slate-500 font-bold">Haz clic para buscar archivo</p>
        </div>
      ) : (
        <div className="relative">
          <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={currentValue} onChange={(e) => onMediaChange(e.target.value)} placeholder="https://ejemplo.com/recurso.png" className={`${inputBaseClass} pl-12`} />
        </div>
      )}
      
      {currentValue && (
        <div className="relative group h-40 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner mt-2">
          {mediaType === 'video' ? (
            <iframe
              src={getVideoEmbedUrl(currentValue)}
              className="h-full w-full"
              title="Video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isImageUrl(currentValue) ? (
            <img src={currentValue} alt="Preview" className="h-full w-full object-contain p-2" />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-white/70 gap-2 px-4 text-center">
              <LinkIcon size={20} />
              <p className="text-[10px] font-bold uppercase tracking-widest">URL detectada</p>
              <a href={currentValue} target="_blank" rel="noreferrer" className="text-[10px] text-white underline">Abrir sitio</a>
            </div>
          )}
          {mediaType === 'video' ? (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">Vista Previa</span>
            </div>
          ) : isImageUrl(currentValue) ? (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">Vista Previa</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { projects, content, updateContent, addProject, updateProject, deleteProject, resetToDefaults } = useContent();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [projectSearch, setProjectSearch] = useState('');

  // Track if changes were made
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(localContent) !== JSON.stringify(content);
  }, [localContent, content]);

  // Password improvement states
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState(content.adminPassword);
  const [passError, setPassError] = useState('');

  useEffect(() => { 
    setLocalContent(content); 
    setConfirmPass(content.adminPassword);
  }, [content]);

  useEffect(() => {
    if (localContent.adminPassword !== confirmPass) {
      setPassError('Las contraseñas no coinciden');
    } else {
      setPassError('');
    }
  }, [localContent.adminPassword, confirmPass]);

  const handleSaveContent = async () => {
    if (passError) {
      alert("Por favor, corrige los errores de contraseña.");
      return;
    }
    setIsSaving(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      if (apiUrl) {
        // Save to database via API
        const response = await fetch(`${apiUrl}/api/content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: localContent,
            password: localContent.adminPassword
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save to database');
        }
      }
      
      // Update local context
      updateContent(localContent);
      alert('Contenido guardado exitosamente');
    } catch (err) {
      console.error('Error saving content:', err);
      alert('Error al guardar. Los cambios se guardaron localmente.');
      updateContent(localContent);
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  const handleTopLevelChange = (field: keyof SiteContent, value: any) => {
    setLocalContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: keyof SiteContent['socials'], value: string) => {
    setLocalContent(prev => ({
      ...prev,
      socials: { ...prev.socials, [network]: value }
    }));
  };

  const handleInputChange = (section: keyof SiteContent, field: string, value: any) => {
    setLocalContent(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleArrayItemChange = (section: 'services' | 'about' | 'plans', index: number, field: string, value: any) => {
    const newItems = [...localContent[section].items];
    // @ts-ignore
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalContent(prev => ({ ...prev, [section]: { ...prev[section], items: newItems } }));
  };

  const filteredProjects = useMemo(() => {
    if (!projectSearch) return projects;
    return projects.filter(p => 
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
      p.category.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [projects, projectSearch]);

  const SidebarItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
        activeTab === id 
        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={`${activeTab === id ? 'scale-110' : 'opacity-70 group-hover:opacity-100'} transition-all`} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      <ChevronRight size={14} className={`${activeTab === id ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800 selection:bg-primary/20">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-30 shadow-xl shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-4 mb-1">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg overflow-hidden shrink-0">
               {localContent.logo ? (
                 <img src={localContent.logo} className="w-full h-full object-contain p-1" />
               ) : (
                 localContent.siteName.slice(0, 2).toUpperCase()
               )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-900 truncate leading-none mb-1">{localContent.siteName}</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 ml-2">Configuración</p>
          <SidebarItem id="general" icon={LayoutDashboard} label="Identidad y Marca" />
          <SidebarItem id="services" icon={Briefcase} label="Nuestros Servicios" />
          <SidebarItem id="plans" icon={CreditCard} label="Planes y Precios" />
          <SidebarItem id="portfolio" icon={ImageIcon} label="Galería Proyectos" />
          <SidebarItem id="about" icon={Users} label="Cultura / Nosotros" />
          <SidebarItem id="cta" icon={MessageSquare} label="Contacto Final" />
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={resetToDefaults} 
            className="w-full text-left p-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 flex items-center gap-2 transition-all rounded-xl hover:bg-red-50"
          >
            <RotateCcw size={14}/> Resetear Sitio
          </button>
          <button 
            onClick={onLogout} 
            className="w-full mt-3 bg-slate-900 hover:bg-black text-white p-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-xs shadow-lg shadow-slate-300"
          >
            <LogOut size={16}/> CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-10 py-6 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                {activeTab === 'general' && 'Identidad y Marca'}
                {activeTab === 'services' && 'Nuestros Servicios'}
                {activeTab === 'plans' && 'Planes de Inversión'}
                {activeTab === 'portfolio' && 'Galería de Proyectos'}
                {activeTab === 'about' && 'Sobre Nosotros'}
                {activeTab === 'cta' && 'Llamado a la Acción'}
              </h1>
              <p className="text-xs text-slate-400 font-medium">Gestiona el contenido visible para tus clientes</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {hasUnsavedChanges && (
               <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 animate-fade-in uppercase tracking-widest">Cambios pendientes</span>
             )}
             <button 
               onClick={handleSaveContent} 
               disabled={isSaving || !hasUnsavedChanges} 
               className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl ${
                 isSaving 
                 ? 'bg-emerald-500 text-white' 
                 : hasUnsavedChanges 
                    ? 'bg-primary text-white shadow-primary/30 hover:bg-sky-600' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
               }`}
             >
               {isSaving ? <Check size={18} className="animate-bounce" /> : <Save size={18}/>}
               {isSaving ? '¡Guardado!' : 'Guardar Todo'}
             </button>
          </div>
        </div>

        <div className="p-10 max-w-6xl mx-auto space-y-10 pb-32">
          
          {/* TAB: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className={cardClass}>
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><Building size={20} className="text-primary"/> Perfil de la Agencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelBaseClass}>Nombre Comercial</label>
                    <input className={inputBaseClass} placeholder="Ej: Elite Media Agency" value={localContent.siteName} onChange={e => handleTopLevelChange('siteName', e.target.value)} />
                  </div>
                  <MediaUploader 
                    currentValue={localContent.logo} 
                    onMediaChange={v => handleTopLevelChange('logo', v)} 
                    label="Logotipo del Sitio" 
                    helper="Resolución sugerida: 200x200px. Formato PNG o SVG."
                  />
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><Shield size={20} className="text-primary"/> Seguridad del Panel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelBaseClass}>Nueva Contraseña Administrativa</label>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        className={`${inputBaseClass} font-mono pr-12 ${passError ? 'border-red-300 bg-red-50/30' : ''}`} 
                        value={localContent.adminPassword} 
                        onChange={e => handleTopLevelChange('adminPassword', e.target.value)} 
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelBaseClass}>Confirmar Contraseña</label>
                    <input type={showPass ? "text" : "password"} className={`${inputBaseClass} font-mono ${passError ? 'border-red-300 bg-red-50/30' : ''}`} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                    {passError && <p className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12}/> {passError}</p>}
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><Share2 size={20} className="text-primary"/> Ecosistema Social</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { id: 'facebook', icon: Facebook, label: 'Facebook URL' },
                    { id: 'instagram', icon: Instagram, label: 'Instagram URL' },
                    { id: 'twitter', icon: Twitter, label: 'X / Twitter URL' },
                    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Profile' },
                    { id: 'tiktok', icon: Music2, label: 'TikTok Account' }
                  ].map(social => (
                    <div key={social.id} className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within:text-primary transition-colors">
                        <social.icon size={16} />
                      </div>
                      <input 
                        className={`${inputBaseClass} pl-14`} 
                        placeholder={social.label} 
                        // @ts-ignore
                        value={localContent.socials[social.id]} 
                        // @ts-ignore
                        onChange={e => handleSocialChange(social.id, e.target.value)} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><Monitor size={20} className="text-primary"/> Portada Principal (Hero)</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelBaseClass}>Título Superior</label>
                      <input className={inputBaseClass} value={localContent.hero.titlePart1} onChange={e => handleInputChange('hero', 'titlePart1', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelBaseClass}>Título Destacado</label>
                      <input className={`${inputBaseClass} font-black text-primary`} value={localContent.hero.titleAccent} onChange={e => handleInputChange('hero', 'titleAccent', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className={labelBaseClass}>Descripción Hero</label>
                    <textarea className={inputBaseClass} rows={4} value={localContent.hero.subtitle} onChange={e => handleInputChange('hero', 'subtitle', e.target.value)} />
                  </div>
                  <MediaUploader currentValue={localContent.hero.image} onMediaChange={v => handleInputChange('hero', 'image', v)} label="Imagen de Portada" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className={cardClass}>
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><Briefcase size={20} className="text-primary"/> Encabezado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelBaseClass}>Título Sección</label>
                    <input className={inputBaseClass} value={localContent.services.sectionTitle} onChange={e => handleInputChange('services', 'sectionTitle', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelBaseClass}>Subtítulo Informativo</label>
                    <input className={inputBaseClass} value={localContent.services.sectionSubtitle} onChange={e => handleInputChange('services', 'sectionSubtitle', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {localContent.services.items.map((item, idx) => (
                  <div key={item.id} className={`${cardClass} hover:border-primary/30 group`}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full">Servicio #{idx+1}</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className={labelBaseClass}>Nombre del Servicio</label>
                        <input className={`${inputBaseClass} font-bold`} value={item.title} onChange={e => handleArrayItemChange('services', idx, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelBaseClass}>Descripción Detallada</label>
                        <textarea className={inputBaseClass} rows={4} value={item.description} onChange={e => handleArrayItemChange('services', idx, 'description', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className={cardClass}>
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><CreditCard size={20} className="text-primary"/> Configuración Global de Precios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                    <label className={labelBaseClass}>Título Principal</label>
                    <input className={inputBaseClass} value={localContent.plans.sectionTitle} onChange={e => handleInputChange('plans', 'sectionTitle', e.target.value)} />
                   </div>
                   <div>
                    <label className={labelBaseClass}>Bajada de Texto</label>
                    <input className={inputBaseClass} value={localContent.plans.sectionSubtitle} onChange={e => handleInputChange('plans', 'sectionSubtitle', e.target.value)} />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {localContent.plans.items.map((plan, idx) => (
                   <div key={plan.id} className={`${cardClass} ${plan.isPopular ? 'ring-4 ring-primary/5 border-primary shadow-primary/10' : ''}`}>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Nivel {idx+1}</span>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="w-4 h-4 rounded-lg text-primary focus:ring-primary/20 border-slate-300" checked={plan.isPopular} onChange={e => handleArrayItemChange('plans', idx, 'isPopular', e.target.checked)} />
                           <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-primary transition-colors tracking-tighter">Popular</span>
                        </label>
                      </div>
                      <div className="space-y-4">
                        <input className={`${inputBaseClass} font-black text-center text-lg`} value={plan.name} onChange={e => handleArrayItemChange('plans', idx, 'name', e.target.value)} placeholder="Nombre del Plan" />
                        <div className="flex gap-2">
                           <input className={`${inputBaseClass} font-black`} value={plan.price} onChange={e => handleArrayItemChange('plans', idx, 'price', e.target.value)} placeholder="Precio" />
                           <input className={inputBaseClass} value={plan.period} onChange={e => handleArrayItemChange('plans', idx, 'period', e.target.value)} placeholder="Periodo" />
                        </div>
                        <div>
                          <label className={labelBaseClass}>Características (1 por línea)</label>
                          <textarea className={`${inputBaseClass} text-xs leading-relaxed`} rows={8} value={plan.features.join('\n')} onChange={e => handleArrayItemChange('plans', idx, 'features', e.target.value.split('\n'))} />
                        </div>
                        <input className={`${inputBaseClass} bg-slate-900 text-white border-none font-bold text-center text-xs py-3`} value={plan.buttonText} onChange={e => handleArrayItemChange('plans', idx, 'buttonText', e.target.value)} />
                      </div>
                   </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full md:max-w-md">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Buscar por título o categoría..." 
                      className={`${inputBaseClass} pl-12`} 
                      value={projectSearch}
                      onChange={e => setProjectSearch(e.target.value)}
                   />
                </div>
                <button 
                  onClick={() => { setCurrentProject({ title: '', category: 'Web', mediaType: 'image', image: '', description: '', tech: '' }); setIsEditingProject(true); }} 
                  className="w-full md:w-auto bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-sky-600 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Plus size={18}/> Nuevo Proyecto
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(p => (
                    <div key={p.id} className="group bg-white rounded-3xl border border-slate-100 p-3 shadow-sm hover:shadow-xl transition-all relative">
                      <div className="aspect-[4/3] bg-slate-900 rounded-2xl mb-4 overflow-hidden relative">
                         {p.mediaType === 'image' ? (
                           <img src={p.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         ) : (
                           <div className="h-full flex flex-col items-center justify-center text-white/50">
                             <Video size={32} />
                             <span className="text-[10px] font-black uppercase mt-2">Video YouTube</span>
                           </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            <span className="text-[8px] font-black text-white bg-primary px-2 py-1 rounded-md uppercase tracking-widest">{p.category}</span>
                         </div>
                      </div>
                      
                      <div className="px-2 pb-2">
                        <h4 className="font-black text-slate-900 truncate text-sm mb-4">{p.title}</h4>
                        <div className="flex gap-2">
                          <button onClick={() => { setCurrentProject(p); setIsEditingProject(true); }} className="flex-1 py-2.5 bg-slate-100 text-slate-600 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"><Edit size={12}/> Editar</button>
                          <button onClick={() => { if(confirm('¿Eliminar proyecto permanentemente?')) deleteProject(p.id); }} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold">No se encontraron proyectos</p>
                  </div>
                )}
              </div>

              {/* PROJECT EDITOR MODAL */}
              {isEditingProject && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                   <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                      <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <h3 className="font-black text-slate-900 text-2xl">Editor de Proyecto</h3>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em] mt-1">Configuración multimedia</p>
                        </div>
                        <button onClick={() => setIsEditingProject(false)} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all transform active:scale-90"><X size={24}/></button>
                      </div>
                      
                      <form 
                        onSubmit={e => { 
                          e.preventDefault(); 
                          if(currentProject.id) updateProject(currentProject as Project); 
                          else addProject(currentProject as Omit<Project,'id'>); 
                          setIsEditingProject(false); 
                        }} 
                        className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar"
                      >
                         <div>
                            <label className={labelBaseClass}>Nombre del Caso de Éxito</label>
                            <input className={inputBaseClass} placeholder="Ej: Rediseño App Bancaria" value={currentProject.title} onChange={e => setCurrentProject({...currentProject, title: e.target.value})} required />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-8">
                           <div>
                             <label className={labelBaseClass}>Categoría</label>
                             <select className={inputBaseClass} value={currentProject.category} onChange={e => setCurrentProject({...currentProject, category: e.target.value})}>
                               <option value="Web">Desarrollo Web</option>
                               <option value="Software">Software SaaS</option>
                               <option value="Redes">Marketing & Redes</option>
                               <option value="Logos">Identidad Visual</option>
                             </select>
                           </div>
                           <div>
                             <label className={labelBaseClass}>Tipo de Formato</label>
                             <select className={inputBaseClass} value={currentProject.mediaType} onChange={e => setCurrentProject({...currentProject, mediaType: e.target.value as any})}>
                               <option value="image">Imagen Estática</option>
                               <option value="video">Video YouTube</option>
                             </select>
                           </div>
                         </div>

                         <MediaUploader 
                           currentValue={currentProject.image || ''} 
                           mediaType={currentProject.mediaType} 
                           onMediaChange={v => setCurrentProject({...currentProject, image: v})} 
                           label={currentProject.mediaType === 'video' ? "URL de YouTube" : "Archivo de Imagen"} 
                         />

                         <div>
                            <label className={labelBaseClass}>Descripción del Resultado</label>
                            <textarea className={inputBaseClass} rows={4} placeholder="¿Qué lograste con este cliente?" value={currentProject.description} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} />
                         </div>

                         <button className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:bg-sky-600 transition-all transform active:scale-95">
                           Finalizar y Guardar
                         </button>
                      </form>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className={cardClass}>
                 <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><Users size={20} className="text-primary"/> Nuestra Propuesta de Valor</h3>
                 <label className={labelBaseClass}>Título del Módulo</label>
                 <input className={`${inputBaseClass} font-black text-xl`} value={localContent.about.sectionTitle} onChange={e => handleInputChange('about', 'sectionTitle', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-6">
                {localContent.about.items.map((item, idx) => (
                  <div key={item.id} className={`${cardClass} flex gap-8 items-start relative overflow-hidden group`}>
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xl shrink-0 shadow-lg group-hover:bg-primary transition-colors duration-500">{idx + 1}</div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className={labelBaseClass}>Pilar de Diferenciación</label>
                        <input className={`${inputBaseClass} font-bold`} value={item.title} onChange={e => handleArrayItemChange('about', idx, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelBaseClass}>Explicación Corta</label>
                        <textarea className={inputBaseClass} rows={2} value={item.description} onChange={e => handleArrayItemChange('about', idx, 'description', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CTA */}
          {activeTab === 'cta' && (
            <div className="space-y-8 max-w-3xl mx-auto animate-fade-in-up">
               <div className={cardClass}>
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><MessageSquare size={20} className="text-primary"/> Cierre de Venta (CTA)</h3>
                  <div className="space-y-6">
                    <div>
                      <label className={labelBaseClass}>Mensaje Impactante</label>
                      <input className={`${inputBaseClass} font-black text-xl`} value={localContent.cta.title} onChange={e => handleInputChange('cta', 'title', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelBaseClass}>Texto Secundario</label>
                      <textarea className={inputBaseClass} rows={4} value={localContent.cta.text} onChange={e => handleInputChange('cta', 'text', e.target.value)} />
                    </div>
                    <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 shadow-inner">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500 text-white rounded-xl"><Phone size={20}/></div>
                        <div>
                          <p className="text-emerald-800 font-black text-sm uppercase tracking-widest leading-none">Canal de Ventas</p>
                          <p className="text-emerald-600 text-[10px] font-bold">WhatsApp Directo</p>
                        </div>
                      </div>
                      <input 
                        className={`${inputBaseClass} font-mono border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500`} 
                        placeholder="Ej: 521234567890" 
                        value={localContent.cta.whatsappNumber} 
                        onChange={e => handleInputChange('cta', 'whatsappNumber', e.target.value)} 
                      />
                      <p className="text-[10px] text-emerald-500 mt-3 font-bold uppercase tracking-tighter">Formato: Código País + Número (Sin el '+')</p>
                    </div>
                  </div>
               </div>

               <div className={cardClass}>
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3"><ImageIcon size={20} className="text-primary"/> Fondos y Estética</h3>
                  <MediaUploader 
                    currentValue={localContent.cta.backgroundImage} 
                    onMediaChange={v => handleInputChange('cta', 'backgroundImage', v)} 
                    label="Imagen Parallax de Contacto" 
                    helper="Esta imagen se verá fija mientras el usuario hace scroll, creando profundidad."
                  />
               </div>
            </div>
          )}

        </div>
      </main>
      
      {/* GLOBAL CSS OVERRIDES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-in forwards; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;