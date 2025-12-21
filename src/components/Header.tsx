import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/30">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-bold tracking-tight">
              Operações Institucionais
            </span>
            <span className="text-xs text-muted-foreground font-medium tracking-wider">
              VETTOREL
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-trading-buy animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">EURUSD</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Setup Institucional Semi-Automatizado
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background p-4 animate-slide-up">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-trading-buy animate-pulse" />
              <span className="text-sm font-medium">Par: EURUSD</span>
            </div>
            <p className="text-xs text-muted-foreground px-3">
              Setup institucional semi-automatizado focado em zonas de suporte e resistência.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
