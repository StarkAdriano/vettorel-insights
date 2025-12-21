import { useState } from 'react';
import { History, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Minus, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TradeRecord, TradingStats } from '@/types/trading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TradeHistoryProps {
  trades: TradeRecord[];
  stats: TradingStats;
  onUpdateResult: (id: string, result: TradeRecord['result'], profitLoss?: number) => void;
  onDeleteTrade: (id: string) => void;
}

export function TradeHistory({ trades, stats, onUpdateResult, onDeleteTrade }: TradeHistoryProps) {
  const [showStats, setShowStats] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDirectionIcon = (direction: string) => {
    if (direction === 'BUY') return <TrendingUp className="w-4 h-4 text-trading-buy" />;
    if (direction === 'SELL') return <TrendingDown className="w-4 h-4 text-trading-sell" />;
    return <Clock className="w-4 h-4 text-trading-wait" />;
  };

  const getResultIcon = (result?: string) => {
    if (result === 'WIN') return <CheckCircle className="w-4 h-4 text-trading-buy" />;
    if (result === 'LOSS') return <XCircle className="w-4 h-4 text-trading-sell" />;
    if (result === 'BREAKEVEN') return <Minus className="w-4 h-4 text-muted-foreground" />;
    return <Clock className="w-4 h-4 text-trading-wait" />;
  };

  return (
    <div className="card-trading">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Histórico de Operações</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowStats(!showStats)}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          {showStats ? 'Ocultar Stats' : 'Ver Stats'}
        </Button>
      </div>

      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-xl font-bold">{stats.totalTrades}</div>
          </div>
          <div className="p-3 rounded-lg bg-trading-buy/10 text-center">
            <div className="text-xs text-muted-foreground">Taxa de Acerto</div>
            <div className="text-xl font-bold text-trading-buy">{stats.winRate.toFixed(1)}%</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <div className="text-xs text-muted-foreground">Vitórias</div>
            <div className="text-xl font-bold text-trading-buy">{stats.wins}</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <div className="text-xs text-muted-foreground">Derrotas</div>
            <div className="text-xl font-bold text-trading-sell">{stats.losses}</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <div className="text-xs text-muted-foreground">Compras</div>
            <div className="text-xl font-bold">{stats.buyCount}</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <div className="text-xs text-muted-foreground">Vendas</div>
            <div className="text-xl font-bold">{stats.sellCount}</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center col-span-2">
            <div className="text-xs text-muted-foreground">P/L Total</div>
            <div className={`text-xl font-bold font-mono ${stats.totalProfitLoss >= 0 ? 'text-trading-buy' : 'text-trading-sell'}`}>
              {stats.totalProfitLoss >= 0 ? '+' : ''}{stats.totalProfitLoss.toFixed(2)} USD
            </div>
          </div>
        </div>
      )}

      {trades.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <span>Nenhuma operação registrada</span>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
          {trades.map((trade) => (
            <div 
              key={trade.id} 
              className="p-3 rounded-lg bg-secondary/30 border border-border/50 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getDirectionIcon(trade.direction)}
                  <span className="text-sm font-medium">
                    {trade.direction === 'BUY' ? 'COMPRA' : trade.direction === 'SELL' ? 'VENDA' : 'ESPERAR'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @ {trade.analyzedPrice.toFixed(5)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(trade.timestamp)}
                </span>
              </div>

              {trade.entryPrice && (
                <div className="grid grid-cols-3 gap-2 text-xs font-mono mb-3">
                  <div>
                    <span className="text-muted-foreground">Entry: </span>
                    <span>{trade.entryPrice.toFixed(5)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">SL: </span>
                    <span className="text-trading-sell">{trade.stopLoss?.toFixed(5)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">TP: </span>
                    <span className="text-trading-buy">{trade.takeProfit?.toFixed(5)}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getResultIcon(trade.result)}
                </div>
                <Select
                  value={trade.result || 'PENDING'}
                  onValueChange={(value) => onUpdateResult(trade.id, value as TradeRecord['result'])}
                >
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="WIN">Vitória</SelectItem>
                    <SelectItem value="LOSS">Derrota</SelectItem>
                    <SelectItem value="BREAKEVEN">Breakeven</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteTrade(trade.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
