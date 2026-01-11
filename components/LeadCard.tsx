
import React from 'react';
import { Lead } from '../types';
import { COLORS, CONSORTIUM_ICONS } from '../constants';
import { Clock, TrendingUp, ChevronRight } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  const getStatusColor = () => {
    switch (lead.status) {
      case 'active': return COLORS.success;
      case 'follow-up': return COLORS.warning;
      case 'paused': return '#9CA3AF';
      default: return COLORS.success;
    }
  };

  const daysSinceLastContact = () => {
    const last = new Date(lead.lastContactDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[1.5rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group relative overflow-hidden active:scale-[0.98] mb-1"
    >
      <div 
        className="absolute top-0 left-0 bottom-0 w-1 rounded-full opacity-60" 
        style={{ backgroundColor: getStatusColor() }} 
      />

      <div className="flex justify-between items-start">
        <div className="max-w-[80%]">
          <h3 className="font-bold text-slate-800 truncate leading-tight group-hover:text-[#0F4C75] transition-colors">
            {lead.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-full">
              {lead.type}
            </span>
            <p className="text-[10px] font-bold text-slate-500">
              R$ {lead.value.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="text-slate-200 group-hover:text-[#0F4C75] transition-colors">
          <ChevronRight size={20} />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center text-[10px] font-bold text-slate-400 gap-1.5">
          <Clock className="w-3 h-3 text-slate-300" />
          <span>{daysSinceLastContact() === 0 ? 'HOJE' : `HÁ ${daysSinceLastContact()} DIAS`}</span>
        </div>
        
        {lead.status === 'follow-up' && (
          <div className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[8px] font-black uppercase tracking-widest animate-pulse">
            Pendente
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
