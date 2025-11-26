import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Shield, Wallet, Star, AlertTriangle, Clock, User, Calendar, X, LogIn } from 'lucide-react';
import { RideStatus, RideType, Location, RideRequest, Driver, SafetyAlert, UserProfile, UserRole } from '../types';
import { getSafetyInsights } from '../services/geminiService';
import { backendService } from '../services/backend';

const LOCATIONS: Location[] = [
  { id: '1', name: 'Mercado Central Inhambane', lat: -23.865, lng: 35.383 },
  { id: '2', name: 'Praia do Tofo', lat: -23.854, lng: 35.545 },
  { id: '3', name: 'Maxixe Terminal', lat: -23.859, lng: 35.347 },
  { id: '4', name: 'Aeroporto Inhambane', lat: -23.874, lng: 35.399 },
];

const RIDE_OPTIONS = [
  { type: RideType.QUICK, pricePerKm: 20, icon: Clock, desc: "A mais rápida" },
  { type: RideType.SAFE, pricePerKm: 25, icon: Shield, desc: "Motoristas top-rated" },
  { type: RideType.ECO, pricePerKm: 18, icon: Navigation, desc: "Rota econômica" },
  { type: RideType.SHARED, pricePerKm: 15, icon: User, desc: "Dividir corrida" },
];

interface PassengerViewProps {
  user?: UserProfile;
}

export const PassengerView: React.FC<PassengerViewProps> = ({ user }) => {
  const [status, setStatus] = useState<RideStatus>(RideStatus.IDLE);
  const [pickup, setPickup] = useState<string>(LOCATIONS[0].id);
  const [dropoff, setDropoff] = useState<string>(LOCATIONS[1].id);
  const [selectedType, setSelectedType] = useState<RideType>(RideType.QUICK);
  const [safetyAlert, setSafetyAlert] = useState<SafetyAlert | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);

  // Scheduling State
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduledRides, setScheduledRides] = useState<RideRequest[]>([]);
  const [showScheduleList, setShowScheduleList] = useState(false);
  const [showGuestAlert, setShowGuestAlert] = useState(false);

  // Simulation State
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // Load scheduled rides from backend
  useEffect(() => {
    if (user?.role !== UserRole.GUEST) {
      loadScheduledRides();
    }
  }, [user]);

  const loadScheduledRides = async () => {
    if (user?.id) {
      const rides = await backendService.getRides(user.id);
      setScheduledRides(rides.filter(r => r.status === RideStatus.SCHEDULED));
    }
  };

  const calculatePrice = () => {
    const type = RIDE_OPTIONS.find(r => r.type === selectedType);
    const distance = 8.5; 
    return type ? Math.round(distance * type.pricePerKm) : 0;
  };

  const handleRequestRide = async () => {
    // Guest Check
    if (user?.role === UserRole.GUEST) {
      setShowGuestAlert(true);
      return;
    }

    const pLoc = LOCATIONS.find(l => l.id === pickup)!;
    const dLoc = LOCATIONS.find(l => l.id === dropoff)!;
    const price = calculatePrice();
    
    // Create base request object
    const request: RideRequest = {
      userId: user?.id,
      pickup: pLoc,
      dropoff: dLoc,
      type: selectedType,
      price: price,
      distance: 8.5,
      status: RideStatus.SEARCHING
    };

    if (isScheduling && scheduleDate) {
      // Handle Scheduled Ride via Backend
      const newRide: RideRequest = {
        ...request,
        scheduledTime: scheduleDate,
        status: RideStatus.SCHEDULED
      };
      
      await backendService.createRide(newRide);
      await loadScheduledRides();
      
      setIsScheduling(false);
      setScheduleDate('');
      setShowScheduleList(true); // Open the list to show confirmation
      return;
    }

    // Immediate Ride
    setStatus(RideStatus.SEARCHING);
    // AI Insights
    const insights = await getSafetyInsights(request, "Noite", "Chuvoso");
    setSafetyAlert(insights);

    // Simulate finding driver
    setTimeout(() => {
      setDriver({
        id: 'd1',
        name: 'João M.',
        rating: 4.8,
        ridesCompleted: 1240,
        vehiclePlate: 'ABC-123-MC',
        avatar: 'https://picsum.photos/id/64/100/100',
        isOnline: true,
        location: { id: 'x', name: 'Nearby', lat: 0, lng: 0 },
        points: 120,
        level: 'Bronze'
      });
      setStatus(RideStatus.ACCEPTED);
    }, 2500);
  };

  useEffect(() => {
    if (status === RideStatus.ACCEPTED) {
      const interval = setInterval(() => {
        setSimulatedProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus(RideStatus.COMPLETED);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  if (status === RideStatus.COMPLETED) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-white">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <Star className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chegou ao destino!</h2>
        <p className="text-gray-500 mb-6">Como foi a viagem com {driver?.name}?</p>
        <div className="flex gap-2 mb-8">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className="w-8 h-8 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition" />
          ))}
        </div>
        <button 
          onClick={() => { setStatus(RideStatus.IDLE); setSimulatedProgress(0); setDriver(null); }}
          className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Nova Corrida
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col bg-gray-50">
      {/* Guest Alert Modal */}
      {showGuestAlert && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
           <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                <LogIn className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Crie uma conta</h3>
              <p className="text-gray-500 text-sm mb-6">Para solicitar corridas e garantir sua segurança, você precisa estar logado na plataforma.</p>
              <button 
                onClick={() => window.location.reload()} // Quick way to reset to auth in this demo
                className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition"
              >
                Fazer Login
              </button>
              <button 
                onClick={() => setShowGuestAlert(false)}
                className="mt-4 text-gray-400 text-sm font-semibold hover:text-gray-600"
              >
                Continuar apenas vendo
              </button>
           </div>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="flex-1 bg-gray-200 relative overflow-hidden">
        <img 
          src="https://picsum.photos/800/600?grayscale" 
          alt="Map" 
          className="w-full h-full object-cover opacity-40" 
        />
        
        {/* Mock Map Elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
                 <div className="absolute w-64 h-64 bg-orange-500/10 rounded-full blur-2xl -top-20 -left-20 animate-pulse"></div>
                 <MapPin className="text-orange-600 w-10 h-10 drop-shadow-lg" fill="currentColor" />
             </div>
        </div>

        {/* Schedule List Modal */}
        {showScheduleList && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Minhas Viagens Agendadas</h3>
              <button onClick={() => setShowScheduleList(false)} className="p-2 bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {scheduledRides.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">Nenhuma viagem agendada.</div>
            ) : (
              <div className="space-y-4">
                {scheduledRides.map((ride, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(ride.scheduledTime!).toLocaleString()}
                      </div>
                      <p className="text-sm font-medium text-gray-800">{ride.pickup.name} <span className="text-gray-400">➔</span> {ride.dropoff.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold">{ride.price} MT</p>
                       <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Aguardando</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Top Floating Button for Scheduled Rides */}
        {status === RideStatus.IDLE && user?.role !== UserRole.GUEST && (
          <button 
            onClick={() => setShowScheduleList(true)}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg z-10 text-orange-600 border border-orange-100"
          >
            <Calendar className="w-6 h-6" />
            {scheduledRides.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {scheduledRides.length}
              </span>
            )}
          </button>
        )}

        {/* Status Overlay */}
        {(status === RideStatus.ACCEPTED || status === RideStatus.IN_PROGRESS) && (
           <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-orange-100 z-10">
              <div className="flex items-center gap-4">
                <img src={driver?.avatar} alt={driver?.name} className="w-12 h-12 rounded-full border-2 border-orange-500" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{driver?.name}</h3>
                  <p className="text-xs text-gray-500">{driver?.vehiclePlate} • Honda Ace 125</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500 font-bold text-sm">
                    <Star className="w-3 h-3 fill-current mr-1" /> {driver?.rating}
                  </div>
                  <span className="text-xs font-mono bg-gray-100 px-1 rounded">5 min</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000 ease-linear" 
                  style={{ width: `${simulatedProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-xs text-orange-600 mt-1 font-medium">
                {simulatedProgress < 20 ? "Motorista a caminho" : "Em viagem para o destino"}
              </p>
           </div>
        )}

        {/* Safety Alert Widget */}
        {safetyAlert && (status === RideStatus.ACCEPTED || status === RideStatus.SEARCHING) && (
          <div className={`absolute top-28 left-4 right-4 p-3 rounded-lg shadow-md border-l-4 z-10 animate-fade-in ${
            safetyAlert.level === 'high' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">FambaGo IA: {safetyAlert.message}</p>
                <p className="text-xs mt-0.5">{safetyAlert.tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ride Request Sheet */}
      {status === RideStatus.IDLE && (
        <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 z-20">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setIsScheduling(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${!isScheduling ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              Agora
            </button>
            <button 
              onClick={() => setIsScheduling(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${isScheduling ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              Agendar
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Navigation className="w-4 h-4" />
              </div>
              <select 
                value={pickup} 
                onChange={(e) => setPickup(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700"
              >
                {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <MapPin className="w-4 h-4" />
              </div>
              <select 
                value={dropoff} 
                onChange={(e) => setDropoff(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700"
              >
                {LOCATIONS.filter(l => l.id !== pickup).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>

            {/* DateTime Picker if Scheduling */}
            {isScheduling && (
              <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100 animate-fade-in">
                <Calendar className="w-5 h-5 text-orange-600" />
                <input 
                  type="datetime-local" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium text-gray-800 w-full"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 ml-1">Tipo de Viagem</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {RIDE_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setSelectedType(opt.type)}
                  className={`flex flex-col items-center min-w-[90px] p-3 rounded-xl border transition-all ${
                    selectedType === opt.type 
                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' 
                    : 'border-gray-200 bg-white hover:border-orange-200'
                  }`}
                >
                  <opt.icon className={`w-6 h-6 mb-2 ${selectedType === opt.type ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className="text-xs font-bold text-gray-700">{opt.type}</span>
                  <span className="text-[10px] text-gray-400 mt-1">~{Math.round(8.5 * opt.pricePerKm)} MT</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">M-Pesa</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {calculatePrice()} <span className="text-sm font-normal text-gray-500">MT</span>
            </div>
          </div>

          <button 
            onClick={handleRequestRide}
            disabled={isScheduling && !scheduleDate}
            className={`w-full py-4 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
              isScheduling && !scheduleDate 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200 active:scale-95'
            }`}
          >
            {isScheduling ? 'Agendar Corrida' : 'Confirmar FambaGo'}
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      )}

      {status === RideStatus.SEARCHING && (
        <div className="absolute inset-0 z-30 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Procurando Moto...</h3>
            <p className="text-gray-500 text-sm max-w-xs">Nossa IA está encontrando o motorista mais seguro e próximo para você.</p>
            <button 
              onClick={() => setStatus(RideStatus.IDLE)} 
              className="mt-8 text-sm text-red-500 font-semibold underline"
            >
              Cancelar
            </button>
        </div>
      )}

      {/* Panic Button - Only for registered users on active ride */}
      {status !== RideStatus.IDLE && status !== RideStatus.COMPLETED && user?.role !== UserRole.GUEST && (
        <button className="absolute bottom-24 right-4 w-14 h-14 bg-red-600 rounded-full shadow-xl flex items-center justify-center text-white z-40 animate-pulse border-4 border-white">
          <AlertTriangle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
