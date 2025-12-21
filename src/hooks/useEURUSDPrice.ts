import { useState, useEffect, useCallback } from 'react';
import { PriceData } from '@/types/trading';

const FOREX_API_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

export function useEURUSDPrice() {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(FOREX_API_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }
      
      const data = await response.json();
      const usdRate = data.rates?.USD;
      
      if (usdRate) {
        // EURUSD rate: how many USD per 1 EUR
        const eurusdPrice = usdRate;
        setPriceData({
          price: eurusdPrice,
          timestamp: new Date(),
          isLive: true,
        });
      }
    } catch (err) {
      setError('Erro ao carregar preço');
      console.error('Price fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    
    return () => clearInterval(interval);
  }, [fetchPrice]);

  const refreshPrice = useCallback(() => {
    setIsLoading(true);
    fetchPrice();
  }, [fetchPrice]);

  return {
    priceData,
    isLoading,
    error,
    refreshPrice,
  };
}
