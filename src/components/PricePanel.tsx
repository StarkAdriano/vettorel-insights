import { useState } from 'react';
import { Wifi, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceData } from '@/types/trading';

interface PricePanelProps {
  priceData: PriceData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onPriceUpdate: (price: number) => void;
}

export function PricePanel({ priceData, onPriceUpdate }: PricePanelProps) {
  const [inputPrice, setInputPrice] = useState('');
  
  const formatPrice = (price: number) => price.toFixed(5);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handlePriceSubmit = () => {
    const normalized = inputPrice.replace(',', '.');
    const price = parseFloat(normalized);
    if (!isNaN(price) && price > 0.5 && price < 2) {
      onPriceUpdate(price);
      setInputPrice('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceSubmit();
    }
  };

  return (
    <div className="card-trading">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${priceData ? 'bg-trading-buy animate-pulse-glow' : 'bg-muted'}`} />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            FX:EURUSD
          </span>
        </div>
        {priceData && (
          <span className="flex items-center gap-1 text-xs text-trading-buy">
            <Wifi className="w-4 h-4" />
            SYNC
          </span>
        )}
      </div>

      {/* Manual Price Input - Primary */}
      <div className="mb-4">
        <label className="text-xs text-muted-foreground mb-2 block">
          Digite o preço do gráfico TradingView:
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ex: 1.17964"
            value={inputPrice}
            onChange={(e) => setInputPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            className="font-mono text-lg"
          />
          <Button 
            onClick={handlePriceSubmit}
            disabled={!inputPrice}
            size="icon"
            className="shrink-0"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Current Synced Price */}
      <div className="flex flex-col gap-1">
        {priceData ? (
          <>
            <div className="price-display text-price-neutral">
              {formatPrice(priceData.price)}
            </div>
            <div className="text-xs text-muted-foreground">
              Sincronizado • {formatTime(priceData.timestamp)}
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            Insira o preço do gráfico TradingView acima para sincronizar
          </div>
        )}
      </div>
    </div>
  );
}
