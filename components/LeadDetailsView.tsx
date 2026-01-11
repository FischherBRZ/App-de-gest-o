
import React, { useState } from 'react';
import { Lead, Stage, Interaction, Objection, ConsortiumType } from '../types';
import { COLORS, CONSORTIUM_ICONS, INITIAL_OBJECTIONS } from '../constants';
import { ChevronLeft, Trash2, Calendar, MessageCircle, Phone, FileText, Plus, CheckSquare, Square, Sparkles, Loader2, Copy, ChevronDown } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface LeadDetailsViewProps {
  lead: Lead;
  stages: Stage[];
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead: () => void;
  onBack: () => void;
}

const LeadDetailsView: React.FC<LeadDetailsViewProps> = ({ lead, stages, onUpdateLead, onDeleteLead, onBack }) => {
  const [activeTab, setActiveTab] = useState<'resumo' | 'historico' | 'objecoes'>('resumo');
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [newInteraction, setNewInteraction] = useState({ type: 'CALL' as Interaction['type'], text: '' });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addInteraction = () => {
    if (!newInteraction.text) return;
    const interaction: Interaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: newInteraction.type,
      description: newInteraction.text,
      date: new Date().toISOString(),
    };
    onUpdateLead(lead.id, { 
      history: [interaction, ...lead.history],
      lastContactDate: new Date().toISOString()
    });
    setNewInteraction({ type: 'CALL', text: '' });
    setIsAddingInteraction(false);
  };

  const toggleObjection = (text: string) => {
    const exists = lead.objections.find(o => o.text === text);
    let newObjections: Objection[];
    
    if (exists) {
      newObjections = lead.objections.filter(o => o.text !== text);
    } else {
      newObjections = [...lead.objections, { id: Math.random().toString(), text, checked: true }];
    }
    onUpdateLead(lead.id, { objections: newObjections });
  };

  const generateAISuggestions = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentStageName = stages.find(s => s.id === lead.stageId)?.name || 'Desconhecido';
      const historySummary = lead.history.map(h => h.description).join('; ');
      
      const prompt = `Como um consultor de consórcios sênior, sugira 3 opções de mensagens curtas e persuasivas de WhatsApp para o cliente ${lead.name}. 
      Contexto: Ele está na etapa "${currentStageName}", interessado em um consórcio de ${lead.type} no valor de R$ ${lead.value}. 
      Histórico: ${historySummary || 'Nenhum contato anterior registrado'}.
      Retorne apenas as 3 mensagens separadas por "---".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || "";
      const suggestions = text.split('---').map(s => s.trim()).filter(s => s.length > 5);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Erro ao gerar sugestões. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado!");
  };

  const tabs = [
    { id: 'resumo', label: 'Resumo' },
    { id: 'historico', label: 'Histórico' },
    { id: 'objecoes', label: 'Objeções' },
  ];

  return (
    <div className="-mt-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#F5F7FA]/90 backdrop-blur-md py-4 z-20">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm text-slate-400 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold text-[#0F4C75] tracking-tight truncate px-4">cliente</h1>
        <button onClick={() => confirm('Apagar lead?') && onDeleteLead()} className="p-2 bg-white rounded-full shadow-sm text-red-500 active:scale-90 transition-transform">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex bg-white rounded-2xl p-1 shadow-md mb-6 border border-slate-100 relative">
        <div 
          className="absolute h-[calc(100%-8px)] top-1 bg-[#0F4C75] rounded-xl transition-all duration-300 ease-out z-0 shadow-lg shadow-[#0F4C75]/20"
          style={{ 
            width: `calc(100% / 3 - 4px)`, 
            left: `calc(${tabs.findIndex(t => t.id === activeTab) * 33.33}% + 4px)` 
          }}
        />
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-sm font-bold transition-colors duration-300 relative z-10 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'resumo' && (
        <div className="space-y-6 pb-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Card Principal */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estágio Atual</span>
              <div className="relative group">
                <select 
                  className="text-[11px] font-black text-white bg-[#0F4C75] px-5 py-2.5 rounded-2xl outline-none appearance-none pr-10 shadow-lg shadow-blue-900/20 active:scale-95 transition-all cursor-pointer border-none"
                  value={lead.stageId}
                  onChange={(e) => onUpdateLead(lead.id, { stageId: e.target.value })}
                >
                  {stages.map(s => <option key={s.id} value={s.id} className="text-slate-800 bg-white">{s.name}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
                  <ChevronDown size={16} strokeWidth={3} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consórcio</span>
              <div className="relative group">
                <select 
                  className="text-[11px] font-black text-[#0F4C75] bg-blue-50 px-5 py-2.5 rounded-2xl outline-none appearance-none pr-10 active:scale-95 transition-all cursor-pointer border border-blue-100"
                  value={lead.type}
                  onChange={(e) => onUpdateLead(lead.id, { type: e.target.value as ConsortiumType })}
                >
                  <option value="CAR">Carro</option>
                  <option value="HOUSE">Imóvel</option>
                  <option value="SERVICE">Serviço</option>
                  <option value="OTHER">Outros</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#0F4C75]/70">
                  <ChevronDown size={16} strokeWidth={3} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block ml-1">Valor Carta</label>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center shadow-inner group-focus-within:border-[#0F4C75]/30 transition-all">
                  <span className="text-sm font-black text-slate-400 mr-1">R$</span>
                  <input 
                    type="number"
                    className="w-full bg-transparent outline-none font-black text-slate-800 text-lg placeholder:text-slate-300"
                    placeholder="0"
                    value={lead.value === 0 ? '' : lead.value}
                    onFocus={(e) => {
                      if (lead.value !== 0) {
                         // We don't want to clear the real state immediately to prevent accidental data loss, 
                         // but visually it should look empty/white as requested.
                         // Using defaultValue/value logic for 'limpar' effect.
                         e.target.select();
                      }
                    }}
                    onChange={(e) => onUpdateLead(lead.id, { value: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block ml-1">Parcela</label>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center shadow-inner group-focus-within:border-[#0F4C75]/30 transition-all">
                  <span className="text-sm font-black text-slate-400 mr-1">R$</span>
                  <input 
                    type="number"
                    className="w-full bg-transparent outline-none font-black text-slate-800 text-lg placeholder:text-slate-300"
                    placeholder="0"
                    value={lead.installment === 0 ? '' : lead.installment}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => onUpdateLead(lead.id, { installment: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl flex items-center justify-between border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-orange-100 p-2 rounded-xl text-orange-600 shadow-sm shadow-orange-200/50">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-0.5">Próximo Follow-up</p>
                  <input 
                    type="date" 
                    className="bg-transparent border-none outline-none text-sm font-bold text-orange-600 w-full p-0 h-auto cursor-pointer focus:ring-0"
                    value={lead.interestDate ? lead.interestDate.split('T')[0] : ''}
                    onChange={(e) => onUpdateLead(lead.id, { interestDate: new Date(e.target.value).toISOString() })}
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  const date = lead.interestDate ? new Date(lead.interestDate) : new Date();
                  date.setDate(date.getDate() + 7);
                  onUpdateLead(lead.id, { interestDate: date.toISOString() });
                }}
                className="bg-white text-orange-500 p-2 rounded-xl shadow-md border border-orange-100 active:scale-90 transition-transform ml-2"
                title="Adiar 7 dias"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Seção AI Magic */}
          <div className="bg-gradient-to-br from-[#0F4C75] to-[#1B262C] p-6 rounded-[2rem] shadow-xl text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <Sparkles size={100} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-yellow-400" />
                <h3 className="text-lg font-bold">Assistente ProxVenda</h3>
              </div>
              
              <p className="text-xs text-blue-200 mb-6 leading-relaxed">
                Nossa inteligência artificial analisa o comportamento do seu lead e sugere o melhor texto para fechamento.
              </p>

              {aiSuggestions.length > 0 ? (
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                  {aiSuggestions.map((msg, i) => (
                    <div key={i} className="bg-white/10 p-3 rounded-xl border border-white/10 relative group">
                      <p className="text-xs italic mb-2">Opção {i + 1}:</p>
                      <p className="text-sm font-medium pr-8">{msg}</p>
                      <button 
                        onClick={() => copyToClipboard(msg)}
                        className="absolute top-3 right-3 text-white/50 hover:text-white"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setAiSuggestions([])}
                    className="text-xs text-white/50 underline block w-full text-center py-2"
                  >
                    Limpar sugestões
                  </button>
                </div>
              ) : (
                <button 
                  onClick={generateAISuggestions}
                  disabled={isGenerating}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#0F4C75] py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-yellow-500/20"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {isGenerating ? 'ANALISANDO LEAD...' : 'GERAR SUGESTÕES MÁGICAS'}
                </button>
              )}
            </div>
          </div>

          {/* Ações de Contato */}
          <div className="flex gap-4">
            <a 
              href={`tel:${lead.whatsapp}`}
              className="flex-1 flex flex-col items-center justify-center p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm text-blue-600 active:scale-95 transition-all"
            >
              <div className="bg-blue-50 p-3 rounded-2xl mb-2">
                <Phone size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Ligar</span>
            </a>
            <a 
              href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex flex-col items-center justify-center p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm text-green-600 active:scale-95 transition-all"
            >
              <div className="bg-green-50 p-3 rounded-2xl mb-2">
                <MessageCircle size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="space-y-4 pb-20 animate-in fade-in slide-in-from-right duration-300">
          <button 
            onClick={() => setIsAddingInteraction(true)}
            className="w-full bg-white text-[#0F4C75] py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-2 border-2 border-dashed border-[#0F4C75]/20 shadow-sm active:scale-95 transition-all"
          >
            <Plus size={20} /> ADICIONAR INTERAÇÃO
          </button>

          {isAddingInteraction && (
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 mb-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex gap-2 mb-4">
                {(['CALL', 'MESSAGE', 'SIMULATION', 'NOTE'] as Interaction['type'][]).map(type => (
                  <button 
                    key={type}
                    onClick={() => setNewInteraction({ ...newInteraction, type })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${newInteraction.type === type ? 'bg-[#0F4C75] text-white shadow-lg shadow-[#0F4C75]/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {type === 'CALL' ? 'LIG' : type === 'MESSAGE' ? 'MSG' : type === 'SIMULATION' ? 'SIM' : 'NOT'}
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm border border-slate-100 h-32 mb-4 resize-none focus:ring-2 focus:ring-[#0F4C75]/10"
                placeholder="O que aconteceu nesse contato?"
                value={newInteraction.text}
                onChange={e => setNewInteraction({...newInteraction, text: e.target.value})}
              />
              <div className="flex gap-3">
                <button onClick={() => setIsAddingInteraction(false)} className="flex-1 py-4 text-xs font-bold text-slate-400">DESCARTAR</button>
                <button onClick={addInteraction} className="flex-1 py-4 text-xs font-black bg-[#3BB273] text-white rounded-2xl shadow-lg shadow-green-100">SALVAR REGISTRO</button>
              </div>
            </div>
          )}

          <div className="space-y-6 pt-4">
            {lead.history.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <FileText size={32} />
                </div>
                <p className="text-sm font-bold text-slate-300">NENHUM REGISTRO ENCONTRADO</p>
              </div>
            ) : (
              lead.history.map((h, idx) => (
                <div key={h.id} className="relative pl-12 group">
                  <div className="absolute left-5 top-0 bottom-[-24px] w-0.5 bg-slate-100 group-last:hidden" />
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-[1.25rem] bg-white border-4 border-[#F8FAFC] shadow-sm flex items-center justify-center z-10">
                    {h.type === 'CALL' && <Phone size={14} className="text-blue-500" />}
                    {h.type === 'MESSAGE' && <MessageCircle size={14} className="text-green-500" />}
                    {h.type === 'SIMULATION' && <FileText size={14} className="text-orange-500" />}
                    {h.type === 'NOTE' && <Plus size={14} className="text-slate-500" />}
                  </div>
                  <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-50 mb-6 transform transition-all group-hover:shadow-md">
                    <p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-tighter">
                      {new Date(h.date).toLocaleDateString('pt-BR')} • {new Date(h.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{h.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'objecoes' && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 space-y-6 animate-in fade-in slide-in-from-left duration-300">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Barreiras de Fechamento</h3>
            <div className="grid grid-cols-1 gap-3">
              {INITIAL_OBJECTIONS.map(obj => {
                const isSelected = lead.objections.some(o => o.text === obj);
                return (
                  <button 
                    key={obj} 
                    onClick={() => toggleObjection(obj)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 active:scale-95 ${isSelected ? 'bg-[#0F4C75] border-[#0F4C75] text-white shadow-lg shadow-[#0F4C75]/20' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {isSelected ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-300" />}
                    <span className="text-sm font-bold">{obj}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Notas Estratégicas</h3>
            <textarea 
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none text-sm h-40 resize-none font-medium text-slate-700 focus:ring-2 focus:ring-[#0F4C75]/5"
              placeholder="Descreva detalhes que ajudam na negociação..."
              value={lead.goal}
              onChange={e => onUpdateLead(lead.id, { goal: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetailsView;
