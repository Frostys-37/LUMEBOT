import { useEffect, useState } from "react";
import { Inbox, ExternalLink } from "lucide-react";
import { api } from "../api";
import type { Reporte, EstadoReporte } from "../types";
import { Imagen } from "./imgs";
import { EstadoBadge } from "./EstadoBadge";

const ESTADOS: EstadoReporte[] = ["Pendiente", "Aceptado", "Denegado", "Resuelto"];

export function ReportsTable() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borradores, setBorradores] = useState<Record<string, EstadoReporte>>({});
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      const datos = await api.obtenerReportes();
      setReportes(datos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar reportes.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function guardar(reportId: string) {
    const nuevoEstado = borradores[reportId];
    if (!nuevoEstado) return;
    setGuardandoId(reportId);
    try {
      await api.actualizarReporte(reportId, nuevoEstado);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setGuardandoId(null);
    }
  }

  if (cargando) {
    return (
      <div className="p-10 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-discord-surface2 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 p-8 text-sm">{error}</p>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Reportes</h2>
        <span className="text-xs text-gray-500 bg-discord-surface2 px-2.5 py-1 rounded-full">
          {reportes.length} {reportes.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {reportes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Inbox size={36} className="mb-3 opacity-50" />
          <p className="text-sm">No hay reportes registrados todavía.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-discord-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 bg-discord-surface2">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Reportado por</th>
                <th className="p-3 font-medium">Usuario (MC)</th>
                <th className="p-3 font-medium">Motivo</th>
                <th className="p-3 font-medium">Pruebas</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-discord-border/60">
              {reportes.map((rep) => (
                <tr key={rep._id} className="hover:bg-discord-surface2/60 transition-colors">
                  <td className="p-3 font-mono text-xs text-gray-500">{rep.reportId}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {rep.reporterAvatar && (
                        <img src={rep.reporterAvatar} alt={rep.reporterTag} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-gray-200">{rep.reporterTag}</span>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{rep.mcUser}</td>
                  <td className="p-3 max-w-xs truncate text-gray-300" title={rep.reason}>
                    {rep.reason}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Imagen src={rep.evidence} alt={`Evidencia de ${rep.reportId}`} />
                      {rep.link && (
                        <a
                          href={rep.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-discord-blurple hover:underline"
                        >
                          <ExternalLink size={12} />
                          Enlace
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <EstadoBadge estado={rep.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <select
                        className="bg-discord-surface2 border border-discord-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-discord-blurple"
                        value={borradores[rep.reportId] ?? rep.status}
                        onChange={(e) =>
                          setBorradores((prev) => ({ ...prev, [rep.reportId]: e.target.value as EstadoReporte }))
                        }
                      >
                        {ESTADOS.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => guardar(rep.reportId)}
                        disabled={guardandoId === rep.reportId}
                        className="bg-discord-blurple hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded-md transition"
                      >
                        {guardandoId === rep.reportId ? "..." : "Guardar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
