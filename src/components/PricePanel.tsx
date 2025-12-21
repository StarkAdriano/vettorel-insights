import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceData } from '@/types/trading';

interface PricePanelProps {
  priceData: PriceData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function PricePanel({ priceData, isLoading, error, onRefresh }: PricePanelProps) {
  const formatPrice = (price: number) => price.toFixed(5);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="card-trading">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            FX:EURUSD
          </span>
        </div>
        <div className="flex items-center gap-2">
          {priceData?.isLive ? (
            <Wifi className="w-4 h-4 text-trading-buy" />
          ) : (
            <WifiOff className="w-4 h-4 text-muted-foreground" />
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {error ? (
          <div className="text-destructive text-sm">{error}</div>
        ) : isLoading && !priceData ? (
          <div className="price-display text-muted-foreground">
            Carregando...
          </div>
        ) : priceData ? (
          <>
            <div className="price-display text-price-neutral">
              {formatPrice(priceData.price)}
            </div>
            <div className="text-xs text-muted-foreground">
              {priceData.isLive ? 'Preço atual' : 'Último fechamento'} • {formatTime(priceData.timestamp)}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
