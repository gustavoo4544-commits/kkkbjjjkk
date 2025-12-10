import { useState } from 'react';
import { Header } from '@/components/Header';
import { BalanceCard } from '@/components/BalanceCard';
import { TeamCard } from '@/components/TeamCard';
import { PromoBanner } from '@/components/PromoBanner';
import { BottomNav } from '@/components/BottomNav';
import { BetModal } from '@/components/BetModal';
import { LoginModal } from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { teams } from '@/data/teams';
import { Team } from '@/types/user';
import { Trophy, History, User, Wallet, Calendar, Phone } from 'lucide-react';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleTeamClick = (team: Team) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setSelectedTeam(team);
    setShowBetModal(true);
  };

  const handleDepositClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <BalanceCard onDepositClick={handleDepositClick} />
            <PromoBanner />
            
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Times para apostar
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => handleTeamClick(team)}
                  />
                ))}
              </div>
            </section>
          </>
        );
      
      case 'bets':
        return (
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Minhas Apostas
            </h2>
            <div className="card-3d rounded-xl p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Você ainda não fez nenhuma aposta.</p>
              <p className="text-sm text-muted-foreground mt-2">Escolha um time e comece a apostar!</p>
            </div>
          </section>
        );
      
      case 'history':
        return (
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Histórico
            </h2>
            <div className="card-3d rounded-xl p-8 text-center">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
              <p className="text-sm text-muted-foreground mt-2">Suas transações aparecerão aqui.</p>
            </div>
          </section>
        );
      
      case 'profile':
        return (
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Meu Perfil
            </h2>
            
            {/* Profile Header */}
            <div className="card-3d rounded-xl p-5 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{user?.name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Phone className="w-3 h-3" />
                    {user?.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="card-3d rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Saldo</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  R$ {user?.balance.toFixed(2).replace('.', ',')}
                </div>
              </div>
              <div className="card-3d rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Créditos</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {user?.credits}
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="card-3d rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Membro desde {user?.createdAt.toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Header />
      
      <main className="pt-16 pb-20 px-4 max-w-lg mx-auto">
        {renderContent()}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLoginRequired={() => setShowLoginModal(true)}
        isAuthenticated={isAuthenticated}
      />

      <BetModal
        team={selectedTeam}
        isOpen={showBetModal}
        onClose={() => setShowBetModal(false)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
