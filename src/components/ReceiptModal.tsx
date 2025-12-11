import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Receipt, Calendar, User, Wallet, Trophy, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Deposit {
  id: string;
  amount: number;
  points: number;
  status: string;
  created_at: string;
}

interface Bet {
  id: string;
  team_name: string;
  team_flag: string;
  amount: number;
  status: string;
  created_at: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'bet';
  data: Deposit | Bet | null;
}

export function ReceiptModal({ isOpen, onClose, type, data }: ReceiptModalProps) {
  const { profile } = useAuth();

  if (!data) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDeposit = type === 'deposit';
  const deposit = data as Deposit;
  const bet = data as Bet;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-foreground flex items-center justify-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Comprovante
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Type badge */}
          <div className="text-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isDeposit 
                ? 'bg-primary/20 text-primary' 
                : 'bg-accent/20 text-accent'
            }`}>
              {isDeposit ? 'Depósito PIX' : 'Aposta'}
            </span>
          </div>

          {/* Main info */}
          <div className="card-3d rounded-xl p-4 text-center">
            {isDeposit ? (
              <>
                <div className="text-3xl font-bold text-primary">
                  R$ {Number(deposit.amount).toFixed(2).replace('.', ',')}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  = {deposit.points} ponto{deposit.points > 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <>
                <span className="text-4xl mb-2 block">{bet.team_flag}</span>
                <div className="text-xl font-bold text-foreground">{bet.team_name}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {bet.amount} ponto{bet.amount > 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">Nome</span>
              </div>
              <span className="text-sm font-medium text-foreground">{profile?.name}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Data</span>
              </div>
              <span className="text-sm font-medium text-foreground">{formatDate(data.created_at)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                {isDeposit ? <Wallet className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                <span className="text-sm">Status</span>
              </div>
              <div className="flex items-center gap-1">
                {data.status === 'completed' || data.status === 'pending' ? (
                  data.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <Clock className="w-4 h-4 text-accent" />
                  )
                ) : null}
                <span className={`text-sm font-medium ${
                  data.status === 'completed' ? 'text-primary' : 'text-accent'
                }`}>
                  {data.status === 'completed' ? 'Confirmado' : 'Pendente'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="w-4 h-4" />
                <span className="text-sm">ID</span>
              </div>
              <span className="text-xs font-mono text-foreground">{data.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
