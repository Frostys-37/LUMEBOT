import type { EstadoReporte } from "../types";

const COLORES_TEXTO: Record<EstadoReporte, string> = {
  Pendiente: "text-yellow-400",
  Aceptado: "text-green-400",
  Denegado: "text-red-400",
  Resuelto: "text-blue-400",
};

export function EstadoBadge({ estado }: { estado: EstadoReporte }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neu-bg shadow-neu-inset-sm ${COLORES_TEXTO[estado]}`}
    >
      {estado}
    </span>
  );
}
