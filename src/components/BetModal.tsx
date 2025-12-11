import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Team } from '@/types/user';
import { Users, Trophy, Coins, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface BetModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BetModal({ team, isOpen, onClose }: BetModalProps) {
  const [amount, setAmount] = useState(20);
  const { user, updateBalance } = useAuth();
  const amounts = [10, 20, 50, 100];

  const handleBet = () => {
    if (!user) return;
    
    if (user.balance < amount) {
      toast({
        title: "Saldo insuficiente",
        description: "Faça um depósito para continuar apostando.",
        variant: "destructive",
      });
      return;
    }

    updateBalance(-amount);
    toast({
      title: "Aposta realizada!",
      description: `Você apostou R$ ${amount},00 no ${team?.name}.`,
    });
    onClose();
  };

  if (!team) return null;

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
          <div className="text-center mb-2">
            <span className="text-5xl">{team.flag}</span>
          </div>
          <DialogTitle className="text-xl font-bold text-center text-foreground">
            {team.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="card-3d rounded-lg p-3 text-center">
              <Coins className="w-4 h-4 text-accent mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-sm font-bold text-foreground">
                R$ {team.totalBet.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="card-3d rounded-lg p-3 text-center">
              <Users className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Apostadores</div>
              <div className="text-sm font-bold text-foreground">{team.bettors}</div>
            </div>
            <div className="card-3d rounded-lg p-3 text-center">
              <Trophy className="w-4 h-4 text-accent mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Prêmio</div>
              <div className="text-sm font-bold text-foreground">
                R$ {team.estimatedPrize.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Valor da aposta
            </label>
            <div className="grid grid-cols-4 gap-2">
              {amounts.map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value)}
                  className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                    amount === value
                      ? 'bg-primary text-primary-foreground glow-green'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  R$ {value}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleBet}
            className="w-full btn-primary-glow text-primary-foreground font-bold py-3 text-base"
          >
            Apostar R$ {amount},00
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
