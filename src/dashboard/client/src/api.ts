import type { Reporte, Miembro, AccionModeracion, EstadoReporte } from "./types";

async function manejarRespuesta<T>(res: Response): Promise<T> {
  if (res.status === 401 || res.status === 403) {
    window.location.href = "/";
    throw new Error("No autenticado");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error desconocido");
  return data as T;
}

export const api = {
  async obtenerReportes(): Promise<Reporte[]> {
    const res = await fetch("/api/reports");
    return manejarRespuesta<Reporte[]>(res);
  },

  async actualizarReporte(reportId: string, status: EstadoReporte, staffAction?: string): Promise<Reporte> {
    const res = await fetch(`/api/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, staffAction }),
    });
    return manejarRespuesta<Reporte>(res);
  },

  async buscarMiembros(query: string): Promise<Miembro[]> {
    const res = await fetch(`/api/members/search?q=${encodeURIComponent(query)}`);
    return manejarRespuesta<Miembro[]>(res);
  },

  async ejecutarAccion(accion: AccionModeracion, userId: string, reason: string, duration?: string): Promise<void> {
    const res = await fetch(`/api/moderation/${accion}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, reason, duration }),
    });
    await manejarRespuesta<{ ok: boolean }>(res);
  },
};