import { useEffect, useRef, memo, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
}

function TradingViewChartComponent({ symbol = 'FX:EURUSD', onPriceUpdate }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Extract price from TradingView widget DOM
  const extractPrice = useCallback(() => {
    try {
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentDocument) {
        // Try to access price from iframe (may be blocked by CORS)
        const priceEl = iframe.contentDocument.querySelector('.price-axis-last-value');
        if (priceEl) {
          const priceText = priceEl.textContent;
          if (priceText) {
            const price = parseFloat(priceText.replace(',', '.'));
            if (!isNaN(price) && price > 0.5 && price < 2 && onPriceUpdate) {
              onPriceUpdate(price);
            }
          }
        }
      }
    } catch (e) {
      // CORS will block iframe access, expected behavior
    }
  }, [onPriceUpdate]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetInner = document.createElement('div');
    widgetInner.id = `tradingview_${Date.now()}`;
    widgetInner.style.height = '100%';
    widgetInner.style.width = '100%';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        widgetRef.current = new (window as any).TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: '60',
          timezone: 'America/Sao_Paulo',
          theme: 'dark',
          style: '1',
          locale: 'br',
          toolbar_bg: '#0e1117',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: widgetInner.id,
          hide_volume: true,
          backgroundColor: '#0e1117',
          // Enable studies toolbar for better UX
          studies_overrides: {},
        });

        // Set up periodic price extraction
        const priceInterval = setInterval(extractPrice, 2000);
        
        return () => clearInterval(priceInterval);
      }
    };

    widgetContainer.appendChild(widgetInner);
    containerRef.current.appendChild(widgetContainer);
    document.head.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [symbol, extractPrice]);

  return (
    <div className="card-trading overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Gráfico {symbol}</h2>
          <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded">
            Fonte de preço oficial
          </span>
        </div>
        <a 
          href={`https://www.tradingview.com/chart/?symbol=${symbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <span>Abrir no TradingView</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div 
        ref={containerRef} 
        className="h-[300px] md:h-[400px] lg:h-[450px] rounded-lg overflow-hidden bg-background"
      />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Use o preço exibido no gráfico acima como referência para suas análises
      </p>
    </div>
  );
}

export const TradingViewChart = memo(TradingViewChartComponent);
