
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Lead, Stage, MessageTemplate, ConsortiumType, Interaction, Objection, AppCustomization } from './types';
import { INITIAL_STAGES, INITIAL_TEMPLATES, COLORS } from './constants';
import Navigation from './components/Navigation';
import FunnelView from './components/FunnelView';
import TodayView from './components/TodayView';
import NewLeadView from './components/NewLeadView';
import MessagesView from './components/MessagesView';
import SettingsView from './components/SettingsView';
import LeadDetailsView from './components/LeadDetailsView';

const STORAGE_KEY = 'proxvenda_data';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      leads: [],
      stages: INITIAL_STAGES,
      templates: INITIAL_TEMPLATES,
      activeTab: 'funnel',
      selectedLeadId: null,
      customization: {
        primaryColor: '#0F4C75',
        fontFamily: 'Inter',
        background: {
          type: 'gradient',
          value: 'linear-gradient(135deg, #E2E8F0 0%, #F8FAFC 50%, #DBEAFE 100%)'
        }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Apply custom font and primary color as CSS variables
    document.documentElement.style.setProperty('--primary-color', state.customization.primaryColor);
    document.body.style.fontFamily = `'${state.customization.fontFamily}', sans-serif`;
    
    if (state.customization.background.type === 'gradient') {
      document.body.style.backgroundImage = state.customization.background.value;
      document.body.style.backgroundSize = 'cover';
    } else {
      document.body.style.backgroundImage = `url(${state.customization.background.value})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, [state]);

  const setTab = (tab: AppState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const handleSelectLead = (id: string) => {
    setState(prev => ({ ...prev, selectedLeadId: id, activeTab: 'details' }));
  };

  const handleAddLead = (lead: Lead) => {
    setState(prev => ({
      ...prev,
      leads: [lead, ...prev.leads],
      activeTab: 'funnel'
    }));
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    setState(prev => ({
      ...prev,
      leads: prev.leads.map(l => l.id === leadId ? { ...l, ...updates } : l)
    }));
  };

  const handleDeleteLead = (leadId: string) => {
    setState(prev => ({
      ...prev,
      leads: prev.leads.filter(l => l.id !== leadId),
      activeTab: 'funnel',
      selectedLeadId: null
    }));
  };

  const handleUpdateStages = (stages: Stage[]) => {
    setState(prev => ({ ...prev, stages }));
  };

  const handleUpdateTemplates = (templates: MessageTemplate[]) => {
    setState(prev => ({ ...prev, templates }));
  };

  const handleUpdateCustomization = (customization: AppCustomization) => {
    setState(prev => ({ ...prev, customization }));
  };

  const activeLead = useMemo(() => 
    state.leads.find(l => l.id === state.selectedLeadId),
    [state.leads, state.selectedLeadId]
  );

  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-lg mx-auto relative antialiased transition-all duration-500">
      <main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="animate-in fade-in duration-500">
          {state.activeTab === 'funnel' && (
            <FunnelView 
              leads={state.leads} 
              stages={state.stages} 
              onSelectLead={handleSelectLead}
              onMoveLead={(id, stageId) => handleUpdateLead(id, { stageId })}
            />
          )}
          {state.activeTab === 'today' && (
            <TodayView 
              leads={state.leads} 
              onSelectLead={handleSelectLead} 
              onUpdateLead={handleUpdateLead}
            />
          )}
          {state.activeTab === 'new' && (
            <NewLeadView 
              stages={state.stages} 
              onAdd={handleAddLead} 
              onCancel={() => setTab('funnel')}
            />
          )}
          {state.activeTab === 'messages' && (
            <MessagesView 
              templates={state.templates} 
              leads={state.leads}
              onUpdate={handleUpdateTemplates}
            />
          )}
          {state.activeTab === 'settings' && (
            <SettingsView 
              stages={state.stages} 
              customization={state.customization}
              onUpdateStages={handleUpdateStages}
              onUpdateCustomization={handleUpdateCustomization}
              onResetData={() => {
                if(confirm("Deseja realmente apagar todos os dados?")) {
                  localStorage.removeItem(STORAGE_KEY);
                  window.location.reload();
                }
              }}
            />
          )}
          {state.activeTab === 'details' && activeLead && (
            <LeadDetailsView 
              lead={activeLead} 
              stages={state.stages}
              onUpdateLead={handleUpdateLead}
              onDeleteLead={() => handleDeleteLead(activeLead.id)}
              onBack={() => setTab('funnel')}
            />
          )}
        </div>
      </main>

      <Navigation activeTab={state.activeTab} onTabChange={setTab} primaryColor={state.customization.primaryColor} />
    </div>
  );
};

export default App;
