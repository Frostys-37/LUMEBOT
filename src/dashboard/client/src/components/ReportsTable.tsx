import { useEffect, useState } from "react";
import { api } from "../api";
import type { Reporte, EstadoReporte } from "../types";
import { Imagen } from "./imgs";

const ESTADOS: EstadoReporte[] = ["Pendiente", "Aceptado", "Denegado", "Resuelto"];

const COLOR_ESTADO: Record<EstadoReporte, string> = {
  Pendiente: "text-yellow-400",
  Aceptado: "text-green-400",
  Denegado: "text-red-400",
  Resuelto: "text-blue-400",
};

export function ReportsTable() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borradores, setBorradores] = useState<Record<string, EstadoReporte>>({});

  async function cargar() {
    setCargando(true);
    try {
      const datos = await api.obtenerReportes();
      setReportes(datos);
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
    try {
      await api.actualizarReporte(reportId, nuevoEstado);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    }
  }

  if (cargando) return <p className="text-gray-400 p-6">Cargando reportes...</p>;
  if (error) return <p className="text-red-400 p-6">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-discord-border">
            <th className="p-3">ID</th>
            <th className="p-3">Reportado por</th>
            <th className="p-3">Usuario (MC)</th>
            <th className="p-3">Motivo</th>
            <th className="p-3">Pruebas</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((rep) => (
            <tr key={rep._id} className="border-b border-discord-border/60 hover:bg-discord-surface/60">
              <td className="p-3 font-mono text-xs text-gray-400">{rep.reportId}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {rep.reporterAvatar && (
                    <img src={rep.reporterAvatar} alt={rep.reporterTag} className="w-6 h-6 rounded-full" />
                  )}
                  <span>{rep.reporterTag}</span>
                </div>
              </td>
              <td className="p-3 font-medium">{rep.mcUser}</td>
              <td className="p-3 max-w-xs truncate" title={rep.reason}>
                {rep.reason}
              </td>
              <td className="p-3">
                <Imagen src={rep.evidence} alt={`Evidencia de ${rep.reportId}`} />
                {rep.link && (
                  <a href={rep.link} target="_blank" rel="noreferrer" className="block text-xs text-discord-blurple mt-1 hover:underline">
                    Ver enlace
                  </a>
                )}
              </td>
              <td className={`p-3 font-semibold ${COLOR_ESTADO[rep.status]}`}>{rep.status}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <select
                    className="bg-discord-surface border border-discord-border rounded px-2 py-1 text-sm"
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
                    className="bg-discord-blurple hover:bg-indigo-500 text-white text-sm px-3 py-1 rounded transition"
                  >
                    Guardar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reportes.length === 0 && <p className="text-gray-400 p-6">No hay reportes registrados.</p>}
    </div>
  );
}