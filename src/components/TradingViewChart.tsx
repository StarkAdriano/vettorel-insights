import { useEffect, useRef, memo } from 'react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
}

function TradingViewChartComponent({ symbol = 'FX:EURUSD', interval = '60' }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: 'America/Sao_Paulo',
      theme: 'dark',
      style: '1',
      locale: 'br',
      enable_publishing: false,
      backgroundColor: 'rgba(14, 17, 23, 1)',
      gridColor: 'rgba(42, 46, 57, 0.3)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: true,
      support_host: 'https://www.tradingview.com',
      container_id: 'tradingview-chart',
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetInner = document.createElement('div');
    widgetInner.id = 'tradingview-chart';
    widgetInner.style.height = '100%';
    widgetInner.style.width = '100%';

    widgetContainer.appendChild(widgetInner);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval]);

  return (
    <div className="card-trading overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gráfico FX:EURUSD</h2>
        <div className="flex gap-2">
          {['15', '60', '240', 'D'].map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                interval === tf 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => {
                // Note: This would require state management to change interval
                // For now it's display-only
              }}
            >
              {tf === '15' ? 'M15' : tf === '60' ? 'H1' : tf === '240' ? 'H4' : 'D1'}
            </button>
          ))}
        </div>
      </div>
      <div 
        ref={containerRef} 
        className="h-[300px] md:h-[400px] lg:h-[450px] rounded-lg overflow-hidden"
      />
    </div>
  );
}

export const TradingViewChart = memo(TradingViewChartComponent);
