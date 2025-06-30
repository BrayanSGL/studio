'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowUpCircle, ArrowDownCircle, CloudRain, Map, Signal, Thermometer, Telescope, GitBranch } from 'lucide-react';
import type { RainFadePredictionOutput } from '@/ai/flows/rain-fade-prediction';

export interface CalculationResults {
  tx: {
    azimuth: string;
    elevation: string;
    range: string;
    fsl: string;
    gt: string;
    cno: string;
    pointingLoss: string;
  };
  rx: {
    azimuth: string;
    elevation: string;
    range: string;
    fsl: string;
    gt: string;
    cno: string;
    pointingLoss: string;
  };
}

interface ResultsDisplayProps {
  results: CalculationResults;
  aiResponse: RainFadePredictionOutput | null;
}

export function ResultsDisplay({ results, aiResponse }: ResultsDisplayProps) {
  const { tx, rx } = results;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultCard icon={<ArrowUpCircle className="text-primary" />} title="Resultados de Subida (Uplink)">
          <ResultGroup title="Parámetros Geométricos" icon={<Map size={20} />}>
            <ResultItem label="Azimut" value={tx.azimuth} unit="°" />
            <ResultItem label="Elevación" value={tx.elevation} unit="°" />
            <ResultItem label="Rango" value={tx.range} unit="km" />
          </ResultGroup>
          <ResultGroup title="Balance del Enlace" icon={<Signal size={20} />}>
            <ResultItem label="Pérdidas en Espacio Libre (FSL)" value={tx.fsl} unit="dB" />
            <ResultItem label="Factor de Calidad (G/T) satélite" value={tx.gt} unit="dB/K" />
            <ResultItem label="Relación Portadora/Ruido (C/N₀)" value={tx.cno} unit="dB-Hz" />
            <ResultItem label="Pérdida por Desapunte" value={tx.pointingLoss} unit="dB" />
          </ResultGroup>
        </ResultCard>
        
        <ResultCard icon={<ArrowDownCircle className="text-primary" />} title="Resultados de Bajada (Downlink)">
          <ResultGroup title="Parámetros Geométricos" icon={<Map size={20} />}>
            <ResultItem label="Azimut" value={rx.azimuth} unit="°" />
            <ResultItem label="Elevación" value={rx.elevation} unit="°" />
            <ResultItem label="Rango" value={rx.range} unit="km" />
          </ResultGroup>
           <ResultGroup title="Balance del Enlace" icon={<Signal size={20} />}>
            <ResultItem label="Pérdidas en Espacio Libre (FSL)" value={rx.fsl} unit="dB" />
            <ResultItem label="Factor de Calidad (G/T) estación" value={rx.gt} unit="dB/K" />
            <ResultItem label="Relación Portadora/Ruido (C/N₀)" value={rx.cno} unit="dB-Hz" />
            <ResultItem label="Pérdida por Desapunte" value={rx.pointingLoss} unit="dB" />
          </ResultGroup>
        </ResultCard>
      </div>

      {aiResponse && (
        <ResultCard icon={<CloudRain className="text-primary" />} title="Análisis de Desvanecimiento por Lluvia (IA)">
           <Alert variant={aiResponse.willRainAffectConnection ? "destructive" : "default"}>
              <CloudRain className="h-4 w-4" />
              <AlertTitle>
                {aiResponse.willRainAffectConnection ? "Se prevé afectación por lluvia" : "No se prevé afectación por lluvia"}
              </AlertTitle>
              <AlertDescription>
                {aiResponse.suggestedAdjustments}
              </AlertDescription>
            </Alert>
        </ResultCard>
      )}
    </div>
  );
}

function ResultCard({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

function ResultGroup({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className='space-y-2'>
      <h4 className="font-medium flex items-center gap-2 text-muted-foreground">{icon}{title}</h4>
      <div className="pl-6 space-y-2">
        {children}
      </div>
    </div>
  )
}


function ResultItem({ label, value, unit }: { label: string, value: string, unit: string }) {
  return (
    <div className="flex justify-between items-baseline text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
        {value} <span className="text-xs font-sans text-primary/80">{unit}</span>
      </span>
    </div>
  );
}
