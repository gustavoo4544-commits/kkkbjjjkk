import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BalanceCard } from '@/components/BalanceCard';
import { TeamCard } from '@/components/TeamCard';
import { PromoBanner } from '@/components/PromoBanner';
import { BottomNav } from '@/components/BottomNav';
import { BetModal } from '@/components/BetModal';
import { LoginModal } from '@/components/LoginModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { useAuth } from '@/contexts/AuthContext';
import { teams } from '@/data/teams';
import { Team } from '@/types/user';
import { Trophy, History, User, Wallet, Calendar, Phone, Coins, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Deposit {
  id: string;
  amount: number;
  points: number;
  status: string;
  created_at: string;
}

interface Bet {
  id: string;
  team_id: string;
  team_name: string;
  team_flag: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptType, setReceiptType] = useState<'deposit' | 'bet'>('deposit');
  const [receiptData, setReceiptData] = useState<Deposit | Bet | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const { user, profile, isAuthenticated, loading, refreshProfile } = useAuth();

  const fetchHistory = async () => {
    if (!user) return;

    const [depositsRes, betsRes] = await Promise.all([
      supabase.from('deposits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('bets').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    if (depositsRes.data) setDeposits(depositsRes.data as Deposit[]);
    if (betsRes.data) setBets(betsRes.data as Bet[]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated, user]);

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

  const handleReceiptClick = (type: 'deposit' | 'bet', data: Deposit | Bet) => {
    setReceiptType(type);
    setReceiptData(data);
    setShowReceiptModal(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              Apostar em Times
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Escolha um time para apostar. Cada aposta custa 1 ponto.
            </p>
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
        );
      
      case 'history':
        return (
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Histórico
            </h2>
            
            {deposits.length === 0 && bets.length === 0 ? (
              <div className="card-3d rounded-xl p-8 text-center">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
                <p className="text-sm text-muted-foreground mt-2">Suas transações aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Deposits */}
                {deposits.map((deposit) => (
                  <button
                    key={deposit.id}
                    onClick={() => handleReceiptClick('deposit', deposit)}
                    className="w-full card-3d rounded-xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Depósito PIX</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(deposit.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">+ R$ {Number(deposit.amount).toFixed(2).replace('.', ',')}</p>
                      <p className="text-xs text-muted-foreground">{deposit.points} pt{deposit.points > 1 ? 's' : ''}</p>
                    </div>
                  </button>
                ))}

                {/* Bets */}
                {bets.map((bet) => (
                  <button
                    key={bet.id}
                    onClick={() => handleReceiptClick('bet', bet)}
                    className="w-full card-3d rounded-xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl">
                      {bet.team_flag}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Aposta - {bet.team_name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(bet.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">- {bet.amount} pt</p>
                      <p className="text-xs text-muted-foreground capitalize">{bet.status === 'pending' ? 'Pendente' : bet.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
                  <h3 className="font-bold text-foreground text-lg">{profile?.name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Phone className="w-3 h-3" />
                    {profile?.phone}
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
                  R$ {Number(profile?.balance || 0).toFixed(2).replace('.', ',')}
                </div>
              </div>
              <div className="card-3d rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Créditos</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {profile?.credits || 0}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="card-3d rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Depósitos</span>
                </div>
                <div className="text-xl font-bold text-foreground">{deposits.length}</div>
              </div>
              <div className="card-3d rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Apostas</span>
                </div>
                <div className="text-xl font-bold text-foreground">{bets.length}</div>
              </div>
            </div>

            {/* Member Since */}
            <div className="card-3d rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Membro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        onSuccess={() => {
          fetchHistory();
          refreshProfile();
        }}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        type={receiptType}
        data={receiptData}
      />
    </div>
  );
}
