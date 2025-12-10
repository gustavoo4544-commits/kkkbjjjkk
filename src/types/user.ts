export interface User {
  id: string;
  name: string;
  phone: string;
  balance: number;
  credits: number;
  createdAt: Date;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  flag: string;
  popularity: number;
  totalBet: number;
  bettors: number;
  estimatedPrize: number;
}

export interface Bet {
  id: string;
  teamId: string;
  teamName: string;
  amount: number;
  date: Date;
  status: 'pending' | 'won' | 'lost';
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bet';
  amount: number;
  date: Date;
  status: 'approved' | 'pending' | 'rejected';
  description: string;
}
