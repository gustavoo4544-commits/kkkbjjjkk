import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Users, Coins } from 'lucide-react';

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrize: number;
  totalBettors: number;
  betsByTeam: { teamName: string; teamFlag: string; bettors: number; amount: number }[];
}

export function PrizeModal({ isOpen, onClose, totalPrize, totalBettors, betsByTeam }: PrizeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border-2 border-primary/30 rounded-2xl shadow-cartoon">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            Prêmio da Copa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Total Prize Pool */}
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-6 text-center border-2 border-accent/30 shadow-cartoon-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Prêmio Total</span>
            </div>
            <p className="text-4xl font-bold text-accent">{totalPrize}</p>
            <p className="text-sm text-muted-foreground mt-1">pontos</p>
          </div>

          {/* Total Bettors */}
          <div className="bg-muted/50 rounded-xl p-4 text-center border-2 border-border shadow-cartoon-sm">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total de Apostadores</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalBettors}</p>
          </div>

          {/* Explanation */}
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              O prêmio será dividido entre todos que apostarem no <span className="text-primary font-semibold">time campeão</span> da Copa do Mundo!
            </p>
          </div>

          {/* Bets by Team */}
          {betsByTeam.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Apostas por Time</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {betsByTeam.map((team) => (
                  <div 
                    key={team.teamName}
                    className="flex items-center justify-between bg-muted/30 rounded-lg p-3 border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{team.teamFlag}</span>
                      <span className="font-medium text-sm">{team.teamName}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{team.amount} pts</p>
                      <p className="text-xs text-muted-foreground">{team.bettors} apostador{team.bettors !== 1 ? 'es' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
