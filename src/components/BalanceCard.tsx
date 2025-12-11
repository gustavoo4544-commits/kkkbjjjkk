import { Wallet, ArrowUpRight, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface BalanceCardProps {
  onDepositClick: () => void;
}

export function BalanceCard({ onDepositClick }: BalanceCardProps) {
  const { profile, isAuthenticated } = useAuth();

  return (
    <div className="card-3d rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Saldo disponível</span>
        </div>
        {isAuthenticated && (
          <Button
            onClick={onDepositClick}
            size="sm"
            className="btn-accent-glow text-accent-foreground font-semibold text-xs px-3 h-7"
          >
            <ArrowUpRight className="w-3 h-3 mr-1" />
            Sacar
          </Button>
        )}
      </div>
      <div className="text-3xl font-bold text-foreground">
        R$ {isAuthenticated ? Number(profile?.balance || 0).toFixed(2).replace('.', ',') : '0,00'}
      </div>
      {isAuthenticated && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {profile?.credits || 0} créditos
          </span>
        </div>
      )}
    </div>
  );
}