import { useState, useEffect, useCallback } from 'react';
import { TradeRecord, TradingStats } from '@/types/trading';

const STORAGE_KEY = 'vettorel_trade_history';

export function useTradeHistory() {
  const [trades, setTrades] = useState<TradeRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTrades(parsed.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })));
      } catch (e) {
        console.error('Failed to parse trade history:', e);
      }
    }
  }, []);

  const saveTrades = useCallback((newTrades: TradeRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTrades));
    setTrades(newTrades);
  }, []);

  const addTrade = useCallback((trade: Omit<TradeRecord, 'id'>) => {
    const newTrade: TradeRecord = {
      ...trade,
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const newTrades = [newTrade, ...trades];
    saveTrades(newTrades);
    return newTrade;
  }, [trades, saveTrades]);

  const updateTrade = useCallback((id: string, updates: Partial<TradeRecord>) => {
    const newTrades = trades.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    saveTrades(newTrades);
  }, [trades, saveTrades]);

  const deleteTrade = useCallback((id: string) => {
    const newTrades = trades.filter(t => t.id !== id);
    saveTrades(newTrades);
  }, [trades, saveTrades]);

  const getStats = useCallback((): TradingStats => {
    const wins = trades.filter(t => t.result === 'WIN').length;
    const losses = trades.filter(t => t.result === 'LOSS').length;
    const breakeven = trades.filter(t => t.result === 'BREAKEVEN').length;
    const pending = trades.filter(t => t.result === 'PENDING' || !t.result).length;
    const completed = wins + losses + breakeven;
    
    const totalProfitLoss = trades.reduce((acc, t) => acc + (t.profitLoss || 0), 0);
    
    return {
      totalTrades: trades.length,
      wins,
      losses,
      breakeven,
      pending,
      winRate: completed > 0 ? (wins / completed) * 100 : 0,
      totalProfitLoss,
      buyCount: trades.filter(t => t.direction === 'BUY').length,
      sellCount: trades.filter(t => t.direction === 'SELL').length,
      waitCount: trades.filter(t => t.direction === 'WAIT').length,
    };
  }, [trades]);

  return {
    trades,
    addTrade,
    updateTrade,
    deleteTrade,
    getStats,
  };
}
