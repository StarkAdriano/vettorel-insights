export type TradeDirection = 'BUY' | 'SELL' | 'WAIT';

export interface PriceData {
  price: number;
  timestamp: Date;
  isLive: boolean;
}

export interface SetupAnalysis {
  direction: TradeDirection;
  price: number;
  message: string;
  explanation: string;
  context: string;
  invalidationConditions: string;
  suggestedEntry?: number;
  suggestedStopLoss?: number;
  suggestedTakeProfit?: number;
}

export interface RiskManagement {
  bankroll: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
}

export interface RiskCalculation {
  valueAtRisk: number;
  distancePips: number;
  lotSize: number;
  riskReward: number;
  potentialProfit: number;
  potentialLoss: number;
}

export interface TradeRecord {
  id: string;
  timestamp: Date;
  analyzedPrice: number;
  direction: TradeDirection;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: number;
  result?: 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING';
  profitLoss?: number;
  notes?: string;
}

export interface TradingStats {
  totalTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  pending: number;
  winRate: number;
  totalProfitLoss: number;
  buyCount: number;
  sellCount: number;
  waitCount: number;
}
