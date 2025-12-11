import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { User } from '@/types/user';
import { Transaction, DepositTransaction, BetTransaction } from '@/components/TransactionReceipt';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allBets, setAllBets] = useState<BetTransaction[]>([]);

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
    setAllBets(prev => [...prev, bet]);
    setUser(prev => prev ? { ...prev, credits: prev.credits - amount } : null);
  }, []);

  // Calculate prize pool stats
  const { totalPrize, totalBettors, betsByTeam } = useMemo(() => {
    const total = allBets.reduce((sum, bet) => sum + bet.amount, 0);
    const uniqueBettors = new Set(allBets.map(bet => bet.id)).size;
    
    const teamMap = new Map<string, BetsByTeam>();
    allBets.forEach(bet => {
      const existing = teamMap.get(bet.teamId);
      if (existing) {
        existing.bettors += 1;
        existing.amount += bet.amount;
      } else {
        teamMap.set(bet.teamId, {
          teamName: bet.teamName,
          teamFlag: bet.teamFlag,
          bettors: 1,
          amount: bet.amount,
        });
      }
    });
    
    const sortedTeams = Array.from(teamMap.values()).sort((a, b) => b.amount - a.amount);
    
    return {
      totalPrize: total,
      totalBettors: uniqueBettors,
      betsByTeam: sortedTeams,
    };
  }, [allBets]);

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
