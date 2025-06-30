import { cn } from "@/lib/utils"

export function SatelliteIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M12.012 11.238a3.13 3.13 0 1 0-4.425 4.425 3.13 3.13 0 0 0 4.425-4.425Z" />
      <path d="m17.65 12.35-2.12.37.37-2.12" />
      <path d="M14.05 15.95s-1.5-1.5-3.5-3.5" />
      <path d="M12.35 6.35 12 8" />
      <path d="m6.35 12.35-1.65-.35" />
      <path d="M15.5 2.5 12 6" />
      <path d="M6 12l-4 3.5" />
      <path d="m21.5 8.5-4 3.5" />
    </svg>
  );
}
