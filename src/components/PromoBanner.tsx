import { Trophy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromoBannerProps {
  onBetClick?: () => void;
}

export function PromoBanner({ onBetClick }: PromoBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 mb-6" style={{
      background: 'linear-gradient(135deg, hsl(145 77% 46%) 0%, hsl(145 77% 35%) 100%)',
      boxShadow: '6px 6px 0px hsl(145 77% 25%), 0 0 0 3px hsl(145 77% 25%)'
    }}>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-accent drop-shadow-lg" />
          <span className="font-black text-accent text-sm tracking-wider">SUPER PRÊMIO</span>
        </div>
        <h3 className="text-xl font-black text-primary-foreground mb-2 tracking-tight">
          Aposte no seu campeão!
        </h3>
        <p className="text-sm text-primary-foreground/90 mb-4 font-medium">
          Participe do maior bolão da Copa e concorra a prêmios incríveis!
        </p>
        <div className="flex items-center gap-3">
          <Button 
            onClick={onBetClick}
            className="btn-cartoon bg-accent text-accent-foreground hover:bg-accent/90 font-black px-6"
          >
            Apostar Agora
          </Button>
          <button className="flex items-center gap-1 text-sm font-bold text-primary-foreground/90 hover:text-primary-foreground transition-colors">
            Ver regras
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Decorative elements - cartoon style */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/15 rounded-full -translate-y-1/2 translate-x-1/2 border-4 border-primary-foreground/20" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/15 rounded-full translate-y-1/2 -translate-x-1/2 border-4 border-primary-foreground/20" />
    </div>
  );
}
