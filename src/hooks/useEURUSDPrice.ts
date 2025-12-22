import { useState, useEffect, useCallback, useRef } from 'react';
import { PriceData } from '@/types/trading';

// TradingView realtime quotes via their public widget data
const TRADINGVIEW_SYMBOL = 'FX:EURUSD';

export function useEURUSDPrice() {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchPriceFromTradingView = useCallback(async () => {
    try {
      setError(null);
      
      // Use TradingView's symbol lookup API for real-time price
      const response = await fetch(
        `https://symbol-search.tradingview.com/symbol_search/v3/?text=EURUSD&hl=1&exchange=FX&lang=en&search_type=undefined&domain=production&sort_by_country=US`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data?.symbols?.[0]) {
          // TradingView symbol search gives us basic info
          // For actual price, we'll use the quotes endpoint
          const quoteResponse = await fetch(
            `https://quotes-api.tradingview.com/quotes?symbols=FX:EURUSD`
          );
          
          if (quoteResponse.ok) {
            const quoteData = await quoteResponse.json();
            if (quoteData?.d?.[0]?.v?.lp) {
              const price = quoteData.d[0].v.lp;
              setPriceData({
                price: price,
                timestamp: new Date(),
                isLive: true,
              });
              setIsLoading(false);
              return;
            }
          }
        }
      }
      
      // Fallback: Extract price from TradingView mini chart widget
      await fetchFromWidgetFallback();
      
    } catch (err) {
      console.error('TradingView price fetch error:', err);
      await fetchFromWidgetFallback();
    }
  }, []);

  const fetchFromWidgetFallback = async () => {
    try {
      // Fallback to a forex data provider with CORS support
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      
      if (response.ok) {
        const data = await response.json();
        const usdRate = data.rates?.USD;
        
        if (usdRate) {
          setPriceData({
            price: usdRate,
            timestamp: new Date(),
            isLive: false, // Mark as not live since it's daily rate
          });
        }
      }
    } catch (fallbackErr) {
      setError('Erro ao carregar preço');
      console.error('Fallback price fetch error:', fallbackErr);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract price from the TradingView chart if embedded
  const extractPriceFromChart = useCallback(() => {
    // Try to get price from the TradingView widget in the DOM
    const tvWidget = document.querySelector('.tradingview-widget-container iframe');
    if (tvWidget) {
      // The widget updates internally, we can read the displayed value
      // This is a sync mechanism with the visible chart
      try {
        const priceElement = document.querySelector('[data-tv-price]');
        if (priceElement) {
          const priceText = priceElement.textContent;
          if (priceText) {
            const price = parseFloat(priceText.replace(',', '.'));
            if (!isNaN(price) && price > 0.5 && price < 2) {
              setPriceData({
                price,
                timestamp: new Date(),
                isLive: true,
              });
            }
          }
        }
      } catch (e) {
        // Ignore extraction errors
      }
    }
  }, []);

  useEffect(() => {
    fetchPriceFromTradingView();
    
    // Refresh every 5 seconds for more real-time updates
    intervalRef.current = window.setInterval(() => {
      fetchPriceFromTradingView();
      extractPriceFromChart();
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPriceFromTradingView, extractPriceFromChart]);

  const refreshPrice = useCallback(() => {
    setIsLoading(true);
    fetchPriceFromTradingView();
  }, [fetchPriceFromTradingView]);

  // Function to update price from external source (like TradingView chart)
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
