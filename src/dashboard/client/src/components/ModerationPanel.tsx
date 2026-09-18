import { useState } from "react";
import { Search, ShieldAlert, Clock, UserX, Ban, X } from "lucide-react";
import { api } from "../api";
import type { Miembro, AccionModeracion } from "../types";

const ACCIONES: { valor: AccionModeracion; etiqueta: string; icon: typeof Ban; color: string }[] = [
  { valor: "warn", etiqueta: "Advertir", icon: ShieldAlert, color: "bg-yellow-600/90 hover:bg-yellow-600" },
  { valor: "mute", etiqueta: "Silenciar", icon: Clock, color: "bg-orange-600/90 hover:bg-orange-600" },
  { valor: "kick", etiqueta: "Expulsar", icon: UserX, color: "bg-red-600/90 hover:bg-red-600" },
  { valor: "ban", etiqueta: "Banear", icon: Ban, color: "bg-red-800/90 hover:bg-red-800" },
];

export function ModerationPanel() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Miembro[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Miembro | null>(null);
  const [accion, setAccion] = useState<AccionModeracion | null>(null);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("1h");
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; mensaje: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function buscar(valor: string) {
    setQuery(valor);
    setEstado(null);
    if (valor.trim().length < 2) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    try {
      const datos = await api.buscarMiembros(valor.trim());
      setResultados(datos);
    } catch (err) {
      setEstado({ tipo: "error", mensaje: err instanceof Error ? err.message : "Error al buscar." });
    } finally {
      setBuscando(false);
    }
  }

  function abrirAccion(miembro: Miembro, accionElegida: AccionModeracion) {
    setSeleccionado(miembro);
    setAccion(accionElegida);
    setReason("");
    setDuration("1h");
    setEstado(null);
  }

  async function confirmar() {
    if (!seleccionado || !accion) return;
    if (!reason.trim()) {
      setEstado({ tipo: "error", mensaje: "La razón es obligatoria." });
      return;
    }
    setEnviando(true);
    try {
      await api.ejecutarAccion(accion, seleccionado.id, reason.trim(), accion === "mute" ? duration : undefined);
      setEstado({ tipo: "ok", mensaje: `Acción "${accion}" aplicada a ${seleccionado.username}.` });
      setSeleccionado(null);
      setAccion(null);
    } catch (err) {
      setEstado({ tipo: "error", mensaje: err instanceof Error ? err.message : "Error al ejecutar la acción." });
    } finally {
      setEnviando(false);
    }
  }

  const accionActiva = ACCIONES.find((a) => a.valor === accion);

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">Sanciones</h2>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Busca un usuario por nombre o ID..."
          value={query}
          onChange={(e) => buscar(e.target.value)}
          className="w-full bg-discord-surface2 border border-discord-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-discord-blurple"
        />
      </div>

      {buscando && <p className="text-gray-500 text-sm mb-3">Buscando...</p>}

      {estado && (
        <p className={`text-sm mb-4 px-3 py-2 rounded-lg ${estado.tipo === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
          {estado.mensaje}
        </p>
      )}

      <div className="space-y-2">
        {resultados.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between bg-discord-surface2 border border-discord-border rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt={m.username} className="w-10 h-10 rounded-full ring-1 ring-discord-border" />
              <div>
                <p className="font-medium text-sm">{m.displayName}</p>
                <p className="text-xs text-gray-500">
                  @{m.username} · {m.highestRole}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {ACCIONES.map((a) => (
                <button
                  key={a.valor}
                  onClick={() => abrirAccion(m, a.valor)}
                  title={a.etiqueta}
                  className={`flex items-center gap-1.5 text-white text-xs font-medium px-2.5 py-1.5 rounded-md transition ${a.color}`}
                >
                  <a.icon size={13} />
                  {a.etiqueta}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {seleccionado && accion && accionActiva && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-discord-surface border border-discord-border rounded-2xl p-6 w-full max-w-md shadow-card">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <accionActiva.icon size={18} />
                {accionActiva.etiqueta} a {seleccionado.username}
              </h3>
              <button
                onClick={() => {
                  setSeleccionado(null);
                  setAccion(null);
                }}
                className="text-gray-500 hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Esta acción quedará registrada en el canal de logs.</p>

            {accion === "mute" && (
              <>
                <label className="block text-xs font-medium text-gray-400 mb-1">Duración (ej: 1h, 30m, 1d)</label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-discord-surface2 border border-discord-border rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-discord-blurple"
                />
              </>
            )}

            <label className="block text-xs font-medium text-gray-400 mb-1">Razón</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full bg-discord-surface2 border border-discord-border rounded-lg px-3 py-2 mb-5 text-sm focus:outline-none focus:ring-1 focus:ring-discord-blurple"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSeleccionado(null);
                  setAccion(null);
                }}
                className="px-4 py-2 rounded-lg text-sm border border-discord-border hover:bg-discord-surface2 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                disabled={enviando}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-discord-blurple hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {enviando ? "Aplicando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}