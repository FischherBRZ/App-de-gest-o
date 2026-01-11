
import React from 'react';
import { Home, Calendar, PlusCircle, MessageSquare, Settings } from 'lucide-react';
import { AppState } from '../types';

interface NavigationProps {
  activeTab: AppState['activeTab'];
  onTabChange: (tab: AppState['activeTab']) => void;
  primaryColor: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, primaryColor }) => {
  const tabs: { id: AppState['activeTab']; icon: React.ReactNode; label: string }[] = [
    { id: 'funnel', icon: <Home />, label: 'Funil' },
    { id: 'today', icon: <Calendar />, label: 'Hoje' },
    { id: 'new', icon: <PlusCircle />, label: 'Novo' },
    { id: 'messages', icon: <MessageSquare />, label: 'Mensagens' },
    { id: 'settings', icon: <Settings />, label: 'Config' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-3 px-1 z-50 max-w-lg mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-t-[2.5rem]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 transition-all duration-300"
            style={{ color: isActive ? primaryColor : '#94A3B8' }}
          >
            <span className={`${isActive ? 'scale-110 -translate-y-1' : 'scale-100 translate-y-0'} transition-all duration-300`}>
              {/* Fixed: Cast tab.icon to React.ReactElement<any> to resolve the TypeScript error when passing Lucide props (size, strokeWidth) */}
              {React.cloneElement(tab.icon as React.ReactElement<any>, { size: isActive ? 24 : 20, strokeWidth: isActive ? 3 : 2 })}
            </span>
            <span className={`text-[9px] mt-1 uppercase tracking-widest font-black ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
