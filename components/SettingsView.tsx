
import React, { useState, useRef } from 'react';
import { Stage, AppCustomization } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  GripVertical, Plus, Trash2, Database, Layout, Bell, Palette, RotateCcw, 
  Settings, Type, Image as ImageIcon, Sparkles, Loader2, Check, Upload, X
} from 'lucide-react';

interface SettingsViewProps {
  stages: Stage[];
  customization: AppCustomization;
  onUpdateStages: (stages: Stage[]) => void;
  onUpdateCustomization: (customization: AppCustomization) => void;
  onResetData: () => void;
}

const Section: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="mb-8 animate-in fade-in slide-in-from-bottom duration-500">
    <div className="flex items-center gap-2 mb-4 px-2">
      <div className="text-[var(--primary-color)]">{icon}</div>
      <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h2>
    </div>
    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
      {children}
    </div>
  </div>
);

const SettingsView: React.FC<SettingsViewProps> = ({ stages, customization, onUpdateStages, onUpdateCustomization, onResetData }) => {
  const [newStageName, setNewStageName] = useState('');
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    { name: 'Original', value: '#0F4C75' },
    { name: 'Venda Pro', value: '#3BB273' },
    { name: 'Royal', value: '#1e3a8a' },
    { name: 'Elegante', value: '#18181b' },
    { name: 'Ouro', value: '#92400e' },
    { name: 'Moderno', value: '#4f46e5' },
  ];

  const fonts = ['Inter', 'Poppins', 'Montserrat'] as const;

  const addStage = () => {
    if (!newStageName) return;
    onUpdateStages([...stages, { id: Math.random().toString(), name: newStageName }]);
    setNewStageName('');
  };

  const removeStage = (id: string) => {
    if (stages.length <= 1) return alert('O funil deve ter pelo menos uma etapa');
    onUpdateStages(stages.filter(s => s.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateCustomization({
          ...customization,
          background: { type: 'image', value: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIBackground = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Crie um plano de fundo abstrato, moderno, luxuoso e profissional para um aplicativo de negócios. 
      Estilo solicitado: ${aiPrompt}. 
      A imagem deve ser limpa, sem textos, com cores suaves mas impactantes, adequada para ser o fundo de um CRM de vendas.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          onUpdateCustomization({
            ...customization,
            background: { type: 'image', value: imageUrl }
          });
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  const resetBackground = () => {
    onUpdateCustomization({
      ...customization,
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #E2E8F0 0%, #F8FAFC 50%, #DBEAFE 100%)'
      }
    });
  };

  return (
    <div className="pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter">Configurações</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Personalize seu ambiente de trabalho</p>
      </header>

      <Section title="Etapas do Funil" icon={<Layout size={18} />}>
        <div className="space-y-3 mb-6">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
              <span className="text-[10px] font-black text-slate-400 w-4">{idx + 1}</span>
              <span className="flex-1 font-bold text-slate-700">{stage.name}</span>
              <button onClick={() => removeStage(stage.id)} className="text-slate-300 hover:text-red-500 p-1 active:scale-90 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Adicionar nova etapa..." 
            className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-medium focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-all"
            value={newStageName}
            onChange={e => setNewStageName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addStage()}
          />
          <button 
            onClick={addStage}
            className="p-4 bg-[var(--primary-color)] text-white rounded-2xl shadow-lg active:scale-90 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </Section>

      <Section title="Personalização do App" icon={<Palette size={18} />}>
        <div className="space-y-8">
          {/* Cores */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Cor do Tema</label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map(color => (
                <button
                  key={color.value}
                  onClick={() => onUpdateCustomization({ ...customization, primaryColor: color.value })}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    customization.primaryColor === color.value 
                    ? 'border-[var(--primary-color)] bg-slate-50 shadow-sm' 
                    : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: color.value }} />
                  <span className="text-[10px] font-bold text-slate-500">{color.name}</span>
                  {customization.primaryColor === color.value && (
                    <div className="absolute top-2 right-2 bg-[var(--primary-color)] text-white p-0.5 rounded-full">
                      <Check size={8} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fontes */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Fonte de Texto</label>
            <div className="flex gap-2">
              {fonts.map(font => (
                <button
                  key={font}
                  onClick={() => onUpdateCustomization({ ...customization, fontFamily: font })}
                  className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all ${
                    customization.fontFamily === font
                    ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/20'
                    : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                  }`}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Planos de Fundo */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Plano de Fundo</label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase active:scale-95 transition-all"
                >
                  <Upload size={14} /> Importar Foto
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
                
                {customization.background.type === 'image' && (
                  <button 
                    onClick={resetBackground}
                    className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 active:scale-95 transition-all"
                    title="Remover fundo personalizado"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="bg-slate-900 rounded-3xl p-5 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Gerador de Fundo IA</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ex: Futurista, Paisagem zen, Tech dark..." 
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white/20 transition-all placeholder:text-white/30"
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && generateAIBackground()}
                    />
                    <button 
                      onClick={generateAIBackground}
                      disabled={isGenerating || !aiPrompt}
                      className="bg-yellow-400 text-slate-900 p-3 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-90 disabled:opacity-50 transition-all"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Segurança e Dados" icon={<Database size={18} />}>
        <div className="bg-slate-50 p-4 rounded-2xl mb-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-bold text-slate-700 text-sm">Regras de Follow-up</p>
              <p className="text-[10px] font-medium text-slate-400">Sugestões de contato inteligentes</p>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full relative p-1 cursor-pointer shadow-inner">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
            </div>
          </div>
        </div>
        
        <p className="text-[10px] font-medium text-slate-400 mb-6 leading-relaxed">
          Seus dados e personalizações são salvos localmente no seu navegador. 
          Limpar o histórico do site resultará na perda definitiva das informações.
        </p>

        <button 
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-red-100 transition-all active:scale-[0.98]"
        >
          <RotateCcw size={16} /> Resetar Todo o App
        </button>
      </Section>

      <div className="text-center py-4">
        <p className="text-[10px] text-slate-300 font-black tracking-widest">PROXVENDA v1.1.0 • CUSTOMIZED EXPERIENCE</p>
      </div>
    </div>
  );
};

export default SettingsView;
