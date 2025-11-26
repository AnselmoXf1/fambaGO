import React, { useState } from 'react';
import { Bike, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, UserCheck, Eye, LogIn, AlertCircle } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { backendService } from '../services/backend';

interface AuthViewProps {
  onLogin: (user: UserProfile) => void;
}

type AuthStep = 'WELCOME' | 'LOGIN' | 'REGISTER' | 'RECOVERY' | 'MFA';

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('WELCOME');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: UserRole.PASSENGER
  });

  const handleGuestAccess = async () => {
    setLoading(true);
    try {
      const user = await backendService.login('guest@fambago.mz');
      onLogin(user);
    } catch (e) {
      setError('Erro ao entrar como visitante');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Validate with backend
      await backendService.login(formData.email, formData.password);
      setStep('MFA');
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError('');
    try {
      const user = await backendService.socialLogin(provider);
      onLogin(user);
    } catch (err: any) {
      setError('Erro ao autenticar com rede social.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Register with backend
      await backendService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      setStep('MFA');
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    if (!formData.email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await backendService.recoverPassword(formData.email);
      setSuccessMsg('Se o e-mail estiver cadastrado, você receberá um link de recuperação em breve.');
    } catch (err: any) {
      setError('Ocorreu um erro ao tentar recuperar a senha.');
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    setLoading(true);
    // Simulate MFA verification
    setTimeout(async () => {
      setLoading(false);
      const user = backendService.getSession();
      if (user) onLogin(user);
    }, 1500);
  };

  // --- Sub-components ---

  const SocialButton = ({ icon, text, provider }: { icon: string, text: string, provider: 'google' | 'facebook' }) => (
    <button 
      type="button" 
      onClick={() => handleSocialLogin(provider)}
      disabled={loading}
      className="w-full py-3 px-4 rounded-xl border border-gray-200 flex items-center justify-center gap-2 font-medium transition hover:bg-gray-50 bg-white disabled:opacity-50"
    >
      <img src={icon} alt="" className="w-5 h-5" />
      <span className="text-gray-700 text-sm">{text}</span>
    </button>
  );

  const WelcomeScreen = () => (
    <div className="flex flex-col h-full bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-orange-50">
        <div className="w-24 h-24 bg-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-200 rotate-3 transform transition hover:rotate-6">
          <Bike className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Famba<span className="text-orange-600">Go</span></h1>
        <p className="text-gray-500 max-w-xs leading-relaxed">A mobilidade segura e inteligente para Inhambane e Maxixe.</p>
      </div>
      <div className="p-8 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] -mt-10">
        <div className="space-y-4">
          <button 
            onClick={() => setStep('LOGIN')}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center gap-2"
          >
            Entrar
          </button>
          <button 
            onClick={() => setStep('REGISTER')}
            className="w-full py-4 bg-orange-100 text-orange-700 rounded-2xl font-bold hover:bg-orange-200 transition"
          >
            Criar Conta
          </button>
          <button 
            onClick={handleGuestAccess}
            className="w-full py-3 text-gray-400 font-semibold hover:text-gray-600 transition text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Continuar como visitante
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 font-medium">© 2025 FambaGo Inc.</p>
          <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-wider">Developed by Anselmo Dora Bistiro Gulane</p>
        </div>
      </div>
    </div>
  );

  const MFAScreen = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center animate-slide-up">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificação de Segurança</h2>
      <p className="text-gray-500 mb-8">Enviamos um código de 6 dígitos para seu e-mail ou SMS.</p>
      
      <div className="flex gap-2 mb-8 justify-center">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <input 
            key={i} 
            type="text" 
            maxLength={1}
            autoFocus={i === 1}
            className="w-10 h-12 border-2 border-gray-100 rounded-lg text-center text-xl font-bold focus:border-orange-500 focus:bg-orange-50 outline-none transition" 
          />
        ))}
      </div>

      <button 
        onClick={verifyMFA}
        disabled={loading}
        className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        {loading ? 'Verificando...' : 'Confirmar Acesso'}
      </button>
    </div>
  );

  if (step === 'WELCOME') return <WelcomeScreen />;
  if (step === 'MFA') return <MFAScreen />;

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Mini Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <button onClick={() => { setStep('WELCOME'); setSuccessMsg(''); setError(''); }} className="text-gray-400 hover:text-gray-900 font-medium text-sm">Cancel</button>
        <span className="font-bold text-lg text-gray-900">Famba<span className="text-orange-600">Go</span></span>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 px-8 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {step === 'LOGIN' ? 'Bem-vindo de volta' : (step === 'RECOVERY' ? 'Recuperação' : 'Crie sua conta')}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 animate-fade-in">
            {successMsg}
          </div>
        )}

        {step === 'RECOVERY' ? (
          <div className="animate-fade-in">
             <p className="text-gray-500 mb-6">Informe seu e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha.</p>
             <div className="relative mb-6">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Seu E-mail"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition"
                />
              </div>
              <button 
                onClick={handleRecovery}
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition disabled:opacity-70"
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
              
              <div className="mt-4 text-center">
                  <button onClick={() => setStep('LOGIN')} className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                    Voltar para o Login
                  </button>
              </div>
          </div>
        ) : (
          <form onSubmit={step === 'LOGIN' ? handleLogin : handleRegister} className="space-y-4 animate-slide-up">
            {step === 'REGISTER' && (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Nome Completo"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    placeholder="Telemóvel (+258...)"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition"
                    required
                  />
                </div>
                
                {/* Role Selection */}
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Selecione seu Perfil</label>
                   <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: UserRole.PASSENGER, icon: User, label: 'Cidadão' },
                      { role: UserRole.DRIVER, icon: Bike, label: 'Motorista' },
                      { role: UserRole.AGENT, icon: UserCheck, label: 'Agente' }
                    ].map(({role, icon: Icon, label}) => (
                      <button 
                        key={role}
                        type="button"
                        onClick={() => setFormData({...formData, role})}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${formData.role === role ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-400'}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="Seu E-mail"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="Senha"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition"
                required
              />
            </div>

            {step === 'LOGIN' && (
              <div className="text-right">
                  <button type="button" onClick={() => { setStep('RECOVERY'); setError(''); setSuccessMsg(''); }} className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                    Esqueceu a senha?
                  </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : (
                <>
                  {step === 'LOGIN' ? 'Acessar Conta' : 'Finalizar Cadastro'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
        
        {step !== 'RECOVERY' && (
          <div className="mt-8 animate-fade-in delay-100">
            <div className="relative flex justify-center text-sm mb-4">
                <span className="px-2 bg-white text-gray-400 text-xs uppercase font-bold">Ou entre com</span>
                <div className="absolute inset-0 flex items-center -z-10">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SocialButton 
                provider="google"
                icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                text="Google" 
              />
              <SocialButton 
                provider="facebook"
                icon="https://upload.wikimedia.org/wikipedia/commons/1/16/Facebook-icon-1.png" 
                text="Facebook" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};