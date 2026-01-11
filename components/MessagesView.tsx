
import React, { useState } from 'react';
import { MessageTemplate, Lead } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Copy, Plus, X, Check, Save, Sparkles, Loader2, Send, MessageCircle, Edit3, Trash2, Users, Search, ChevronRight } from 'lucide-react';

interface MessagesViewProps {
  templates: MessageTemplate[];
  leads: Lead[];
  onUpdate: (templates: MessageTemplate[]) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ templates, leads, onUpdate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tplForm, setTplForm] = useState({ title: '', content: '' });
  const [quickPhone, setQuickPhone] = useState('');
  
  // States for Sending to Client
  const [sendingTemplate, setSendingTemplate] = useState<MessageTemplate | null>(null);
  const [leadSearch, setLeadSearch] = useState('');

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateWithAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como um especialista em vendas de consórcios, crie UMA mensagem de WhatsApp persuasiva baseada no seguinte pedido: "${aiPrompt}". A mensagem deve ser curta, amigável e focar no fechamento ou em despertar curiosidade. Retorne apenas o texto da mensagem.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = (response.text || "").trim();
      setTplForm({ title: 'Sugestão da IA', content: text });
      setIsAdding(true);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com a IA.");
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  const handleSave = () => {
    if (!tplForm.title || !tplForm.content) return;
    
    if (editingId) {
      onUpdate(templates.map(t => t.id === editingId ? { ...t, ...tplForm } : t));
    } else {
      onUpdate([{ id: Math.random().toString(), ...tplForm }, ...templates]);
    }
    
    setTplForm({ title: '', content: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (tpl: MessageTemplate) => {
    setTplForm({ title: tpl.title, content: tpl.content });
    setEditingId(tpl.id);
    setIsAdding(true);
  };

  const openQuickWhatsApp = () => {
    const cleanPhone = quickPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return alert('Digite um número válido com DDD');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const handleSendToLead = (lead: Lead) => {
    if (!sendingTemplate) return;
    
    let content = sendingTemplate.content;
    
    // Simple variable replacement
    const typeNames = {
      CAR: 'Carro',
      HOUSE: 'Imóvel',
      SERVICE: 'Serviço',
      OTHER: 'Consórcio'
    };
    
    content = content.replace(/\[NOME\]/gi, lead.name.split(' ')[0]);
    content = content.replace(/\[TIPO\]/gi, typeNames[lead.type] || 'Consórcio');
    
    const whatsappUrl = `https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(content)}`;
    window.open(whatsappUrl, '_blank');
    setSendingTemplate(null);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(leadSearch.toLowerCase())
  );

  return (
    <div className="pb-10 animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-extrabold text-[#0F4C75] tracking-tight">Biblioteca de Scripts</h1>
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setTplForm({title:'', content:''}); }}
            className="p-2 bg-[#0F4C75] text-white rounded-xl shadow-lg active:scale-90 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-sm text-slate-500 font-medium">Crie abordagens matadoras com ajuda da IA</p>
      </header>

      {/* Botão de WhatsApp Direto */}
      <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-slate-100 mb-8 border-l-4 border-l-green-500">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={18} className="text-green-500" />
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp Direto</h2>
        </div>
        <div className="flex gap-2">
          <input 
            type="tel" 
            placeholder="DDD + Número (sem cadastrar)" 
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-100 transition-all"
            value={quickPhone}
            onChange={e => setQuickPhone(e.target.value)}
          />
          <button 
            onClick={openQuickWhatsApp}
            className="bg-[#3BB273] text-white p-3 rounded-xl shadow-lg shadow-green-100 active:scale-90 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Gerador IA */}
      <div className="bg-gradient-to-br from-[#0F4C75] to-[#1e293b] p-6 rounded-[2rem] shadow-2xl text-white mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-yellow-400" />
            <h2 className="font-bold text-lg">Gerador IA Editável</h2>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Sobre o que você quer falar?" 
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:bg-white/20 transition-all"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateWithAI()}
            />
            <button 
              onClick={generateWithAI}
              disabled={isGenerating || !aiPrompt}
              className="bg-yellow-400 text-[#0F4C75] p-3 rounded-xl disabled:opacity-50 active:scale-90 transition-transform shadow-lg shadow-yellow-400/20"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            </button>
          </div>
          <p className="text-[10px] text-blue-200 mt-2 italic font-medium">A sugestão será aberta abaixo para você revisar.</p>
        </div>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 mb-8 animate-in zoom-in-95 duration-300 ring-2 ring-[#0F4C75]/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-slate-700 uppercase text-xs tracking-widest">
              {editingId ? 'Editar Mensagem' : 'Revisar Nova Mensagem'}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 p-1"><X size={20}/></button>
          </div>
          <input 
            type="text" 
            placeholder="Título do template" 
            className="w-full p-4 bg-slate-50 rounded-xl mb-3 outline-none border border-slate-100 font-bold text-slate-700 focus:ring-2 focus:ring-[#0F4C75]/5 transition-all"
            value={tplForm.title}
            onChange={e => setTplForm({...tplForm, title: e.target.value})}
          />
          <textarea 
            className="w-full p-5 bg-slate-50 rounded-xl mb-4 outline-none border border-slate-100 h-48 resize-none text-sm leading-relaxed text-slate-600 focus:ring-2 focus:ring-[#0F4C75]/5 transition-all"
            value={tplForm.content}
            onChange={e => setTplForm({...tplForm, content: e.target.value})}
            placeholder="Escreva ou ajuste o texto da IA aqui..."
          />
          <button 
            onClick={handleSave}
            className="w-full bg-[#3BB273] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-100 active:scale-[0.98] transition-all"
          >
            <Save size={18} /> {editingId ? 'Salvar Alterações' : 'Salvar na Biblioteca'}
          </button>
        </div>
      )}

      {/* Lead Selector Modal */}
      {sendingTemplate && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-6 mb-20 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-[#0F4C75]">Selecione o Cliente</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Para enviar: {sendingTemplate.title}</p>
                 </div>
                 <button onClick={() => setSendingTemplate(null)} className="bg-slate-100 p-2 rounded-full text-slate-400 active:scale-90 transition-all"><X size={20}/></button>
              </div>

              <div className="relative mb-6">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                   type="text" 
                   placeholder="Buscar cliente..." 
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#0F4C75]/5 transition-all"
                   value={leadSearch}
                   onChange={e => setLeadSearch(e.target.value)}
                 />
              </div>

              <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-1 funnel-scroll">
                 {filteredLeads.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 italic text-sm">Nenhum cliente encontrado</div>
                 ) : (
                    filteredLeads.map(lead => (
                       <button 
                         key={lead.id} 
                         onClick={() => handleSendToLead(lead)}
                         className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all active:scale-[0.98] border border-transparent hover:border-slate-200"
                       >
                          <div className="flex items-center gap-3 text-left">
                             <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#0F4C75] font-black shadow-sm">
                                {lead.name.charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold text-slate-700 text-sm">{lead.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase">{lead.type}</p>
                             </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-300" />
                       </button>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">Sua Biblioteca</h2>
        {templates.map(tpl => (
          <div key={tpl.id} className="bg-white rounded-[2rem] p-6 shadow-md border border-slate-50 group transition-all hover:shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-[#0F4C75] text-sm uppercase tracking-tight">{tpl.title}</h3>
              <div className="flex gap-1">
                <button 
                  onClick={() => startEdit(tpl)}
                  className="p-2 text-slate-300 hover:text-[#0F4C75] hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => confirm('Apagar template?') && onUpdate(templates.filter(t => t.id !== tpl.id))}
                  className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-2xl italic border border-slate-100">
              "{tpl.content}"
            </p>
            
            <div className="flex gap-2">
               <button 
                onClick={() => handleCopy(tpl.content, tpl.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  copiedId === tpl.id ? 'bg-[#3BB273] text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {copiedId === tpl.id ? <Check size={16} /> : <Copy size={16} />}
                {copiedId === tpl.id ? 'Copiado!' : 'Copiar Texto'}
              </button>

              <button 
                onClick={() => setSendingTemplate(tpl)}
                className="bg-[#0F4C75] text-white p-4 rounded-2xl shadow-lg shadow-blue-100 active:scale-90 transition-transform flex items-center justify-center"
              >
                <Users size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesView;
