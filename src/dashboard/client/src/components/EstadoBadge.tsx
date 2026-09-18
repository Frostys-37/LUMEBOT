import type { EstadoReporte } from "../types";

const ESTILOS: Record<EstadoReporte, string> = {
  Pendiente: "bg-yellow-400/10 text-yellow-400 ring-1 ring-inset ring-yellow-400/30",
  Aceptado: "bg-green-400/10 text-green-400 ring-1 ring-inset ring-green-400/30",
  Denegado: "bg-red-400/10 text-red-400 ring-1 ring-inset ring-red-400/30",
  Resuelto: "bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/30",
};

export function EstadoBadge({ estado }: { estado: EstadoReporte }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ESTILOS[estado]}`}>
      {estado}
    </span>
  );
}