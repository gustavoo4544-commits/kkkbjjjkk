import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Team } from '@/types/user';
import { Users, Trophy, Coins, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BetModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BetModal({ team, isOpen, onClose, onSuccess }: BetModalProps) {
  const [loading, setLoading] = useState(false);
  const { user, profile, addCredits } = useAuth();

  const handleBet = async () => {
    if (!user || !profile || !team) return;
    
    if (profile.credits < 1) {
      toast({
        title: "Créditos insuficientes",
        description: "Faça um depósito para continuar apostando.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save bet to database
      const { error } = await supabase
        .from('bets')
        .insert({
          user_id: user.id,
          team_id: team.id,
          team_name: team.name,
          team_flag: team.flag,
          amount: 1,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      // Deduct 1 credit
      await addCredits(-1);

      toast({
        title: "Aposta realizada!",
        description: `Você apostou 1 ponto no ${team.name}.`,
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar a aposta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

          {/* Credits info */}
          <div className="card-3d rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Custo da aposta</p>
            <div className="text-3xl font-bold text-primary">1 ponto</div>
            <p className="text-xs text-muted-foreground mt-2">
              Você tem {profile?.credits || 0} ponto{(profile?.credits || 0) !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleBet}
            disabled={loading || (profile?.credits || 0) < 1}
            className="w-full btn-primary-glow text-primary-foreground font-bold py-3 text-base"
          >
            {loading ? 'Processando...' : 'Apostar 1 ponto'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
