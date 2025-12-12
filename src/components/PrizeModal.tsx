import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Users, DollarSign, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrize: number;
  totalBettors: number;
  betsByTeam: { teamName: string; teamFlag: string; bettors: number; amount: number }[];
}

// O prêmio já vem em R$ da API, não precisa multiplicar
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Converte R$ para pontos (R$20 = 1 ponto)
const toPoints = (value: number) => Math.floor(value / 20);

export function PrizeModal({ isOpen, onClose, totalPrize, totalBettors, betsByTeam }: PrizeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-sm mx-auto bg-gradient-to-b from-card to-card/95 border-2 border-accent/40 rounded-2xl shadow-cartoon p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent via-accent/90 to-primary p-4 text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          <Trophy className="w-10 h-10 text-primary-foreground mx-auto mb-1 drop-shadow-lg" />
          <h2 className="text-lg font-black text-primary-foreground tracking-tight">
            🏆 PRÊMIO DA COPA 🏆
          </h2>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Prêmio Total em Destaque */}
          <div className="relative bg-gradient-to-br from-accent/30 via-accent/20 to-primary/10 rounded-xl p-4 text-center border-2 border-accent/50 shadow-cartoon-sm overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Prêmio Total</span>
            </div>
            <p className="text-3xl font-black text-accent drop-shadow-sm">
              {formatCurrency(totalPrize)}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{toPoints(totalPrize)} créditos acumulados</p>
            </div>
          </div>

          {/* Stats em Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-primary/10 rounded-xl p-3 text-center border-2 border-primary/20 shadow-cartoon-sm">
              <Users className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-black text-foreground">{totalBettors}</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Apostadores</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-3 text-center border-2 border-accent/20 shadow-cartoon-sm">
              <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xl font-black text-foreground">{betsByTeam.length}</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Times</p>
            </div>
          </div>

          {/* Explicação */}
          <div className="bg-gradient-to-r from-primary/15 to-accent/15 rounded-xl p-3 border border-primary/30">
            <p className="text-xs text-center leading-relaxed">
              <span className="font-bold text-foreground">Como funciona:</span>{' '}
              <span className="text-muted-foreground">Prêmio dividido entre quem apostar no{' '}</span>
              <span className="text-primary font-bold">time campeão</span>
              <span className="text-muted-foreground">! 🌟</span>
            </p>
          </div>

          {/* Apostas por Time */}
          {betsByTeam.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <span className="flex-1 h-px bg-border"></span>
                Apostas por Time
                <span className="flex-1 h-px bg-border"></span>
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {betsByTeam.map((team, index) => (
                  <div 
                    key={team.teamName}
                    className="flex items-center justify-between bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-2 border-2 border-border/50 shadow-cartoon-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground w-4">#{index + 1}</span>
                      <span className="text-xl">{team.teamFlag}</span>
                      <span className="font-bold text-xs">{team.teamName}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-accent">{formatCurrency(team.amount)}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">
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
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">Nenhuma aposta ainda. Seja o primeiro! 🚀</p>
            </div>
          )}

          {/* Botão Fechar */}
          <Button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-cartoon-sm"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
