import { Trophy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromoBannerProps {
  onBetClick?: () => void;
}

export function PromoBanner({ onBetClick }: PromoBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 mb-6" style={{
      background: 'linear-gradient(135deg, hsl(145 77% 46%) 0%, hsl(145 77% 35%) 100%)'
    }}>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-accent" />
          <span className="font-bold text-accent text-sm">SUPER PRÊMIO</span>
        </div>
        <h3 className="text-lg font-bold text-primary-foreground mb-2">
          Aposte no seu campeão!
        </h3>
        <p className="text-sm text-primary-foreground/80 mb-4">
          Participe do maior bolão da Copa e concorra a prêmios incríveis!
        </p>
        <div className="flex items-center gap-3">
          <Button 
            onClick={onBetClick}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6"
          >
            Apostar Agora
          </Button>
          <button className="flex items-center gap-1 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            Ver regras
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2" />
    </div>
  );
}
