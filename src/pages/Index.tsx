import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PricePanel } from '@/components/PricePanel';
import { AnalysisInput } from '@/components/AnalysisInput';
import { SetupStatus } from '@/components/SetupStatus';
import { TradingViewChart } from '@/components/TradingViewChart';
import { RiskManagement } from '@/components/RiskManagement';
import { TradeHistory } from '@/components/TradeHistory';
import { useEURUSDPrice } from '@/hooks/useEURUSDPrice';
import { useTradeHistory } from '@/hooks/useTradeHistory';
import { analyzeSetup } from '@/lib/setupAnalysis';
import { SetupAnalysis, TradeRecord } from '@/types/trading';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

const Index = () => {
  const { priceData, isLoading, error, refreshPrice, updatePriceFromChart } = useEURUSDPrice();
  const { trades, addTrade, updateTrade, deleteTrade, getStats } = useTradeHistory();
  const [analysis, setAnalysis] = useState<SetupAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback((price: number) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay for UX
    setTimeout(() => {
      const result = analyzeSetup(price);
      setAnalysis(result);
      setIsAnalyzing(false);

      // Add to history
      addTrade({
        timestamp: new Date(),
        analyzedPrice: price,
        direction: result.direction,
        result: 'PENDING',
      });

      const directionMsg = result.direction === 'BUY' ? 'COMPRAR' : result.direction === 'SELL' ? 'VENDER' : 'ESPERAR';
      toast.success(`Análise concluída: ${directionMsg}`);
    }, 500);
  }, [addTrade]);

  const handleSaveToHistory = useCallback((data: {
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    lotSize: number;
  }) => {
    if (analysis && trades.length > 0) {
      const latestTrade = trades[0];
      updateTrade(latestTrade.id, {
        entryPrice: data.entryPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        lotSize: data.lotSize,
      });
      toast.success('Trade salvo no histórico');
    }
  }, [analysis, trades, updateTrade]);

  const handleUpdateResult = useCallback((id: string, result: TradeRecord['result'], profitLoss?: number) => {
    updateTrade(id, { result, profitLoss });
    toast.success('Resultado atualizado');
  }, [updateTrade]);

  const handleDeleteTrade = useCallback((id: string) => {
    deleteTrade(id);
    toast.success('Trade removido');
  }, [deleteTrade]);

  // Handle price updates from TradingView chart
  const handleChartPriceUpdate = useCallback((price: number) => {
    updatePriceFromChart(price);
  }, [updatePriceFromChart]);

  return (
    <>
      <Helmet>
        <title>Operações Institucionais Vettorel | Trading EURUSD</title>
        <meta name="description" content="Sistema institucional semi-automatizado para operações EURUSD com gestão de risco profissional." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0e1117" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container py-4 md:py-6 space-y-4 md:space-y-6">
          {/* TradingView Chart - First for price reference */}
          <TradingViewChart onPriceUpdate={handleChartPriceUpdate} />

          {/* Price Panel and Analysis Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <PricePanel 
              priceData={priceData}
              isLoading={isLoading}
              error={error}
              onRefresh={refreshPrice}
              onPriceUpdate={updatePriceFromChart}
            />
            <AnalysisInput 
              currentPrice={priceData?.price || null}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Setup Status */}
          <SetupStatus analysis={analysis} />

          {/* Risk Management and History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <RiskManagement 
              analysis={analysis}
              onSaveToHistory={handleSaveToHistory}
            />
            <TradeHistory 
              trades={trades}
              stats={getStats()}
              onUpdateResult={handleUpdateResult}
              onDeleteTrade={handleDeleteTrade}
            />
          </div>
        </main>

        <footer className="border-t border-border/50 py-4 mt-8">
          <div className="container text-center text-xs text-muted-foreground">
            <p>Operações Institucionais Vettorel © {new Date().getFullYear()}</p>
            <p className="mt-1">Par exclusivo: EURUSD | Risco institucional: 0.5% - 1%</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
