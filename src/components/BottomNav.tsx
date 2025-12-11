import { Home, Trophy, History, User, Gift } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoginRequired: () => void;
  isAuthenticated: boolean;
  totalPrize: number;
  onPrizeClick: () => void;
}

export function BottomNav({ 
  activeTab, 
  onTabChange, 
  onLoginRequired, 
  isAuthenticated,
  totalPrize,
  onPrizeClick 
}: BottomNavProps) {
  const leftTabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'bets', icon: Trophy, label: 'Apostas' },
  ];

  const rightTabs = [
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

  const renderTab = (tab: { id: string; icon: any; label: string }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        key={tab.id}
        onClick={() => handleTabClick(tab.id)}
        className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'text-primary' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_hsl(145,77%,46%)]' : ''}`} />
        <span className="text-xs font-medium">{tab.label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around relative">
        {/* Left tabs */}
        {leftTabs.map(renderTab)}

        {/* Center Prize Button */}
        <button
          onClick={onPrizeClick}
          className="relative flex flex-col items-center -mt-6"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-cartoon border-4 border-background transition-transform hover:scale-105 active:scale-95">
            <Gift className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-xs font-bold text-accent mt-1">{totalPrize} pts</span>
        </button>

        {/* Right tabs */}
        {rightTabs.map(renderTab)}
      </div>
    </nav>
  );
}
