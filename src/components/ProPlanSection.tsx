import { Check, Shield, Target, TrendingUp, AlertTriangle, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: BarChart3,
    title: "Leitura institucional profissional do EUR/USD",
    description: "Análise detalhada nos timeframes H4 + H1"
  },
  {
    icon: Target,
    title: "Definição clara do estado do mercado",
    description: "COMPRAR, VENDER ou ESPERAR — sem ambiguidade"
  },
  {
    icon: TrendingUp,
    title: "Zonas institucionais válidas",
    description: "Identificação de desconto, prêmio ou meio de faixa"
  },
  {
    icon: Shield,
    title: "Contexto de liquidez e estrutura",
    description: "Estrutura de mercado e viés macroeconômico"
  },
  {
    icon: AlertTriangle,
    title: "Alertas com gatilho institucional real",
    description: "Não são sinais — são contextos de decisão"
  },
  {
    icon: Clock,
    title: "Filtro anti-overtrading",
    description: "Evite operações em ambientes sem edge"
  },
  {
    icon: Shield,
    title: "Gestão de risco profissional",
    description: "Risco reduzido e R/R técnico bem definido"
  }
];

const disclaimers = [
  "Este plano não é robô de trading",
  "Não opera todos os dias",
  "Não promete lucro",
  "O foco é preservar capital e operar apenas quando há vantagem institucional clara"
];

export function ProPlanSection() {
  return (
    <section className="w-full py-12 px-4">
      <Card className="max-w-4xl mx-auto border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium mx-auto">
            Plano Profissional
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">
            Plano PRO — R$ 497/mês
          </CardTitle>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            Operação profissional baseada em contexto institucional, não em sinais aleatórios.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Benefits Grid */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              O que o assinante PRO recebe:
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Disclaimers */}
          <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Importante:
            </h3>
            <ul className="space-y-3">
              {disclaimers.map((disclaimer, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{disclaimer}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center pt-4 space-y-6">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto font-semibold"
              onClick={() => window.open('https://buy.stripe.com/5kQ28qdeR0pg5Hz1jXeQM00', '_blank')}
            >
              Assinar Plano PRO — R$ 497/mês
            </Button>
            
            {/* PIX Option */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50 max-w-md mx-auto">
              <p className="text-sm font-medium text-foreground mb-2">
                Ou pague via PIX:
              </p>
              <code className="text-xs bg-background/50 px-3 py-2 rounded border border-border/50 block break-all select-all">
                ea9f68ed-2b08-4fe0-a420-a551971ba8be
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Envie o comprovante para ativar sua assinatura
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Serviço profissional focado em disciplina, leitura de mercado e tomada de decisão institucional.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
