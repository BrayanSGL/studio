'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkConfigurationForm, formSchema } from '@/components/link-configuration-form';
import { ResultsDisplay, type CalculationResults } from '@/components/results-display';
import { SatelliteLoader } from '@/components/satellite-loader';
import { rainFadePrediction, type RainFadePredictionOutput } from '@/ai/flows/rain-fade-prediction';
import { performCalculations, calculateGeoParams } from '@/lib/satellite-calculations';
import { useToast } from '@/hooks/use-toast';
import { SatelliteIcon } from '@/components/satellite-icon';

export default function Home() {
  const [activeTab, setActiveTab] = useState('configuration');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [aiResponse, setAiResponse] = useState<RainFadePredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      satelliteLon: -61.0,
      txLat: 40.41,
      txLon: -3.7,
      txAntennaDiameter: 2.4,
      txAntennaEfficiency: 65,
      txPower: 100,
      txFreq: 14,
      txPointingError: 0.2,
      rxLat: 34.05,
      rxLon: -118.24,
      rxAntennaDiameter: 1.8,
      rxAntennaEfficiency: 65,
      rxSystemNoiseTemp: 150,
      rxFreq: 12,
      rxPointingError: 0.2,
      rainRate: 0,
      polarizationTiltAngle: 45,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);
    setAiResponse(null);
    setActiveTab('results');

    try {
      const allCalculations = performCalculations(data);
      setResults(allCalculations);

      if (data.rainRate > 0) {
        const txGeoForAI = calculateGeoParams(data.txLat, data.txLon, data.satelliteLon);
        const prediction = await rainFadePrediction({
          frequencyGHz: data.txFreq,
          elevationAngleDegrees: parseFloat(txGeoForAI.elevation),
          rainRateMmHr: data.rainRate,
          polarizationTiltAngleDegrees: data.polarizationTiltAngle,
          siteLatitudeDegrees: data.txLat,
          siteLongitudeDegrees: data.txLon,
        });
        setAiResponse(prediction);
      }
    } catch (error) {
      console.error('Calculation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error en el Cálculo',
        description: 'No se pudieron calcular los parámetros. Por favor, revise los valores de entrada.',
      });
      setActiveTab('configuration');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <SatelliteIcon className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">SatLink Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Calcule y visualice los parámetros fundamentales de un enlace satelital de extremo a extremo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configuration">1. Configuración del Enlace</TabsTrigger>
          <TabsTrigger value="results">2. Resultados del Análisis</TabsTrigger>
        </TabsList>
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Parámetros</CardTitle>
              <CardDescription>
                Ingrese los detalles del satélite, estaciones terrestres y condiciones para calcular el rendimiento del enlace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkConfigurationForm form={form} onSubmit={onSubmit} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle>Resultados del Análisis de Enlace</CardTitle>
              <CardDescription>
                Resumen de los parámetros calculados para el enlace de subida y bajada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <SatelliteLoader />}
              {!isLoading && results ? (
                <ResultsDisplay results={results} aiResponse={aiResponse} />
              ) : (
                !isLoading && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p>Complete la configuración y presione &quot;Calcular&quot; para ver los resultados.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
