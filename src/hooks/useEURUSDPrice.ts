import { useState, useCallback } from 'react';
import { PriceData } from '@/types/trading';

export function useEURUSDPrice() {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPrice = useCallback(() => {
    // Price is now set manually from the TradingView chart
    // This function is kept for interface compatibility
  }, []);

  // Function to update price from user input (synced with TradingView chart)
  const updatePriceFromChart = useCallback((price: number) => {
    if (price > 0.5 && price < 2) {
      setPriceData({
        price,
        timestamp: new Date(),
        isLive: true,
      });
      setIsLoading(false);
      setError(null);
    }
  }, []);

  return {
    priceData,
    isLoading,
    error,
    refreshPrice,
    updatePriceFromChart,
  };
}
