import React, { useState, useEffect } from 'react';
import { PassengerView } from './components/PassengerView';
import { DriverView } from './components/DriverView';
import { AdminView } from './components/AdminView';
import { AgentView } from './components/AgentView';
import { AuthView } from './components/AuthView';
import { SettingsView } from './components/SettingsView';
import { UserRole, UserProfile } from './types';
import { Menu, LogOut, Bike, Shield, Settings } from 'lucide-react';
import { backendService } from './services/backend';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'MAIN' | 'SETTINGS'>('MAIN');

  // Check for persistent session on mount
  useEffect(() => {
    const sessionUser = backendService.getSession();
    if (sessionUser) {
      setUser(sessionUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    setIsAuthenticated(true);
    setCurrentView('MAIN');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    backendService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setMenuOpen(false);
    setCurrentView('MAIN');
  };

  const renderView = () => {
    if (!isAuthenticated || !user) {
      return <AuthView onLogin={handleLogin} />;
    }

    if (currentView === 'SETTINGS') {
      return <SettingsView user={user} onUpdate={handleUpdateUser} />;
    }

    switch (user.role) {
      case UserRole.PASSENGER: return <PassengerView user={user} />;
      case UserRole.GUEST: return <PassengerView user={user} />;
      case UserRole.DRIVER: return <DriverView />;
      case UserRole.ADMIN: return <AdminView />;
      case UserRole.AGENT: return <AgentView />;
      default: return <PassengerView user={user} />;
    }
  };

  // Theme Wrapper Class
  const themeClass = user?.settings?.theme === 'dark' ? 'dark' : '';

  return (
    <div className={`flex justify-center items-center min-h-screen p-0 sm:p-4 font-inter transition-colors duration-300 ${user?.settings?.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'}`}>
      {/* Mobile Frame Container */}
      <div className={`w-full h-[100dvh] sm:h-[850px] sm:w-[400px] shadow-2xl relative overflow-hidden flex flex-col border-4 transition-colors duration-300 ${user?.settings?.theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-800/10'} sm:rounded-[40px]`}>
        
        {/* Header / Nav - Only show if authenticated */}
        {isAuthenticated && (
          <header className={`backdrop-blur-md z-50 px-6 py-4 flex justify-between items-center absolute top-0 left-0 right-0 border-b transition-colors duration-300 ${user?.settings?.theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-100'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                 <Bike className="w-5 h-5" />
              </div>
              <span className={`font-bold text-xl tracking-tight ${user?.settings?.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Famba<span className="text-orange-600">Go</span></span>
              {user?.role === UserRole.GUEST && (
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ml-1 ${user?.settings?.theme === 'dark' ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>Visitante</span>
              )}
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2 rounded-full transition ${user?.settings?.theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
              <Menu className="w-6 h-6" />
            </button>
          </header>
        )}

        {/* Menu Dropdown */}
        {menuOpen && isAuthenticated && (
          <div className={`absolute top-16 right-4 w-64 rounded-2xl shadow-xl border z-50 animate-fade-in p-2 ${user?.settings?.theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`}>
            <div className={`px-3 py-3 border-b mb-2 ${user?.settings?.theme === 'dark' ? 'border-gray-700' : 'border-gray-50'}`}>
              <p className={`text-sm font-bold ${user?.settings?.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <div className={`mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${user?.settings?.theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                {user?.role === UserRole.AGENT ? <><Shield className="w-3 h-3 mr-1"/> Agente</> : user?.role}
              </div>
            </div>
            
            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Conta</div>
            
            <button 
              onClick={() => { setCurrentView('MAIN'); setMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${user?.settings?.theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <Bike className="w-4 h-4" /> Início
            </button>
            
            <button 
              onClick={() => { setCurrentView('SETTINGS'); setMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${user?.settings?.theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <Settings className="w-4 h-4" /> Configurações
            </button>

            <div className={`my-2 border-b ${user?.settings?.theme === 'dark' ? 'border-gray-700' : 'border-gray-50'}`}></div>

            <button 
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-hidden ${isAuthenticated ? 'pt-16' : ''} ${user?.settings?.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {renderView()}
        </main>

        {/* Bottom Home Indicator (iOS style) */}
        <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full z-50 ${user?.settings?.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
      </div>
    </div>
  );
};

export default App;