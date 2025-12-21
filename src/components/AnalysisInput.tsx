import { useState } from 'react';
import { Target, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AnalysisInputProps {
  currentPrice: number | null;
  onAnalyze: (price: number) => void;
  isAnalyzing?: boolean;
}

export function AnalysisInput({ currentPrice, onAnalyze, isAnalyzing }: AnalysisInputProps) {
  const [priceInput, setPriceInput] = useState<string>('');

  const handleUseCurrentPrice = () => {
    if (currentPrice) {
      setPriceInput(currentPrice.toFixed(5));
    }
  };

  const handleAnalyze = () => {
    // Parse with locale support (handle comma as decimal separator)
    const normalizedInput = priceInput.replace(',', '.');
    const price = parseFloat(normalizedInput);
    if (!isNaN(price) && price > 0.5 && price < 2) {
      // EURUSD typically ranges between 0.8 and 1.6
      onAnalyze(price);
    }
  };

  const normalizedInput = priceInput.replace(',', '.');
  const parsedPrice = parseFloat(normalizedInput);
  const isValidPrice = priceInput && !isNaN(parsedPrice) && parsedPrice > 0.5 && parsedPrice < 2;

  return (
    <div className="card-trading">
      <div className="flex items-center gap-2 mb-4">
        <Crosshair className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Análise de Setup</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="analysis-price" className="text-sm text-muted-foreground">
            Preço de análise / Preço atual do EURUSD
          </Label>
          <div className="flex gap-2">
            <Input
              id="analysis-price"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 1.08500"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="input-trading flex-1 text-lg font-mono"
            />
            <Button
              variant="secondary"
              onClick={handleUseCurrentPrice}
              disabled={!currentPrice}
              className="shrink-0"
            >
              Usar preço atual
            </Button>
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!isValidPrice || isAnalyzing}
          className="w-full h-12 text-base font-semibold glow-primary"
        >
          <Target className="w-5 h-5 mr-2" />
          {isAnalyzing ? 'Analisando...' : 'Analisar Setup'}
        </Button>
      </div>
    </div>
  );
}
