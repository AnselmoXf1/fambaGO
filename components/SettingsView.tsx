import React, { useState, useEffect } from 'react';
import { UserProfile, UserSettings } from '../types';
import { backendService } from '../services/backend';
import { Moon, Sun, Globe, Save, User, Bell, ChevronRight, Monitor } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  
  const [settings, setSettings] = useState<UserSettings>(user.settings || {
    theme: 'light',
    language: 'pt',
    notifications: true
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const updatedUser = await backendService.updateProfile(user.id, {
        ...formData,
        settings: settings
      });
      onUpdate(updatedUser);
      setMessage('Configurações salvas com sucesso!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`h-full flex flex-col relative overflow-hidden ${settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b flex justify-between items-center z-10 shadow-sm ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div>
          <h1 className="text-xl font-bold">Configurações</h1>
          <p className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gerencie sua conta e preferências</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
           <Monitor className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        
        {/* Profile Section */}
        <section>
           <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Perfil</h3>
           <div className={`rounded-2xl border p-4 space-y-4 ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {user.name.charAt(0)}
                 </div>
                 <div>
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.role}</p>
                 </div>
              </div>
              
              <div className="space-y-3">
                 <div>
                    <label className={`block text-xs font-bold mb-1 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nome Completo</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500 transition ${settings.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    />
                 </div>
                 <div>
                    <label className={`block text-xs font-bold mb-1 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>E-mail</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500 transition ${settings.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    />
                 </div>
                 <div>
                    <label className={`block text-xs font-bold mb-1 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Telefone</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500 transition ${settings.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* Appearance Section */}
        <section>
           <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Aparência & Idioma</h3>
           <div className={`rounded-2xl border overflow-hidden ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              
              {/* Theme Toggle */}
              <div className={`p-4 flex items-center justify-between border-b ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-50'}`}>
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-orange-50 text-orange-600'}`}>
                       {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                       <p className="font-bold text-sm">Tema</p>
                       <p className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{settings.theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</p>
                    </div>
                 </div>
                 <div className="flex bg-gray-200 rounded-full p-1 cursor-pointer" onClick={() => setSettings({...settings, theme: settings.theme === 'light' ? 'dark' : 'light'})}>
                    <button className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.theme === 'light' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Light</button>
                    <button className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.theme === 'dark' ? 'bg-gray-800 shadow text-white' : 'text-gray-500'}`}>Dark</button>
                 </div>
              </div>

              {/* Language Toggle */}
              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                       <Globe className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-bold text-sm">Idioma</p>
                       <p className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{settings.language === 'pt' ? 'Português (MZ)' : 'English (US)'}</p>
                    </div>
                 </div>
                 <select 
                   value={settings.language}
                   onChange={e => setSettings({...settings, language: e.target.value as 'pt'|'en'})}
                   className={`text-sm font-bold border-none outline-none cursor-pointer ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                 >
                   <option value="pt">PT</option>
                   <option value="en">EN</option>
                 </select>
              </div>

           </div>
        </section>

        {/* Notifications Section */}
        <section>
           <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Preferências</h3>
           <div className={`rounded-2xl border p-4 flex items-center justify-between ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                    <Bell className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="font-bold text-sm">Notificações</p>
                    <p className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Alertas de viagem e promoções</p>
                 </div>
              </div>
              <div 
                 onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                 className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${settings.notifications ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                 <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${settings.notifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
           </div>
        </section>
      </div>

      {/* Save Button */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${settings.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
         {message && (
           <div className={`mb-3 text-center text-sm font-bold ${message.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>
             {message}
           </div>
         )}
         <button 
           onClick={handleSave}
           disabled={saving}
           className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200/50 hover:bg-orange-700 transition active:scale-95 flex items-center justify-center gap-2"
         >
           {saving ? 'Salvando...' : (
             <>
               <Save className="w-5 h-5" /> Salvar Alterações
             </>
           )}
         </button>
      </div>

    </div>
  );
};