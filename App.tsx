import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import WhyChooseUs from './components/WhyChooseUs';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { ContentProvider, useContent } from './context/ContentContext';

const AdminFlow: React.FC<{ 
  view: 'home' | 'admin' | 'login', 
  setView: (v: 'home' | 'admin' | 'login') => void 
}> = ({ view, setView }) => {
  const { content, isLoaded } = useContent();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Show loading screen while content is loading
  if (!isLoaded || !content) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (content && password === content.adminPassword) {
      setView('admin');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta');
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Administrativo</h2>
          <p className="text-gray-500 text-sm mb-6">Ingresa tu contraseña personalizada para editar el sitio.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {loginError && <p className="text-red-500 text-sm font-medium">{loginError}</p>}
            
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setView('home')}
                className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Volver
              </button>
              <button 
                type="submit" 
                className="w-2/3 bg-primary text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all shadow-lg shadow-primary/20"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return <AdminDashboard onLogout={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Pricing />
        <Portfolio />
        <WhyChooseUs />
        <CTA />
      </main>
      <Footer onAdminClick={() => setView('login')} />
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'admin' | 'login'>('home');

  return (
    <ContentProvider>
      <AdminFlow view={view} setView={setView} />
    </ContentProvider>
  );
};

export default App;