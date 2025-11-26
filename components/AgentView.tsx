import React, { useState, useEffect } from 'react';
import { Map, ShieldAlert, FileText, CheckCircle, Clock, AlertTriangle, Plus, Search } from 'lucide-react';
import { IncidentReport } from '../types';
import { backendService } from '../services/backend';

export const AgentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'REPORTS'>('REPORTS');
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReportData, setNewReportData] = useState({ type: 'Infração', description: '', location: '' });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await backendService.getReports();
    setReports(data);
  };

  const handleSubmitReport = async () => {
    await backendService.createReport({
      ...newReportData,
      id: '', // Backend handles ID
      time: new Date().toLocaleTimeString('pt-MZ', {hour: '2-digit', minute:'2-digit'}),
      status: 'Pendente'
    } as IncidentReport);
    
    setShowNewReportModal(false);
    setNewReportData({ type: 'Infração', description: '', location: '' });
    loadReports();
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Portal do Agente</h1>
          <p className="text-xs text-gray-500">Município de Inhambane</p>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
           <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-6 pb-2 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('REPORTS')}
          className={`flex-1 pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'REPORTS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
        >
          Denúncias & Ocorrências
        </button>
        <button 
          onClick={() => setActiveTab('MAP')}
          className={`flex-1 pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'MAP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
        >
          Monitoramento
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {activeTab === 'REPORTS' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                <p className="text-orange-800 text-2xl font-bold">{reports.filter(r => r.status === 'Pendente').length}</p>
                <p className="text-xs text-orange-600 font-bold uppercase">Pendentes</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                <p className="text-green-800 text-2xl font-bold">{reports.filter(r => r.status === 'Resolvido').length}</p>
                <p className="text-xs text-green-600 font-bold uppercase">Resolvidos</p>
              </div>
            </div>

            {/* Filter */}
            <div className="relative mb-4">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
               <input type="text" placeholder="Buscar ocorrência..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>

            {/* List */}
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                 <div className="flex justify-between items-start">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                     report.type === 'Acidente' ? 'bg-red-100 text-red-600' : 
                     report.type === 'Infração' ? 'bg-orange-100 text-orange-600' : 
                     'bg-gray-100 text-gray-600'
                   }`}>
                     {report.type}
                   </span>
                   <span className={`flex items-center gap-1 text-xs font-bold ${report.status === 'Resolvido' ? 'text-green-600' : 'text-yellow-600'}`}>
                     {report.status === 'Resolvido' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                     {report.status}
                   </span>
                 </div>
                 <h3 className="font-bold text-gray-800 text-sm">{report.location}</h3>
                 <p className="text-xs text-gray-500 line-clamp-2">{report.description}</p>
                 <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                   <span className="text-xs text-gray-400">{report.time}</span>
                   <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Ver Detalhes</button>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'MAP' && (
          <div className="h-full bg-gray-200 rounded-xl relative overflow-hidden border-2 border-white shadow-inner">
             <img src="https://picsum.photos/800/800?grayscale" className="w-full h-full object-cover opacity-50" alt="Map Mockup" />
             
             {/* Mock Elements on Map */}
             <div className="absolute top-1/4 left-1/4">
               <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping absolute"></div>
               <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white relative"></div>
             </div>
             <div className="absolute bottom-1/3 right-1/4">
               <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
             </div>
             
             <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Status da Frota</p>
                <div className="flex justify-between text-sm">
                   <span className="font-bold text-green-600">● 142 Online</span>
                   <span className="font-bold text-gray-400">● 38 Offline</span>
                   <span className="font-bold text-red-500">● 2 Críticos</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* FAB for New Report */}
      <button 
        onClick={() => setShowNewReportModal(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-300 flex items-center justify-center text-white hover:bg-blue-700 transition active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
           <div className="bg-white w-full rounded-2xl p-6 animate-slide-up shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Nova Ocorrência</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                  <select 
                    value={newReportData.type}
                    onChange={e => setNewReportData({...newReportData, type: e.target.value})}
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  >
                    <option>Infração</option>
                    <option>Acidente</option>
                    <option>Via Danificada</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Localização</label>
                  <input 
                    type="text"
                    value={newReportData.location}
                    onChange={e => setNewReportData({...newReportData, location: e.target.value})}
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    placeholder="Ex: Av. Eduardo Mondlane"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Descrição</label>
                  <textarea 
                    value={newReportData.description}
                    onChange={e => setNewReportData({...newReportData, description: e.target.value})}
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-24 resize-none" 
                    placeholder="Descreva o ocorrido..."
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewReportModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl">Cancelar</button>
                <button onClick={handleSubmitReport} className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl">Registrar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
