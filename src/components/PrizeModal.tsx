import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Users, DollarSign, TrendingUp } from 'lucide-react';

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrize: number;
  totalBettors: number;
  betsByTeam: { teamName: string; teamFlag: string; bettors: number; amount: number }[];
}

// Cada ponto = R$20, então o prêmio em R$ é totalPrize * 20
const formatCurrency = (points: number) => {
  const value = points * 20;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function PrizeModal({ isOpen, onClose, totalPrize, totalBettors, betsByTeam }: PrizeModalProps) {
  const prizeInReais = totalPrize * 20;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-card to-card/95 border-2 border-accent/40 rounded-3xl shadow-cartoon p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent via-accent/90 to-primary p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50"></div>
          <Trophy className="w-12 h-12 text-primary-foreground mx-auto mb-2 drop-shadow-lg animate-bounce" />
          <h2 className="text-2xl font-black text-primary-foreground tracking-tight">
            🏆 PRÊMIO DA COPA 🏆
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Prêmio Total em Destaque */}
          <div className="relative bg-gradient-to-br from-accent/30 via-accent/20 to-primary/10 rounded-2xl p-6 text-center border-3 border-accent/50 shadow-cartoon overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-accent uppercase tracking-widest">Prêmio Total</span>
            </div>
            <p className="text-5xl font-black text-accent drop-shadow-sm">
              {formatCurrency(totalPrize)}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Acumulado de {totalPrize} créditos</p>
            </div>
          </div>

          {/* Stats em Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-xl p-4 text-center border-2 border-primary/20 shadow-cartoon-sm">
              <Users className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-black text-foreground">{totalBettors}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase">Apostadores</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-4 text-center border-2 border-accent/20 shadow-cartoon-sm">
              <Trophy className="w-6 h-6 text-accent mx-auto mb-1" />
              <p className="text-2xl font-black text-foreground">{betsByTeam.length}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase">Times</p>
            </div>
          </div>

          {/* Explicação */}
          <div className="bg-gradient-to-r from-primary/15 to-accent/15 rounded-xl p-4 border border-primary/30">
            <p className="text-sm text-center leading-relaxed">
              <span className="font-bold text-foreground">Como funciona:</span>{' '}
              <span className="text-muted-foreground">O prêmio será dividido entre todos que apostarem no{' '}</span>
              <span className="text-primary font-bold">time campeão</span>
              <span className="text-muted-foreground"> da Copa do Mundo! 🌟</span>
            </p>
          </div>

          {/* Apostas por Time */}
          {betsByTeam.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <span className="flex-1 h-px bg-border"></span>
                Apostas por Time
                <span className="flex-1 h-px bg-border"></span>
              </h4>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {betsByTeam.map((team, index) => (
                  <div 
                    key={team.teamName}
                    className="flex items-center justify-between bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-3 border-2 border-border/50 shadow-cartoon-sm hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5">#{index + 1}</span>
                      <span className="text-2xl drop-shadow">{team.teamFlag}</span>
                      <span className="font-bold text-sm">{team.teamName}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-accent">{formatCurrency(team.amount)}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {team.bettors} {team.bettors === 1 ? 'apostador' : 'apostadores'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {betsByTeam.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm">Nenhuma aposta ainda. Seja o primeiro! 🚀</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
