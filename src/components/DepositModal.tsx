import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Wallet, Check, Copy, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeSVG } from 'qrcode.react';

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

type DepositStep = 'select' | 'payment' | 'success';
type PaymentStatus = 'pending' | 'waiting' | 'completed' | 'error';

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { user, addDeposit } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(20);
  const [step, setStep] = useState<DepositStep>('select');
  const [pixCode, setPixCode] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isCreating, setIsCreating] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const selectedOption = depositOptions.find(opt => opt.value === selectedAmount) || depositOptions[0];

  // Cleanup polling on unmount or close
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setPixCode('');
      setIdentifier('');
      setPaymentStatus('pending');
      setIsCreating(false);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [isOpen]);

  const createPixPayment = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para depositar",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const { data, error } = await supabase.functions.invoke('pix-payment', {
        body: {
          action: 'create',
          amount: selectedAmount,
          userId: user.id,
          userName: user.name,
          userPhone: user.phone,
        }
      });

      if (error) throw error;

      if (data.success) {
        setPixCode(data.pix_code);
        setIdentifier(data.identifier);
        setStep('payment');
        setPaymentStatus('waiting');
        
        // Start polling for payment status
        startPolling(data.identifier);
      } else {
        throw new Error(data.error || 'Erro ao criar pagamento');
      }
    } catch (error) {
      console.error('Error creating PIX payment:', error);
      toast({
        title: "Erro ao criar pagamento",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const startPolling = (paymentIdentifier: string) => {
    // Poll every 3 seconds
    pollingRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('pix-payment', {
          body: {
            action: 'check-status',
            identifier: paymentIdentifier,
          }
        });

        if (error) throw error;

        console.log('Payment status:', data.status);

        if (data.status === 'completed') {
          // Payment confirmed!
          setPaymentStatus('completed');
          setStep('success');
          
          // Stop polling
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }

          // Register deposit (this updates credits in DB and local state)
          await addDeposit(selectedAmount, selectedOption.points);

          toast({
            title: "Pagamento confirmado! 🎉",
            description: `R$ ${selectedAmount},00 = ${selectedOption.points} ponto${selectedOption.points > 1 ? 's' : ''}`,
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 3000);
  };

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      toast({
        title: "Código copiado!",
        description: "Cole no app do seu banco",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Tente selecionar e copiar manualmente",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none z-10"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-foreground flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            {step === 'select' && 'Depositar'}
            {step === 'payment' && 'Pagamento PIX'}
            {step === 'success' && 'Sucesso!'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {step === 'select' && 'Selecione o valor do depósito'}
            {step === 'payment' && 'Escaneie o QR Code ou copie o código PIX'}
            {step === 'success' && 'Seu pagamento foi confirmado'}
          </DialogDescription>
        </DialogHeader>
        
        {/* Step 1: Select Amount */}
        {step === 'select' && (
          <div className="space-y-4 mt-4">
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

            <div className="card-3d rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Valor selecionado</p>
              <div className="text-3xl font-bold text-primary">R$ {selectedAmount},00</div>
              <p className="text-xs text-muted-foreground mt-2">= {selectedOption.points} ponto{selectedOption.points > 1 ? 's' : ''} para apostar</p>
            </div>

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
                  Pagamento instantâneo via PIX
                </li>
              </ul>
            </div>

            <Button
              onClick={createPixPayment}
              disabled={isCreating}
              className="w-full btn-primary-glow text-primary-foreground font-bold py-3"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                `Depositar R$ ${selectedAmount},00 via PIX`
              )}
            </Button>
          </div>
        )}

        {/* Step 2: Payment QR Code */}
        {step === 'payment' && (
          <div className="space-y-4 mt-4">
            <div className="bg-white rounded-xl p-4 flex justify-center">
              <QRCodeSVG 
                value={pixCode} 
                size={200}
                level="H"
                includeMargin
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Valor a pagar</p>
              <div className="text-2xl font-bold text-primary">R$ {selectedAmount},00</div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-2">Código PIX (Copia e Cola)</p>
              <div className="bg-background rounded p-2 text-xs break-all font-mono max-h-20 overflow-y-auto">
                {pixCode}
              </div>
            </div>

            <Button
              onClick={copyPixCode}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar código PIX
            </Button>

            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {paymentStatus === 'waiting' ? 'Aguardando pagamento...' : 'Verificando pagamento...'}
              </span>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Escaneie o QR Code ou copie o código acima e cole no app do seu banco.
              O pagamento será confirmado automaticamente.
            </p>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="space-y-4 mt-4 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Pagamento Confirmado!</h3>
              <p className="text-muted-foreground">
                Seu depósito de <span className="text-primary font-bold">R$ {selectedAmount},00</span> foi processado com sucesso.
              </p>
            </div>

            <div className="card-3d rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Você recebeu</p>
              <div className="text-3xl font-bold text-primary">
                {selectedOption.points} ponto{selectedOption.points > 1 ? 's' : ''}
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full btn-primary-glow text-primary-foreground font-bold py-3"
            >
              Começar a apostar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
