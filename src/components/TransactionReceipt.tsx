import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Wallet, Trophy, Calendar, Hash, Coins } from 'lucide-react';

export interface DepositTransaction {
  id: string;
  type: 'deposit';
  amount: number;
  points: number;
  date: Date;
  status: 'completed' | 'pending';
}

export interface BetTransaction {
  id: string;
  type: 'bet';
  teamId: string;
  teamName: string;
  teamFlag: string;
  amount: number;
  date: Date;
  status: 'pending' | 'won' | 'lost';
}

export type Transaction = DepositTransaction | BetTransaction;

interface TransactionReceiptProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionReceipt({ transaction, isOpen, onClose }: TransactionReceiptProps) {
  if (!transaction) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDeposit = transaction.type === 'deposit';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            {isDeposit ? (
              <>
                <Wallet className="w-5 h-5 text-accent" />
                Comprovante de Depósito
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 text-primary" />
                Comprovante de Aposta
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Receipt Header */}
          <div className="bg-muted/30 rounded-lg p-4 text-center border border-border/50">
            <div className="text-4xl mb-2">
              {isDeposit ? '💰' : (transaction as BetTransaction).teamFlag}
            </div>
            <p className="text-sm text-muted-foreground">
              {isDeposit ? 'Depósito Realizado' : (transaction as BetTransaction).teamName}
            </p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span className="text-sm">ID da Transação</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                #{transaction.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Data</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatDate(transaction.date)}
              </span>
            </div>

            {isDeposit ? (
              <>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">Valor Depositado</span>
                  </div>
                  <span className="text-sm font-bold text-accent">
                    R$ {(transaction as DepositTransaction).amount.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">Pontos Recebidos</span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    +{(transaction as DepositTransaction).points} pontos
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Time Apostado</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {(transaction as BetTransaction).teamFlag} {(transaction as BetTransaction).teamName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">Pontos Apostados</span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {(transaction as BetTransaction).amount} pontos
                  </span>
                </div>
              </>
            )}

            {/* Status */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                transaction.status === 'completed' || transaction.status === 'won'
                  ? 'bg-accent/20 text-accent'
                  : transaction.status === 'pending'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-destructive/20 text-destructive'
              }`}>
                {transaction.status === 'completed' && 'Concluído'}
                {transaction.status === 'pending' && 'Pendente'}
                {transaction.status === 'won' && 'Ganhou'}
                {transaction.status === 'lost' && 'Perdeu'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
