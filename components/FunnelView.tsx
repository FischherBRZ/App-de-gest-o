
import React, { useState } from 'react';
import { Lead, Stage } from '../types';
import LeadCard from './LeadCard';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface FunnelViewProps {
  leads: Lead[];
  stages: Stage[];
  onSelectLead: (id: string) => void;
  onMoveLead: (id: string, stageId: string) => void;
}

const FunnelView: React.FC<FunnelViewProps> = ({ leads, stages, onSelectLead, onMoveLead }) => {
  const [expandedStages, setExpandedStages] = useState<string[]>(stages.slice(0, 2).map(s => s.id));

  const toggleStage = (id: string) => {
    setExpandedStages(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="pb-10">
      <header className="mb-8 animate-in slide-in-from-top duration-500">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-[#0F4C75] rounded-xl text-white shadow-lg shadow-blue-200">
            <Layers size={20} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F4C75] tracking-tight">Fluxo de Vendas</h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">Toque nas etapas para ver os leads</p>
      </header>

      <div className="space-y-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter(l => l.stageId === stage.id);
          const isExpanded = expandedStages.includes(stage.id);
          
          return (
            <div key={stage.id} className="group">
              <button 
                onClick={() => toggleStage(stage.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  isExpanded ? 'bg-white shadow-md border border-slate-100 mb-3' : 'bg-slate-200/50 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${stageLeads.length > 0 ? 'bg-[#3BB273]' : 'bg-slate-400'}`} />
                  <span className={`font-bold text-sm tracking-tight ${isExpanded ? 'text-[#0F4C75]' : 'text-slate-600'}`}>
                    {stage.name.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                    {stageLeads.length}
                  </span>
                  {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-3 pl-2 animate-in slide-in-from-top-2 duration-200">
                  {stageLeads.length === 0 ? (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl mx-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nenhum lead aqui</p>
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <LeadCard 
                        key={lead.id} 
                        lead={lead} 
                        onClick={() => onSelectLead(lead.id)} 
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelView;
