
export type ConsortiumType = 'CAR' | 'HOUSE' | 'SERVICE' | 'OTHER';

export interface Interaction {
  id: string;
  type: 'CALL' | 'MESSAGE' | 'SIMULATION' | 'NOTE';
  description: string;
  date: string;
}

export interface Objection {
  id: string;
  text: string;
  checked: boolean;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  type: ConsortiumType;
  value: number;
  installment: number;
  goal: string;
  interestDate: string;
  stageId: string;
  history: Interaction[];
  objections: Objection[];
  lastContactDate: string;
  status: 'active' | 'follow-up' | 'paused';
}

export interface Stage {
  id: string;
  name: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
}

export interface AppCustomization {
  primaryColor: string;
  fontFamily: 'Inter' | 'Poppins' | 'Montserrat';
  background: {
    type: 'gradient' | 'image';
    value: string;
  };
}

export interface AppState {
  leads: Lead[];
  stages: Stage[];
  templates: MessageTemplate[];
  activeTab: 'funnel' | 'today' | 'new' | 'messages' | 'settings' | 'details';
  selectedLeadId: string | null;
  customization: AppCustomization;
}
