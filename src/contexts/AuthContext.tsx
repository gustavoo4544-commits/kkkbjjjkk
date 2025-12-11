import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { Transaction, DepositTransaction, BetTransaction } from '@/components/TransactionReceipt';
import { supabase } from '@/integrations/supabase/client';

interface BetsByTeam {
  teamName: string;
  teamFlag: string;
  bettors: number;
  amount: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  totalPrize: number;
  totalBettors: number;
  betsByTeam: BetsByTeam[];
  login: (name: string, phone: string) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addCredits: (amount: number) => void;
  addDeposit: (amount: number, points: number) => void;
  addBet: (teamId: string, teamName: string, teamFlag: string, amount: number) => void;
  refreshPrizeStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPrize, setTotalPrize] = useState(0);
  const [totalBettors, setTotalBettors] = useState(0);
  const [betsByTeam, setBetsByTeam] = useState<BetsByTeam[]>([]);

  // Fetch prize statistics from database
  const refreshPrizeStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_prize_statistics');
      
      if (error) {
        console.error('Error fetching prize stats:', error);
        return;
      }
      
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const stats = data as { total_prize?: number; total_bettors?: number; bets_by_team?: any[] };
        setTotalPrize(stats.total_prize || 0);
        setTotalBettors(stats.total_bettors || 0);
        setBetsByTeam(
          (stats.bets_by_team || []).map((team: any) => ({
            teamName: team.teamName,
            teamFlag: team.teamFlag,
            bettors: Number(team.bettors),
            amount: Number(team.total_amount),
          }))
        );
      }
    } catch (err) {
      console.error('Error in refreshPrizeStats:', err);
    }
  }, []);

  // Load prize stats on mount and set up realtime subscription
  useEffect(() => {
    refreshPrizeStats();

    // Subscribe to realtime changes on bets table
    const channel = supabase
      .channel('bets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bets'
        },
        () => {
          // Refresh stats when any bet changes
          refreshPrizeStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshPrizeStats]);

  const login = useCallback((name: string, phone: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name,
      phone,
      balance: 0,
      credits: 0,
      createdAt: new Date(),
    };
    setUser(newUser);
  }, []);

  const addCredits = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, credits: prev.credits + amount } : null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTransactions([]);
  }, []);

  const updateBalance = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
  }, []);

  const addDeposit = useCallback((amount: number, points: number) => {
    const deposit: DepositTransaction = {
      id: Math.random().toString(36).substring(7),
      type: 'deposit',
      amount,
      points,
      date: new Date(),
      status: 'completed',
    };
    setTransactions(prev => [deposit, ...prev]);
  }, []);

  const addBet = useCallback((teamId: string, teamName: string, teamFlag: string, amount: number) => {
    const bet: BetTransaction = {
      id: Math.random().toString(36).substring(7),
      type: 'bet',
      teamId,
      teamName,
      teamFlag,
      amount,
      date: new Date(),
      status: 'pending',
    };
    setTransactions(prev => [bet, ...prev]);
    setUser(prev => prev ? { ...prev, credits: prev.credits - amount } : null);
    
    // Refresh stats after adding bet (the realtime will also trigger this)
    refreshPrizeStats();
  }, [refreshPrizeStats]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      transactions,
      totalPrize,
      totalBettors,
      betsByTeam,
      login,
      logout,
      updateBalance,
      addCredits,
      addDeposit,
      addBet,
      refreshPrizeStats,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
