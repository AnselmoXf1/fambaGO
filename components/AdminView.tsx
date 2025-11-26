import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, ShieldAlert, Activity, Map as MapIcon } from 'lucide-react';

const DATA = [
  { name: 'Seg', rides: 120, revenue: 12000 },
  { name: 'Ter', rides: 145, revenue: 15400 },
  { name: 'Qua', rides: 100, revenue: 9800 },
  { name: 'Qui', rides: 180, revenue: 19500 },
  { name: 'Sex', rides: 240, revenue: 28000 },
  { name: 'Sáb', rides: 290, revenue: 35000 },
  { name: 'Dom', rides: 210, revenue: 24000 },
];

export const AdminView: React.FC = () => {
  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Visão geral de Inhambane & Maxixe</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
          Admin
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-4 h-4" /></div>
             <span className="text-gray-500 text-xs font-bold uppercase">Ativos</span>
           </div>
           <p className="text-2xl font-bold text-gray-800">142</p>
           <p className="text-xs text-green-500 font-medium">+12% vs ontem</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-red-50 rounded-lg text-red-600"><ShieldAlert className="w-4 h-4" /></div>
             <span className="text-gray-500 text-xs font-bold uppercase">Alertas</span>
           </div>
           <p className="text-2xl font-bold text-gray-800">3</p>
           <p className="text-xs text-gray-400 font-medium">Zonas de risco</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-green-50 rounded-lg text-green-600"><Activity className="w-4 h-4" /></div>
             <span className="text-gray-500 text-xs font-bold uppercase">Receita</span>
           </div>
           <p className="text-2xl font-bold text-gray-800">28K</p>
           <p className="text-xs text-gray-400 font-medium">MT (24h)</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><MapIcon className="w-4 h-4" /></div>
             <span className="text-gray-500 text-xs font-bold uppercase">Corridas</span>
           </div>
           <p className="text-2xl font-bold text-gray-800">850</p>
           <p className="text-xs text-gray-400 font-medium">Total hoje</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-800 mb-6">Receita Semanal (MT)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#fef7ec'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Alertas Recentes</h3>
          <span className="text-xs text-orange-600 font-bold cursor-pointer">Ver todos</span>
        </div>
        <div className="divide-y divide-gray-100">
          {[1,2,3].map((_, i) => (
             <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                 <ShieldAlert className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-gray-800">Velocidade Excessiva</p>
                 <p className="text-xs text-gray-500">Motorista: Pedro S. • Zona: Estrada N1</p>
               </div>
               <span className="text-xs text-gray-400 whitespace-nowrap">há {i * 15 + 5} min</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};