import { SetupAnalysis, TradeDirection } from '@/types/trading';

// Institutional levels for EURUSD (updated for current market ~1.17)
const INSTITUTIONAL_LEVELS = {
  supports: [1.1200, 1.1300, 1.1400, 1.1500, 1.1600, 1.1650, 1.1700, 1.1750, 1.1800],
  resistances: [1.1250, 1.1350, 1.1450, 1.1550, 1.1650, 1.1720, 1.1780, 1.1850, 1.1900],
};

// Default pip distance for stop loss (in pips)
const DEFAULT_STOP_PIPS = 25;
// Minimum Risk/Reward ratio
const MIN_RR_RATIO = 2;

function findNearestLevel(price: number, levels: number[], direction: 'above' | 'below'): number | null {
  if (direction === 'below') {
    const below = levels.filter(l => l < price).sort((a, b) => b - a);
    return below[0] || null;
  } else {
    const above = levels.filter(l => l > price).sort((a, b) => a - b);
    return above[0] || null;
  }
}

function getDistanceInPips(price1: number, price2: number): number {
  return Math.abs(price1 - price2) * 10000;
}

export function analyzeSetup(price: number): SetupAnalysis {
  const nearestSupport = findNearestLevel(price, INSTITUTIONAL_LEVELS.supports, 'below');
  const nearestResistance = findNearestLevel(price, INSTITUTIONAL_LEVELS.resistances, 'above');
  
  const distanceToSupport = nearestSupport ? getDistanceInPips(price, nearestSupport) : Infinity;
  const distanceToResistance = nearestResistance ? getDistanceInPips(price, nearestResistance) : Infinity;
  
  // Zone proximity threshold (in pips)
  const ZONE_PROXIMITY = 30;
  
  // Close to support - potential BUY
  if (nearestSupport && distanceToSupport <= ZONE_PROXIMITY) {
    const stopLoss = price - (DEFAULT_STOP_PIPS / 10000);
    const takeProfit = price + ((DEFAULT_STOP_PIPS * MIN_RR_RATIO) / 10000);
    
    return {
      direction: 'BUY',
      price,
      message: `COMPRAR – DESCONTO DEFENDIDO EM ${nearestSupport.toFixed(4)}`,
      explanation: `O preço ${price.toFixed(5)} está próximo ao suporte institucional em ${nearestSupport.toFixed(4)} (${distanceToSupport.toFixed(1)} pips de distância). Esta é uma zona de desconto onde compradores institucionais tipicamente defendem posições.`,
      context: `Zona de suporte institucional identificada. O mercado está em área de desconto, favorecendo entradas compradas com risco controlado.`,
      invalidationConditions: `A ideia é invalidada se o preço romper e fechar abaixo de ${nearestSupport.toFixed(4)} com volume. Stop técnico posicionado abaixo da zona de invalidação.`,
      suggestedEntry: price,
      suggestedStopLoss: Number(stopLoss.toFixed(5)),
      suggestedTakeProfit: Number(takeProfit.toFixed(5)),
    };
  }
  
  // Close to resistance - potential SELL
  if (nearestResistance && distanceToResistance <= ZONE_PROXIMITY) {
    const stopLoss = price + (DEFAULT_STOP_PIPS / 10000);
    const takeProfit = price - ((DEFAULT_STOP_PIPS * MIN_RR_RATIO) / 10000);
    
    return {
      direction: 'SELL',
      price,
      message: `VENDER – PRÊMIO REJEITADO EM ${nearestResistance.toFixed(4)}`,
      explanation: `O preço ${price.toFixed(5)} está próximo à resistência institucional em ${nearestResistance.toFixed(4)} (${distanceToResistance.toFixed(1)} pips de distância). Esta é uma zona de prêmio onde vendedores institucionais tipicamente distribuem posições.`,
      context: `Zona de resistência institucional identificada. O mercado está em área de prêmio, favorecendo entradas vendidas com risco controlado.`,
      invalidationConditions: `A ideia é invalidada se o preço romper e fechar acima de ${nearestResistance.toFixed(4)} com volume. Stop técnico posicionado acima da zona de invalidação.`,
      suggestedEntry: price,
      suggestedStopLoss: Number(stopLoss.toFixed(5)),
      suggestedTakeProfit: Number(takeProfit.toFixed(5)),
    };
  }
  
  // No clear setup - WAIT
  return {
    direction: 'WAIT',
    price,
    message: `ESPERAR – SEM ZONA INSTITUCIONAL CLARA`,
    explanation: `O preço ${price.toFixed(5)} está entre zonas institucionais. Suporte mais próximo: ${nearestSupport?.toFixed(4) || 'N/A'} (${distanceToSupport.toFixed(1)} pips). Resistência mais próxima: ${nearestResistance?.toFixed(4) || 'N/A'} (${distanceToResistance.toFixed(1)} pips).`,
    context: `O preço está em zona neutra, sem proximidade com níveis institucionais de interesse. Aguardar o preço aproximar-se de zonas de suporte (para compra) ou resistência (para venda).`,
    invalidationConditions: `Não há setup ativo. Monitorar aproximação às zonas institucionais para nova análise.`,
  };
}

export function calculateRisk(
  bankroll: number,
  riskPercent: number,
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  direction: TradeDirection
) {
  // Value at risk
  const valueAtRisk = bankroll * (riskPercent / 100);
  
  // Distance to stop in pips
  const distancePips = direction === 'BUY' 
    ? (entryPrice - stopLoss) * 10000
    : (stopLoss - entryPrice) * 10000;
  
  // Standard lot = $10 per pip for EURUSD
  const pipValue = 10;
  
  // Lot size calculation
  const lotSize = distancePips > 0 ? valueAtRisk / (distancePips * pipValue) : 0;
  
  // Distance to take profit in pips
  const tpDistancePips = direction === 'BUY'
    ? (takeProfit - entryPrice) * 10000
    : (entryPrice - takeProfit) * 10000;
  
  // Risk/Reward ratio
  const riskReward = distancePips > 0 ? tpDistancePips / distancePips : 0;
  
  // Potential profit/loss
  const potentialLoss = valueAtRisk;
  const potentialProfit = valueAtRisk * riskReward;
  
  return {
    valueAtRisk: Number(valueAtRisk.toFixed(2)),
    distancePips: Number(distancePips.toFixed(1)),
    lotSize: Number(lotSize.toFixed(2)),
    riskReward: Number(riskReward.toFixed(2)),
    potentialProfit: Number(potentialProfit.toFixed(2)),
    potentialLoss: Number(potentialLoss.toFixed(2)),
  };
}

export function validateRiskInputs(
  direction: TradeDirection,
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): { valid: boolean; error?: string } {
  if (direction === 'WAIT') {
    return { valid: false, error: 'Não há operação recomendada no momento.' };
  }
  
  if (!entryPrice || !stopLoss || !takeProfit) {
    return { valid: false, error: 'Preencha todos os campos de preço.' };
  }
  
  if (direction === 'BUY') {
    if (stopLoss >= entryPrice) {
      return { valid: false, error: 'Para COMPRA, o Stop Loss deve estar ABAIXO do preço de entrada.' };
    }
    if (takeProfit <= entryPrice) {
      return { valid: false, error: 'Para COMPRA, o Take Profit deve estar ACIMA do preço de entrada.' };
    }
  }
  
  if (direction === 'SELL') {
    if (stopLoss <= entryPrice) {
      return { valid: false, error: 'Para VENDA, o Stop Loss deve estar ACIMA do preço de entrada.' };
    }
    if (takeProfit >= entryPrice) {
      return { valid: false, error: 'Para VENDA, o Take Profit deve estar ABAIXO do preço de entrada.' };
    }
  }
  
  return { valid: true };
}
