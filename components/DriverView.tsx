import React, { useState, useEffect } from 'react';
import { Power, MapPin, Award, TrendingUp, Navigation, Calendar, Home, Gift, Star, CheckCircle } from 'lucide-react';
import { Reward, Driver, RideRequest, RideStatus } from '../types';
import { backendService } from '../services/backend';

const MOCK_REWARDS: Reward[] = [
  { id: '1', title: '500MT Combustível', cost: 500, description: 'Voucher para qualquer posto Petromoc.', icon: '⛽' },
  { id: '2', title: 'Comissão Zero (24h)', cost: 1200, description: '100% dos ganhos por um dia inteiro.', icon: '💰' },
  { id: '3', title: 'Kit Manutenção', cost: 2000, description: 'Óleo e revisão básica grátis.', icon: '🔧' },
];

type Tab = 'HOME' | 'SCHEDULE' | 'REWARDS';

export const DriverView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [isOnline, setIsOnline] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [scheduledRides, setScheduledRides] = useState<RideRequest[]>([]);

  useEffect(() => {
    loadDriverData();
    const interval = setInterval(loadDriverData, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const loadDriverData = async () => {
    const stats = await backendService.getDriverStats();
    setDriver(stats);
    
    // In a real app, you'd fetch "available" rides, here we just get all scheduled ones
    const rides = await backendService.getRides();
    setScheduledRides(rides.filter(r => r.status === RideStatus.SCHEDULED));
  };

  const handleRedeem = async (cost: number) => {
    if (driver && driver.points >= cost) {
       await backendService.updateDriverPoints(-cost);
       loadDriverData();
       alert('Recompensa resgatada com sucesso!');
    }
  };

  // Mock Request Logic
  const triggerMockRequest = () => {
    if (!isOnline) return;
    setTimeout(() => {
      setHasRequest(true);
    }, 2000);
  };

  React.useEffect(() => {
    if (isOnline) {
      triggerMockRequest();
    } else {
      setHasRequest(false);
    }
  }, [isOnline]);

  if (!driver) return <div className="p-6 text-center">Carregando perfil...</div>;

  const renderHome = () => (
    <>
      <div className="absolute inset-0 top-0 m-4 rounded-3xl bg-gray-200 overflow-hidden border-4 border-white shadow-inner mb-24">
           <img 
            src="https://picsum.photos/800/600?blur=2" 
            className="w-full h-full object-cover opacity-30" 
            alt="Map"
           />
           {isOnline && !hasRequest && (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-64 h-64 bg-orange-500/10 rounded-full animate-ping absolute"></div>
               <div className="w-32 h-32 bg-orange-500/20 rounded-full animate-pulse absolute"></div>
               <div className="bg-white p-3 rounded-full shadow-lg z-10">
                 <Navigation className="w-6 h-6 text-orange-600" fill="currentColor" />
               </div>
               <p className="absolute mt-24 text-gray-600 font-medium text-sm bg-white/80 px-3 py-1 rounded-full">Procurando passageiros...</p>
             </div>
           )}
      </div>

      {hasRequest && (
          <div className="absolute bottom-28 left-6 right-6 bg-white p-5 rounded-2xl shadow-2xl border border-orange-100 animate-slide-up z-20">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold uppercase">Nova Corrida</span>
              <span className="text-gray-500 text-sm font-mono">2.4 km</span>
            </div>
            <div className="space-y-4 mb-6">
               <div className="flex items-start gap-3">
                 <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-md"></div>
                 <div>
                   <p className="text-xs text-gray-400 font-bold uppercase">Recolha</p>
                   <p className="text-gray-800 font-medium">Mercado Central</p>
                 </div>
               </div>
               <div className="w-0.5 h-6 bg-gray-200 ml-1"></div>
               <div className="flex items-start gap-3">
                 <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-md"></div>
                 <div>
                   <p className="text-xs text-gray-400 font-bold uppercase">Destino</p>
                   <p className="text-gray-800 font-medium">Praia do Tofo</p>
                 </div>
               </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setHasRequest(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold">Ignorar</button>
              <button className="flex-[2] py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg">Aceitar</button>
            </div>
          </div>
      )}

      {!hasRequest && (
          <div className="absolute bottom-24 left-6 right-6 z-20">
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`w-full py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                isOnline ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              <Power className="w-5 h-5" />
              <span className="font-bold text-lg">{isOnline ? 'Ficar Offline' : 'Ficar Online'}</span>
            </button>
          </div>
      )}
    </>
  );

  const renderRewards = () => (
    <div className="p-6 pb-24 h-full overflow-y-auto">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Seus FambaPoints</p>
            <h2 className="text-4xl font-bold">{driver.points}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Award className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
        <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider">
           <span>Nível {driver.level}</span>
           <span>Próximo: Ouro (1000 pts)</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2">
           <div className="bg-yellow-400 h-2 rounded-full" style={{width: '85%'}}></div>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mb-4 text-lg">Recompensas Disponíveis</h3>
      <div className="space-y-4">
        {MOCK_REWARDS.map(reward => (
          <div key={reward.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl">
              {reward.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{reward.title}</h4>
              <p className="text-xs text-gray-500 mb-2">{reward.description}</p>
              <div className="flex items-center justify-between">
                 <span className="text-orange-600 font-bold text-sm">{reward.cost} pts</span>
                 <button 
                   onClick={() => handleRedeem(reward.cost)}
                   disabled={driver.points < reward.cost}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold ${driver.points >= reward.cost ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                 >
                   Resgatar
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="p-6 pb-24 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Corridas Agendadas</h2>
      <p className="text-gray-500 text-sm mb-6">Garanta corridas futuras e planeje seu dia.</p>
      
      {scheduledRides.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">Nenhuma corrida disponível no momento.</div>
      ) : (
        <div className="space-y-4">
          {scheduledRides.map(ride => (
            <div key={ride.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                  <Calendar className="w-3 h-3" /> {new Date(ride.scheduledTime!).toLocaleString()}
                </div>
                <span className="font-bold text-gray-900">{ride.price} MT</span>
              </div>
              <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-bold text-gray-400 text-xs uppercase mr-2">De</span> {ride.pickup.name}</p>
                  <p className="text-sm text-gray-600"><span className="font-bold text-gray-400 text-xs uppercase mr-2">Para</span> {ride.dropoff.name}</p>
              </div>
              <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition">
                Aceitar Agendamento
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col relative">
      {/* Header Stats (Only show on Home) */}
      {activeTab === 'HOME' && (
        <div className="bg-white px-6 pt-6 pb-6 rounded-b-[2rem] shadow-sm z-10 flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Olá, {driver.name}</h1>
              <p className="text-gray-400 text-sm">{driver.vehiclePlate} • Nível {driver.level}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
               <img src={driver.avatar} alt="Avatar" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex flex-col items-center">
              <span className="text-orange-600 text-lg font-bold">1.250</span>
              <span className="text-orange-400 text-[10px] uppercase font-bold">Ganhos MT</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center shadow-sm">
              <div className="flex items-center text-gray-800 font-bold text-lg">
                 4.9 <Star className="w-3 h-3 ml-1 text-yellow-500 fill-current" />
              </div>
              <span className="text-gray-400 text-[10px] uppercase font-bold">Nota</span>
            </div>
             <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex flex-col items-center cursor-pointer" onClick={() => setActiveTab('REWARDS')}>
              <span className="text-indigo-600 text-lg font-bold">{driver.points}</span>
              <span className="text-indigo-400 text-[10px] uppercase font-bold">Pontos</span>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'HOME' && renderHome()}
        {activeTab === 'SCHEDULE' && renderSchedule()}
        {activeTab === 'REWARDS' && renderRewards()}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-30 pb-6 rounded-t-2xl shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setActiveTab('HOME')}
          className={`flex flex-col items-center gap-1 transition ${activeTab === 'HOME' ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'HOME' && 'fill-current'}`} />
          <span className="text-[10px] font-bold">Início</span>
        </button>
        <button 
          onClick={() => setActiveTab('SCHEDULE')}
          className={`flex flex-col items-center gap-1 transition ${activeTab === 'SCHEDULE' ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <Calendar className={`w-6 h-6 ${activeTab === 'SCHEDULE' && 'fill-current'}`} />
          <span className="text-[10px] font-bold">Agenda</span>
        </button>
        <button 
          onClick={() => setActiveTab('REWARDS')}
          className={`flex flex-col items-center gap-1 transition ${activeTab === 'REWARDS' ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <Gift className={`w-6 h-6 ${activeTab === 'REWARDS' && 'fill-current'}`} />
          <span className="text-[10px] font-bold">Prêmios</span>
        </button>
      </div>
    </div>
  );
};
