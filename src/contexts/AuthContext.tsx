import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { Transaction, DepositTransaction, BetTransaction } from '@/components/TransactionReceipt';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BetsByTeam {
  teamName: string;
  teamFlag: string;
  bettors: number;
  amount: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  transactions: Transaction[];
  totalPrize: number;
  totalBettors: number;
  betsByTeam: BetsByTeam[];
  login: (name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addCredits: (amount: number) => Promise<void>;
  addDeposit: (amount: number, points: number) => Promise<void>;
  addBet: (teamId: string, teamName: string, teamFlag: string, amount: number) => Promise<boolean>;
  refreshPrizeStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'bolacup_user_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPrize, setTotalPrize] = useState(0);
  const [totalBettors, setTotalBettors] = useState(0);
  const [betsByTeam, setBetsByTeam] = useState<BetsByTeam[]>([]);

  // Load user profile from Supabase
  const loadUserProfile = useCallback(async (profileId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return null;
      }

      if (profile) {
        const loadedUser: User = {
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          balance: Number(profile.balance),
          credits: profile.credits,
          createdAt: new Date(profile.created_at),
        };
        setUser(loadedUser);
        return loadedUser;
      }
      return null;
    } catch (err) {
      console.error('Error in loadUserProfile:', err);
      return null;
    }
  }, []);

  // Load user transactions
  const loadTransactions = useCallback(async (profileId: string) => {
    try {
      // Load deposits
      const { data: deposits } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      // Load bets
      const { data: bets } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      const allTransactions: Transaction[] = [];

      deposits?.forEach(d => {
        allTransactions.push({
          id: d.id,
          type: 'deposit',
          amount: Number(d.amount),
          points: d.points,
          date: new Date(d.created_at),
          status: d.status === 'completed' ? 'completed' : 'pending',
        });
      });

      bets?.forEach(b => {
        allTransactions.push({
          id: b.id,
          type: 'bet',
          teamId: b.team_id,
          teamName: b.team_name,
          teamFlag: b.team_flag,
          amount: b.amount,
          date: new Date(b.created_at),
          status: b.status as 'pending' | 'won' | 'lost',
        });
      });

      // Sort by date
      allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
      setTransactions(allTransactions);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  }, []);

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

  // Initialize: check for saved session
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const savedUserId = localStorage.getItem(STORAGE_KEY);
        if (savedUserId) {
          const loadedUser = await loadUserProfile(savedUserId);
          if (loadedUser) {
            await loadTransactions(savedUserId);
          } else {
            // Profile not found, clear storage
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
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
          refreshPrizeStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadUserProfile, loadTransactions, refreshPrizeStats]);

  // Login: find existing user by phone or create new
  const login = useCallback(async (name: string, phone: string): Promise<boolean> => {
    try {
      // Check if user exists with this phone
      const { data: existingProfile, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (findError) {
        console.error('Error finding profile:', findError);
        toast.error('Erro ao verificar conta');
        return false;
      }

      let profile;

      if (existingProfile) {
        // User exists - log them in
        profile = existingProfile;
        toast.success(`Bem-vindo de volta, ${existingProfile.name}!`);
      } else {
        // Create new user
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            name,
            phone,
            credits: 0,
            balance: 0,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          toast.error('Erro ao criar conta');
          return false;
        }

        profile = newProfile;
        toast.success('Conta criada com sucesso!');
      }

      // Set user state
      const loggedInUser: User = {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        balance: Number(profile.balance),
        credits: profile.credits,
        createdAt: new Date(profile.created_at),
      };
      
      setUser(loggedInUser);
      localStorage.setItem(STORAGE_KEY, profile.id);
      
      // Load transactions
      await loadTransactions(profile.id);
      
      return true;
    } catch (err) {
      console.error('Error in login:', err);
      toast.error('Erro ao fazer login');
      return false;
    }
  }, [loadTransactions]);

  const logout = useCallback(() => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Você saiu da conta');
  }, []);

  const updateBalance = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
  }, []);

  const addCredits = useCallback(async (amount: number) => {
    if (!user) return;

    const newCredits = user.credits + amount;
    
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating credits:', error);
      return;
    }

    setUser(prev => prev ? { ...prev, credits: newCredits } : null);
  }, [user]);

  const addDeposit = useCallback(async (amount: number, points: number) => {
    if (!user) return;

    // Create deposit record
    const { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .insert({
        user_id: user.id,
        amount,
        points,
        status: 'completed',
      })
      .select()
      .single();

    if (depositError) {
      console.error('Error creating deposit:', depositError);
      toast.error('Erro ao registrar depósito');
      return;
    }

    // Update user credits
    const newCredits = user.credits + points;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return;
    }

    // Update local state
    setUser(prev => prev ? { ...prev, credits: newCredits } : null);
    
    const depositTransaction: DepositTransaction = {
      id: deposit.id,
      type: 'deposit',
      amount,
      points,
      date: new Date(deposit.created_at),
      status: 'completed',
    };
    setTransactions(prev => [depositTransaction, ...prev]);
    
    toast.success(`Depósito de R$${amount} confirmado! +${points} créditos`);
  }, [user]);

  const addBet = useCallback(async (teamId: string, teamName: string, teamFlag: string, amount: number): Promise<boolean> => {
    if (!user) return false;

    if (user.credits < amount) {
      toast.error('Créditos insuficientes');
      return false;
    }

    // Create bet record
    const { data: bet, error: betError } = await supabase
      .from('bets')
      .insert({
        user_id: user.id,
        team_id: teamId,
        team_name: teamName,
        team_flag: teamFlag,
        amount,
        status: 'pending',
      })
      .select()
      .single();

    if (betError) {
      console.error('Error creating bet:', betError);
      toast.error('Erro ao registrar aposta');
      return false;
    }

    // Update user credits
    const newCredits = user.credits - amount;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return false;
    }

    // Update local state
    setUser(prev => prev ? { ...prev, credits: newCredits } : null);
    
    const betTransaction: BetTransaction = {
      id: bet.id,
      type: 'bet',
      teamId,
      teamName,
      teamFlag,
      amount,
      date: new Date(bet.created_at),
      status: 'pending',
    };
    setTransactions(prev => [betTransaction, ...prev]);
    
    // Refresh prize stats
    refreshPrizeStats();
    
    return true;
  }, [user, refreshPrizeStats]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
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
