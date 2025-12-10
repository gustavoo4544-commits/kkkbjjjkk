import { Home, Trophy, History, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoginRequired: () => void;
  isAuthenticated: boolean;
}

export function BottomNav({ activeTab, onTabChange, onLoginRequired, isAuthenticated }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'bets', icon: Trophy, label: 'Apostas' },
    { id: 'history', icon: History, label: 'Histórico' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  const handleTabClick = (tabId: string) => {
    if (['bets', 'history', 'profile'].includes(tabId) && !isAuthenticated) {
      onLoginRequired();
      return;
    }
    onTabChange(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_hsl(145,77%,46%)]' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
