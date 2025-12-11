import { History, Wallet, Trophy, ChevronRight } from 'lucide-react';
import { Transaction, DepositTransaction, BetTransaction } from './TransactionReceipt';

interface HistoryListProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
}

export function HistoryList({ transactions, onTransactionClick }: HistoryListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="card-3d rounded-xl p-8 text-center">
        <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
        <p className="text-sm text-muted-foreground mt-2">Suas transações aparecerão aqui.</p>
      </div>
    );
  }

  // Separate deposits and bets
  const deposits = transactions.filter(t => t.type === 'deposit') as DepositTransaction[];
  const bets = transactions.filter(t => t.type === 'bet') as BetTransaction[];

  return (
    <div className="space-y-6">
      {/* Deposits Section */}
      {deposits.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent" />
            Depósitos ({deposits.length})
          </h3>
          <div className="space-y-2">
            {deposits.map((deposit) => (
              <button
                key={deposit.id}
                onClick={() => onTransactionClick(deposit)}
                className="w-full card-3d rounded-xl p-4 flex items-center justify-between hover:scale-[1.02] transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      R$ {deposit.amount.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(deposit.date)} • +{deposit.points} pontos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    deposit.status === 'completed' 
                      ? 'bg-accent/20 text-accent' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {deposit.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bets Section */}
      {bets.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Apostas ({bets.length})
          </h3>
          <div className="space-y-2">
            {bets.map((bet) => (
              <button
                key={bet.id}
                onClick={() => onTransactionClick(bet)}
                className="w-full card-3d rounded-xl p-4 flex items-center justify-between hover:scale-[1.02] transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    {bet.teamFlag}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      {bet.teamName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(bet.date)} • {bet.amount} pontos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    bet.status === 'won' 
                      ? 'bg-accent/20 text-accent'
                      : bet.status === 'lost'
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {bet.status === 'won' && 'Ganhou'}
                    {bet.status === 'lost' && 'Perdeu'}
                    {bet.status === 'pending' && 'Pendente'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
