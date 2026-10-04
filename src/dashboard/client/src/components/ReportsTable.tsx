import { useEffect, useState } from "react";
import { Inbox, ExternalLink } from "lucide-react";
import { api } from "../api";
import type { Reporte, EstadoReporte } from "../types";
import { Imagen } from "./imgs";
import { EstadoBadge } from "./EstadoBadge";

const ESTADOS: EstadoReporte[] = ["Pendiente", "Aceptado", "Denegado", "Resuelto"];

interface Borrador {
  status: EstadoReporte;
  staffAction: string;
}

export function ReportsTable() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borradores, setBorradores] = useState<Record<string, Borrador>>({});
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      const datos = await api.obtenerReportes();
      setReportes(datos);
      setError(null);
      setBorradores((prev) => {
        const nuevo = { ...prev };
        for (const rep of datos) {
          if (!nuevo[rep.reportId]) {
            nuevo[rep.reportId] = { status: rep.status, staffAction: rep.staffAction === "Ninguna" ? "" : rep.staffAction };
          }
        }
        return nuevo;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar reportes.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function actualizarBorrador(reportId: string, cambios: Partial<Borrador>) {
    setBorradores((prev) => ({ ...prev, [reportId]: { ...prev[reportId], ...cambios } }));
  }

  async function guardar(reportId: string) {
    const borrador = borradores[reportId];
    if (!borrador) return;
    setGuardandoId(reportId);
    try {
      await api.actualizarReporte(reportId, borrador.status, borrador.staffAction);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setGuardandoId(null);
    }
  }

  if (cargando) {
    return (
      <div className="p-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-neu-bg rounded-2xl shadow-neu-inset animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-400 p-8 text-sm">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-neu-text">Reportes</h2>
        <span className="text-xs text-neu-muted bg-neu-bg px-3 py-1.5 rounded-full shadow-neu-inset-sm">
          {reportes.length} {reportes.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {reportes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neu-muted">
          <Inbox size={36} className="mb-3 opacity-50" />
          <p className="text-sm">No hay reportes registrados todavía.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reportes.map((rep) => {
            const borrador = borradores[rep.reportId] ?? { status: rep.status, staffAction: "" };
            return (
              <div key={rep._id} className="bg-discord-bg rounded-2xl p-5 shadow-neu">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-mono text-xs text-neu-muted">{rep.reportId}</p>
                      <Imagen src={rep.evidence} alt={`Evidencia de ${rep.reportId}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {rep.reporterAvatar && (
                          <img src={rep.reporterAvatar} alt={rep.reporterTag} className="w-6 h-6 rounded-full shadow-neu-sm" />
                        )}
                        <span className="text-sm text-neu-text">{rep.reporterTag}</span>
                        <span className="text-neu-muted text-xs">reportó a</span>
                        <span className="text-sm font-semibold text-neu-text">{rep.mcUser}</span>
                      </div>
                      <p className="text-sm text-neu-muted">{rep.reason}</p>
                      {rep.link && (
                        <a
                          href={rep.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-neu-blue hover:underline mt-1"
                        >
                          <ExternalLink size={12} />
                          Enlace
                        </a>
                      )}
                    </div>
                  </div>
                  <EstadoBadge estado={rep.status} />
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-4">
                  <select
                    className="bg-neu-bg shadow-neu-inset-sm rounded-xl px-3 py-2 text-sm text-neu-text focus:outline-none [color-scheme:dark]"
                    value={borrador.status}
                    onChange={(e) => actualizarBorrador(rep.reportId, { status: e.target.value as EstadoReporte })}
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                  <textarea
                    rows={1}
                    placeholder="Sanción / acción tomada (ej: 'Muteado 1h')..."
                    className="flex-1 bg-neu-bg shadow-neu-inset-sm rounded-xl px-3 py-2 text-sm text-neu-text focus:outline-none resize-none [color-scheme:dark]"
                    value={borrador.staffAction}
                    onChange={(e) => actualizarBorrador(rep.reportId, { staffAction: e.target.value })}
                  />
                  <button
                    onClick={() => guardar(rep.reportId)}
                    disabled={guardandoId === rep.reportId}
                    className="bg-neu-bg text-neu-blue shadow-neu-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm disabled:opacity-50 text-sm font-semibold px-5 py-2 rounded-xl transition-shadow"
                  >
                    {guardandoId === rep.reportId ? "..." : "Guardar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}