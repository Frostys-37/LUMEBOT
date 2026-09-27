import { useEffect, useState } from "react";
import { Users, Wifi, Server, Package } from "lucide-react";
import { api } from "../api";
import type { ModalidadEstado } from "../types";

export function ServerStatusPanel() {
  const [modalidades, setModalidades] = useState<ModalidadEstado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      const datos = await api.obtenerEstadoServidor();
      setModalidades(datos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el estado del servidor.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 15000);
    return () => clearInterval(intervalo);
  }, []);

  if (cargando) {
    return (
      <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-neu-bg rounded-2xl shadow-neu-inset animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-400 p-8 text-sm">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-5 text-neu-text">Estado del servidor</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modalidades.map((m) => (
          <div key={m.nombre} className="bg-neu-bg rounded-2xl p-5 shadow-neu">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neu-text">{m.nombre}</h3>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  m.online ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                }`}
              />
            </div>

            {!m.online ? (
              <p className="text-red-400 text-sm">Sin respuesta ({m.host}:{m.port})</p>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-neu-muted">
                  <Users size={14} />
                  <span className="text-neu-text">
                    {m.jugadores?.online ?? 0}/{m.jugadores?.max ?? 0} jugadores
                  </span>
                </div>

                {m.ping !== null && m.ping !== undefined && (
                  <div className="flex items-center gap-2 text-neu-muted">
                    <Wifi size={14} />
                    <span className="text-neu-text">{m.ping} ms</span>
                  </div>
                )}

                {m.version && (
                  <div className="flex items-center gap-2 text-neu-muted">
                    <Server size={14} />
                    <span className="text-neu-text">
                      {m.software ? `${m.software} ` : ""}
                      {m.version}
                    </span>
                  </div>
                )}

                {m.plugins && (
                  <div className="flex items-start gap-2 text-neu-muted">
                    <Package size={14} className="mt-0.5" />
                    <span className="text-neu-text text-xs leading-relaxed">
                      {m.plugins.length} plugin{m.plugins.length === 1 ? "" : "s"} instalado
                      {m.plugins.length === 1 ? "" : "s"}
                    </span>
                  </div>
                )}

                {m.jugadoresConectados && m.jugadoresConectados.length > 0 && (
                  <div className="bg-neu-bg rounded-xl p-3 shadow-neu-inset-sm">
                    <p className="text-xs text-neu-muted mb-1.5">Conectados ahora:</p>
                    <p className="text-xs text-neu-text leading-relaxed">
                      {m.jugadoresConectados.join(", ")}
                    </p>
                  </div>
                )}

                {m.descripcion && (
                  <p className="text-xs text-neu-muted italic truncate" title={m.descripcion}>
                    "{m.descripcion}"
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {modalidades.length === 0 && (
        <p className="text-neu-muted text-sm">No hay modalidades configuradas para monitorear.</p>
      )}
    </div>
  );
}