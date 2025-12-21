import { useState, useEffect, useMemo } from 'react';
import { Calculator, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SetupAnalysis, RiskCalculation, TradeDirection } from '@/types/trading';
import { calculateRisk, validateRiskInputs } from '@/lib/setupAnalysis';

interface RiskManagementProps {
  analysis: SetupAnalysis | null;
  onSaveToHistory?: (data: {
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    lotSize: number;
  }) => void;
}

export function RiskManagement({ analysis, onSaveToHistory }: RiskManagementProps) {
  const [bankroll, setBankroll] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');

  // Pre-fill when analysis changes
  useEffect(() => {
    if (analysis && (analysis.direction === 'BUY' || analysis.direction === 'SELL')) {
      setEntryPrice(analysis.suggestedEntry?.toFixed(5) || '');
      setStopLoss(analysis.suggestedStopLoss?.toFixed(5) || '');
      setTakeProfit(analysis.suggestedTakeProfit?.toFixed(5) || '');
    } else {
      setEntryPrice('');
      setStopLoss('');
      setTakeProfit('');
    }
  }, [analysis]);

  const direction: TradeDirection = analysis?.direction || 'WAIT';

  const validation = useMemo(() => {
    return validateRiskInputs(
      direction,
      parseFloat(entryPrice),
      parseFloat(stopLoss),
      parseFloat(takeProfit)
    );
  }, [direction, entryPrice, stopLoss, takeProfit]);

  const riskCalc: RiskCalculation | null = useMemo(() => {
    if (!validation.valid) return null;
    
    return calculateRisk(
      parseFloat(bankroll),
      parseFloat(riskPercent),
      parseFloat(entryPrice),
      parseFloat(stopLoss),
      parseFloat(takeProfit),
      direction
    );
  }, [validation.valid, bankroll, riskPercent, entryPrice, stopLoss, takeProfit, direction]);

  const handleSaveToHistory = () => {
    if (riskCalc && onSaveToHistory) {
      onSaveToHistory({
        entryPrice: parseFloat(entryPrice),
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit),
        lotSize: riskCalc.lotSize,
      });
    }
  };

  if (!analysis || analysis.direction === 'WAIT') {
    return (
      <div className="card-trading opacity-60">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Gestão de Risco</h2>
        </div>
        <div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
          <AlertTriangle className="w-5 h-5 text-trading-wait" />
          <span>Status: ESPERAR – não há operação recomendada agora.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card-trading">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Gestão de Risco</h2>
        <div className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
          direction === 'BUY' ? 'bg-trading-buy/20 text-trading-buy' : 'bg-trading-sell/20 text-trading-sell'
        }`}>
          {direction === 'BUY' ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
          {direction === 'BUY' ? 'COMPRA' : 'VENDA'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Banca (USD)</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={bankroll}
            onChange={(e) => setBankroll(e.target.value)}
            className="input-trading font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Risco (% por trade)</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            className="input-trading font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Preço de Entrada</Label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="Ex: 1.08500"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="input-trading font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Stop Loss (técnico)</Label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder={direction === 'BUY' ? 'Abaixo da entrada' : 'Acima da entrada'}
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="input-trading font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Take Profit</Label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder={direction === 'BUY' ? 'Acima da entrada' : 'Abaixo da entrada'}
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="input-trading font-mono"
          />
        </div>
      </div>

      {!validation.valid && validation.error && (
        <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{validation.error}</span>
        </div>
      )}

      {riskCalc && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-1">Valor em Risco</div>
              <div className="text-lg font-mono font-bold text-foreground">
                ${riskCalc.valueAtRisk.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-1">Distância SL</div>
              <div className="text-lg font-mono font-bold text-foreground">
                {riskCalc.distancePips.toFixed(1)} pips
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <div className="text-xs text-muted-foreground mb-1">Tamanho do Lote</div>
              <div className="text-lg font-mono font-bold text-primary">
                {riskCalc.lotSize.toFixed(2)} lotes
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <div className="text-xs text-muted-foreground mb-1">R/R</div>
              <div className={`text-lg font-mono font-bold ${
                riskCalc.riskReward >= 2 ? 'text-trading-buy' : 'text-trading-wait'
              }`}>
                1:{riskCalc.riskReward.toFixed(1)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-trading-sell/10 border border-trading-sell/20 text-center">
              <div className="text-xs text-muted-foreground mb-1">Perda Potencial</div>
              <div className="text-lg font-mono font-bold text-trading-sell">
                -${riskCalc.potentialLoss.toFixed(2)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-trading-buy/10 border border-trading-buy/20 text-center">
              <div className="text-xs text-muted-foreground mb-1">Lucro Potencial</div>
              <div className="text-lg font-mono font-bold text-trading-buy">
                +${riskCalc.potentialProfit.toFixed(2)}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSaveToHistory}
            className="w-full"
            variant="secondary"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Salvar no Histórico
          </Button>
        </div>
      )}
    </div>
  );
}
