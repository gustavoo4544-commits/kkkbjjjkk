import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Wallet, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { addCredits, updateBalance } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    setIsProcessing(true);
    
    // Simula processamento do PIX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // R$20 = 1 ponto/crédito
    updateBalance(20);
    addCredits(1);
    
    setIsProcessing(false);
    
    toast({
      title: "Depósito realizado!",
      description: "R$ 20,00 depositado = 1 ponto adicionado",
    });
    
    onClose();
  };

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
            <Wallet className="w-5 h-5 text-primary" />
            Depositar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Valor fixo */}
          <div className="card-3d rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Valor do depósito</p>
            <div className="text-3xl font-bold text-primary">R$ 20,00</div>
            <p className="text-xs text-muted-foreground mt-2">= 1 ponto para apostar</p>
          </div>

          {/* Info */}
          <div className="bg-secondary/50 rounded-lg p-3 text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Cada R$ 20 = 1 ponto
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                1 ponto = 1 aposta
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Deposite mais para apostar mais
              </li>
            </ul>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full btn-primary-glow text-primary-foreground font-bold py-3"
          >
            {isProcessing ? 'Processando...' : 'Depositar via PIX'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
