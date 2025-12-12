import { Wallet, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface BalanceCardProps {
  onDepositClick: () => void;
}

export function BalanceCard({ onDepositClick }: BalanceCardProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="card-cartoon p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground font-semibold">Saldo disponível</span>
        </div>
        {isAuthenticated && (
          <Button
            onClick={onDepositClick}
            size="sm"
            className="btn-cartoon bg-primary text-primary-foreground font-bold text-xs px-3 h-7"
          >
            <Plus className="w-3 h-3 mr-1" />
            Depositar
          </Button>
        )}
      </div>
      <div className="text-3xl font-black text-foreground tracking-tight">
        R$ {isAuthenticated ? user?.balance.toFixed(2).replace('.', ',') : '0,00'}
      </div>
      {isAuthenticated && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full font-bold border-2 border-primary/30">
            {user?.credits} créditos
          </span>
        </div>
      )}
    </div>
  );
}
