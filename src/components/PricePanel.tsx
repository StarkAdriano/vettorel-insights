import { RefreshCw, Wifi, WifiOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceData } from '@/types/trading';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <div className={`w-3 h-3 rounded-full ${priceData?.isLive ? 'bg-trading-buy animate-pulse-glow' : 'bg-yellow-500'}`} />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            FX:EURUSD
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  {priceData?.isLive 
                    ? 'Preço atualizado em tempo real. Use como referência ou digite o preço do gráfico TradingView.' 
                    : 'Mercado fechado. Preço do último fechamento. Recomendamos digitar o preço visível no gráfico TradingView para maior precisão.'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          {priceData?.isLive ? (
            <span className="flex items-center gap-1 text-xs text-trading-buy">
              <Wifi className="w-4 h-4" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-yellow-500">
              <WifiOff className="w-4 h-4" />
              FECHADO
            </span>
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
            {!priceData.isLive && (
              <p className="text-xs text-yellow-500/80 mt-2">
                💡 Para maior precisão, digite o preço exibido no gráfico TradingView acima
              </p>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
