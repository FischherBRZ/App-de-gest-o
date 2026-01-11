
import React from 'react';
import { Stage, MessageTemplate, Lead } from './types';
import { Home, Calendar, PlusCircle, MessageSquare, Settings, Car, Building2, Wrench, MoreHorizontal } from 'lucide-react';

export const COLORS = {
  primary: '#0F4C75', // Azul petróleo
  success: '#3BB273', // Verde suave
  background: '#F5F7FA', // Cinza claro
  text: '#4A4A4A', // Cinza escuro
  warning: '#F2A154', // Laranja suave
  error: '#EF4444',
};

export const INITIAL_STAGES: Stage[] = [
  { id: '1', name: 'Lead Novo' },
  { id: '2', name: 'Contato Realizado' },
  { id: '3', name: 'Simulação Enviada' },
  { id: '4', name: 'Aguardando Decisão' },
  { id: '5', name: 'Venda Fechada' },
];

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    title: 'Abordagem Inicial',
    content: 'Olá [NOME], vi que você tem interesse em um consórcio de [TIPO]. Como posso te ajudar hoje?',
  },
  {
    id: '2',
    title: 'Consórcio x Financiamento',
    content: 'A principal diferença é que no consórcio você não paga juros, apenas uma taxa de administração diluída, economizando até 50% do valor final.',
  },
  {
    id: '3',
    title: 'Follow-up Pós-Simulação',
    content: 'Oi [NOME], conseguiu analisar a simulação que te enviei? Ficou alguma dúvida sobre as parcelas?',
  },
];

export const CONSORTIUM_ICONS = {
  CAR: <Car className="w-4 h-4" />,
  HOUSE: <Building2 className="w-4 h-4" />,
  SERVICE: <Wrench className="w-4 h-4" />,
  OTHER: <MoreHorizontal className="w-4 h-4" />,
};

export const INITIAL_OBJECTIONS = [
  "Não é o momento",
  "Comparando opções",
  "Dúvidas sobre taxas",
  "Medo de contemplação",
];
