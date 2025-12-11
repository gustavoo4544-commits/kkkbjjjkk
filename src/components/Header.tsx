import { useState } from 'react';
import { Trophy, Plus, Menu, X, User, LogOut, History, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { DepositModal } from './DepositModal';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center glow-green">
              <Trophy className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">BolaCup</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => setShowDepositModal(true)}
                  className="btn-primary-glow text-primary-foreground font-semibold text-sm px-3 py-1.5 h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Depositar
                </Button>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  {showMenu ? (
                    <X className="w-5 h-5 text-foreground" />
                  ) : (
                    <Menu className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </>
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="btn-primary-glow text-primary-foreground font-semibold text-sm px-4 py-1.5 h-8"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMenu && isAuthenticated && (
          <div className="absolute top-14 right-4 bg-card border border-border rounded-xl shadow-lg p-2 min-w-48 animate-scale-in">
            <div className="px-3 py-2 border-b border-border mb-2">
              <p className="font-semibold text-foreground text-sm">Olá, {user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.phone}</p>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Meu Perfil</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Carteira</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Histórico</span>
            </button>
            <button
              onClick={() => {
                logout();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-left mt-2 border-t border-border pt-3"
            >
              <LogOut className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">Sair</span>
            </button>
          </div>
        )}
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
    </>
  );
}
