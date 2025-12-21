import { useEffect, useRef, memo } from 'react';
import { ExternalLink } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
}

function TradingViewChartComponent({ symbol = 'FX:EURUSD' }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
        new (window as any).TradingView.widget({
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
        });
      }
    };

    widgetContainer.appendChild(widgetInner);
    containerRef.current.appendChild(widgetContainer);
    document.head.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="card-trading overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gráfico {symbol}</h2>
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
    </div>
  );
}

export const TradingViewChart = memo(TradingViewChartComponent);
