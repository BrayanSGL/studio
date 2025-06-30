import { SatelliteIcon } from "@/components/satellite-icon";

export function SatelliteLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <SatelliteIcon
        className="h-24 w-24 animate-spin text-primary"
        style={{ animationDuration: '3s' }}
      />
      <p className="text-lg font-medium text-muted-foreground">
        Calculando parámetros del enlace...
      </p>
    </div>
  );
}
