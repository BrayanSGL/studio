'use client';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Satellite, ArrowUpCircle, ArrowDownCircle, CloudRain, Calculator } from 'lucide-react';

export const formSchema = z.object({
  satelliteLon: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(-180, "Valor entre -180 y 180").max(180, "Valor entre -180 y 180"),
  txLat: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(-90, "Valor entre -90 y 90").max(90, "Valor entre -90 y 90"),
  txLon: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(-180, "Valor entre -180 y 180").max(180, "Valor entre -180 y 180"),
  txAntennaDiameter: z.coerce.number({ invalid_type_error: "Debe ser un número" }).positive("Debe ser positivo"),
  txAntennaEfficiency: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(0, "Mínimo 0").max(100, "Máximo 100"),
  txPower: z.coerce.number({ invalid_type_error: "Debe ser un número" }).positive("Debe ser positivo"),
  txFreq: z.coerce.number({ invalid_type_error: "Debe ser un número" }).positive("Debe ser positivo"),
  txPointingError: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(0, "No puede ser negativo"),
  rxLat: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(-90, "Valor entre -90 y 90").max(90, "Valor entre -90 y 90"),
  rxLon: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(-180, "Valor entre -180 y 180").max(180, "Valor entre -180 y 180"),
  rxAntennaDiameter: z.coerce.number({ invalid_type_error: "Debe ser un número" }).positive("Debe ser positivo"),
  rxAntennaEfficiency: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(0, "Mínimo 0").max(100, "Máximo 100"),
  rxSystemNoiseTemp: z.coerce.number({ invalid_type_error: "Debe ser un número" }).positive("Debe ser positivo"),
  rxFreq: z.coerce.number({ invalid_type_error: "Debe ser un número" }).positive("Debe ser positivo"),
  rxPointingError: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(0, "No puede ser negativo"),
  rainRate: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(0, "No puede ser negativo"),
  polarizationTiltAngle: z.coerce.number({ invalid_type_error: "Debe ser un número" }).min(0, "Mínimo 0").max(90, "Máximo 90"),
});

type LinkConfigurationFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export function LinkConfigurationForm({ form, onSubmit }: LinkConfigurationFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <SectionTitle icon={<Satellite />} title="Configuración del Satélite" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField name="satelliteLon" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud del Satélite (°E)</FormLabel>
                <FormControl><Input placeholder="-61.0" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Separator />
          
          <SectionTitle icon={<ArrowUpCircle />} title="Estación Terrestre Transmisora (Subida)" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField name="txLat" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Latitud (°N)</FormLabel><FormControl><Input placeholder="40.41" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="txLon" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Longitud (°E)</FormLabel><FormControl><Input placeholder="-3.70" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="txFreq" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Frecuencia (GHz)</FormLabel><FormControl><Input placeholder="14" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField name="txPower" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Potencia de Tx (W)</FormLabel><FormControl><Input placeholder="100" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="txAntennaDiameter" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Diámetro Antena (m)</FormLabel><FormControl><Input placeholder="2.4" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="txAntennaEfficiency" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Eficiencia Antena (%)</FormLabel><FormControl><Input placeholder="65" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="txPointingError" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Error de Apunte (°)</FormLabel><FormControl><Input placeholder="0.2" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <Separator />

          <SectionTitle icon={<ArrowDownCircle />} title="Estación Terrestre Receptora (Bajada)" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField name="rxLat" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Latitud (°N)</FormLabel><FormControl><Input placeholder="34.05" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="rxLon" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Longitud (°E)</FormLabel><FormControl><Input placeholder="-118.24" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="rxFreq" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Frecuencia (GHz)</FormLabel><FormControl><Input placeholder="12" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="rxSystemNoiseTemp" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Temp. Ruido Sistema (K)</FormLabel><FormControl><Input placeholder="150" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="rxAntennaDiameter" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Diámetro Antena (m)</FormLabel><FormControl><Input placeholder="1.8" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="rxAntennaEfficiency" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Eficiencia Antena (%)</FormLabel><FormControl><Input placeholder="65" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="rxPointingError" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Error de Apunte (°)</FormLabel><FormControl><Input placeholder="0.2" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <Separator />

          <SectionTitle icon={<CloudRain />} title="Condiciones Atmosféricas (Opcional)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField name="rainRate" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Tasa de Lluvia (mm/hr)</FormLabel><FormControl><Input placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="polarizationTiltAngle" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Ángulo de Polarización (°)</FormLabel><FormControl><Input placeholder="45" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2">
            <Calculator className="h-5 w-5" />
            Calcular Parámetros
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="text-xl font-semibold flex items-center gap-3 text-primary">
      {icon}
      {title}
    </h3>
  );
}
