
import React, { useState } from 'react';
import { Stage, Lead, ConsortiumType } from '../types';
import { COLORS } from '../constants';
import { X, Save } from 'lucide-react';

interface NewLeadViewProps {
  stages: Stage[];
  onAdd: (lead: Lead) => void;
  onCancel: () => void;
}

const NewLeadView: React.FC<NewLeadViewProps> = ({ stages, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    type: 'CAR' as ConsortiumType,
    value: '',
    installment: '',
    goal: '',
    interestDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) return alert('Preencha os campos obrigatórios');

    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      whatsapp: formData.whatsapp,
      type: formData.type,
      value: Number(formData.value) || 0,
      installment: Number(formData.installment) || 0,
      goal: formData.goal,
      interestDate: new Date(formData.interestDate).toISOString(),
      stageId: stages[0].id,
      history: [],
      objections: [],
      lastContactDate: new Date().toISOString(),
      status: 'active',
    };

    onAdd(newLead);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Novo Lead</h1>
        <button onClick={onCancel} className="p-2 text-gray-400 bg-gray-200 rounded-full">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo *</label>
            <input 
              type="text" 
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C75] outline-none"
              placeholder="Ex: João Silva"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp *</label>
            <input 
              type="tel" 
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C75] outline-none"
              placeholder="11999999999"
              value={formData.whatsapp}
              onChange={e => setFormData({...formData, whatsapp: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Consórcio</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C75] outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as ConsortiumType})}
              >
                <option value="CAR">Carro</option>
                <option value="HOUSE">Imóvel</option>
                <option value="SERVICE">Serviço</option>
                <option value="OTHER">Outros</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Interesse</label>
              <input 
                type="date" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C75] outline-none"
                value={formData.interestDate}
                onChange={e => setFormData({...formData, interestDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor da Carta</label>
              <input 
                type="number" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C75] outline-none"
                placeholder="R$ 50.000"
                value={formData.value}
                onChange={e => setFormData({...formData, value: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parcela Ideal</label>
              <input 
                type="number" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C75] outline-none"
                placeholder="R$ 500"
                value={formData.installment}
                onChange={e => setFormData({...formData, installment: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Objetivo do Cliente</label>
            <textarea 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F4C75] outline-none h-20 resize-none"
              placeholder="Ex: Trocar de carro daqui 6 meses"
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#3BB273] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Save size={20} /> Salvar Lead
        </button>
      </form>
    </div>
  );
};

export default NewLeadView;
