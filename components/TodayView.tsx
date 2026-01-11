
import React, { useMemo } from 'react';
import { Lead } from '../types';
import { COLORS } from '../constants';
import { MessageCircle, CalendarPlus, ChevronRight, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TodayViewProps {
  leads: Lead[];
  onSelectLead: (id: string) => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
}

const TodayView: React.FC<TodayViewProps> = ({ leads, onSelectLead, onUpdateLead }) => {
  const tasks = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const categorized = {
      late: [] as Lead[],
      today: [] as Lead[],
      upcoming: [] as Lead[],
    };

    leads.forEach(lead => {
      const interest = new Date(lead.interestDate);
      interest.setHours(0,0,0,0);

      if (interest < today) categorized.late.push(lead);
      else if (interest.getTime() === today.getTime()) categorized.today.push(lead);
      else categorized.upcoming.push(lead);
    });

    return categorized;
  }, [leads]);

  const handleWhatsApp = (lead: Lead) => {
    const win = window.open(`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`, '_blank');
    if (win) win.focus();
    onUpdateLead(lead.id, { lastContactDate: new Date().toISOString() });
  };

  const handleDelay = (lead: Lead) => {
    const newDate = new Date(lead.interestDate);
    newDate.setDate(newDate.getDate() + 7);
    onUpdateLead(lead.id, { interestDate: newDate.toISOString() });
  };

  const TaskCard: React.FC<{ lead: Lead, priority: 'late' | 'today' | 'upcoming' }> = ({ lead, priority }) => (
    <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 mb-4 overflow-hidden border border-gray-100 group animate-in slide-in-from-bottom duration-300">
      <div className="p-6 flex items-center justify-between" onClick={() => onSelectLead(lead.id)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2.5 h-2.5 rounded-full ${priority === 'late' ? 'bg-red-500 shadow-lg shadow-red-200' : priority === 'today' ? 'bg-orange-400 shadow-lg shadow-orange-200' : 'bg-green-500 shadow-lg shadow-green-200'}`} />
            <h3 className="font-black text-gray-800 group-hover:text-[#0F4C75] transition-colors">{lead.name}</h3>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {lead.goal || 'Foco em Fechamento'}
          </p>
        </div>
        <div className="bg-gray-50 p-2 rounded-xl text-gray-300 group-hover:text-[#0F4C75] group-hover:bg-[#0F4C75]/5 transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
      <div className="bg-gray-50/50 px-6 py-4 flex gap-3 border-t border-gray-50">
        <button 
          onClick={(e) => { e.stopPropagation(); handleWhatsApp(lead); }}
          className="flex-1 flex items-center justify-center bg-[#3BB273] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider gap-2 active:scale-95 transition-all shadow-lg shadow-green-100"
        >
          <MessageCircle size={16} strokeWidth={3} /> WhatsApp
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleDelay(lead); }}
          className="flex-1 flex items-center justify-center bg-white text-gray-600 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider gap-2 active:scale-95 transition-all border border-gray-200"
        >
          <CalendarPlus size={16} /> Adiar 7d
        </button>
      </div>
    </div>
  );

  return (
    <div className="pb-10">
      <header className="mb-8 animate-in slide-in-from-top duration-500">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter">Minha Agenda</h1>
        <div className="flex items-center gap-2 mt-1">
          <CheckCircle2 size={14} className="text-green-500" />
          <p className="text-sm font-bold text-gray-500">
            {tasks.today.length + tasks.late.length} pendências para agora
          </p>
        </div>
      </header>

      {tasks.late.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-1">
            <AlertCircle size={16} className="text-red-500" />
            <h2 className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">Prioridade Crítica</h2>
          </div>
          {tasks.late.map(lead => <TaskCard key={lead.id} lead={lead} priority="late" />)}
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-1">Próximos Passos</h2>
        {tasks.today.length === 0 && tasks.late.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-sm font-black text-gray-800">TUDO PRONTO!</p>
            <p className="text-xs text-gray-400 mt-1">Você não tem leads atrasados hoje.</p>
          </div>
        ) : (
          tasks.today.map(lead => <TaskCard key={lead.id} lead={lead} priority="today" />)
        )}
      </section>

      {tasks.upcoming.length > 0 && (
        <section className="opacity-60 grayscale-[0.5]">
          <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-1 italic">Futuros Contatos</h2>
          {tasks.upcoming.slice(0, 3).map(lead => <TaskCard key={lead.id} lead={lead} priority="upcoming" />)}
          {tasks.upcoming.length > 3 && (
            <p className="text-center text-[10px] font-bold text-gray-400 py-4 uppercase">E mais {tasks.upcoming.length - 3} contatos agendados...</p>
          )}
        </section>
      )}
    </div>
  );
};

export default TodayView;
