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

const depositOptions = [
  { value: 20, points: 1 },
  { value: 40, points: 2 },
  { value: 80, points: 4 },
  { value: 100, points: 5 },
  { value: 200, points: 10 },
];

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { addCredits, updateBalance } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(20);

  const selectedOption = depositOptions.find(opt => opt.value === selectedAmount) || depositOptions[0];

  const handleDeposit = async () => {
    setIsProcessing(true);
    
    // Simula processamento do PIX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // R$20 = 1 ponto/crédito
    updateBalance(selectedAmount);
    addCredits(selectedOption.points);
    
    setIsProcessing(false);
    
    toast({
      title: "Depósito realizado!",
      description: `R$ ${selectedAmount},00 depositado = ${selectedOption.points} ponto${selectedOption.points > 1 ? 's' : ''} adicionado${selectedOption.points > 1 ? 's' : ''}`,
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
          {/* Opções de valor */}
          <div className="grid grid-cols-3 gap-2">
            {depositOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedAmount(option.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedAmount === option.value
                    ? 'border-primary bg-primary/20 scale-105'
                    : 'border-border bg-secondary/50 hover:border-primary/50'
                }`}
              >
                <div className="text-lg font-bold text-foreground">R$ {option.value}</div>
                <div className="text-xs text-muted-foreground">{option.points} ponto{option.points > 1 ? 's' : ''}</div>
              </button>
            ))}
          </div>

          {/* Valor selecionado */}
          <div className="card-3d rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Valor selecionado</p>
            <div className="text-3xl font-bold text-primary">R$ {selectedAmount},00</div>
            <p className="text-xs text-muted-foreground mt-2">= {selectedOption.points} ponto{selectedOption.points > 1 ? 's' : ''} para apostar</p>
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
            {isProcessing ? 'Processando...' : `Depositar R$ ${selectedAmount},00 via PIX`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
