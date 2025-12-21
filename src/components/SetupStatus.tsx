import { TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { SetupAnalysis } from '@/types/trading';

interface SetupStatusProps {
  analysis: SetupAnalysis | null;
}

export function SetupStatus({ analysis }: SetupStatusProps) {
  if (!analysis) {
    return (
      <div className="card-trading opacity-60">
        <div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
          <Clock className="w-6 h-6" />
          <span>Aguardando análise...</span>
        </div>
      </div>
    );
  }

  const getStatusStyles = () => {
    switch (analysis.direction) {
      case 'BUY':
        return {
          badge: 'status-badge status-buy',
          icon: <TrendingUp className="w-5 h-5" />,
          bgClass: 'border-trading-buy/30',
        };
      case 'SELL':
        return {
          badge: 'status-badge status-sell',
          icon: <TrendingDown className="w-5 h-5" />,
          bgClass: 'border-trading-sell/30',
        };
      default:
        return {
          badge: 'status-badge status-wait',
          icon: <Clock className="w-5 h-5" />,
          bgClass: 'border-trading-wait/30',
        };
    }
  };

  const styles = getStatusStyles();
  const directionLabel = analysis.direction === 'BUY' ? 'COMPRAR' : analysis.direction === 'SELL' ? 'VENDER' : 'ESPERAR';

  return (
    <div className={`card-trading animate-slide-up ${styles.bgClass}`}>
      <div className="mb-4">
        <div className={styles.badge}>
          {styles.icon}
          <span>{directionLabel}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
          STATUS OPERAÇÕES INSTITUCIONAIS VETTOREL
        </h3>
        <p className="text-sm md:text-base font-mono text-muted-foreground">
          EURUSD @ {analysis.price.toFixed(5)} → {analysis.message}
        </p>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex gap-3">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-foreground">Contexto: </span>
            <span className="text-muted-foreground">{analysis.context}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <CheckCircle className="w-4 h-4 text-trading-buy shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-foreground">Análise: </span>
            <span className="text-muted-foreground">{analysis.explanation}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <AlertCircle className="w-4 h-4 text-trading-wait shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-foreground">Invalidação: </span>
            <span className="text-muted-foreground">{analysis.invalidationConditions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
