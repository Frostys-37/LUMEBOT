import { useState } from "react";
import { api } from "../api";
import type { Miembro, AccionModeracion } from "../types";

const ACCIONES: { valor: AccionModeracion; etiqueta: string; color: string }[] = [
  { valor: "warn", etiqueta: "Advertir", color: "bg-yellow-600 hover:bg-yellow-500" },
  { valor: "mute", etiqueta: "Silenciar", color: "bg-orange-600 hover:bg-orange-500" },
  { valor: "kick", etiqueta: "Expulsar", color: "bg-red-600 hover:bg-red-500" },
  { valor: "ban", etiqueta: "Banear", color: "bg-red-800 hover:bg-red-700" },
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

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Sanciones</h2>

      <input
        type="text"
        placeholder="Busca un usuario por nombre o ID..."
        value={query}
        onChange={(e) => buscar(e.target.value)}
        className="w-full bg-discord-surface border border-discord-border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
      />

      {buscando && <p className="text-gray-400 text-sm">Buscando...</p>}

      {estado && (
        <p className={`text-sm mb-4 ${estado.tipo === "ok" ? "text-green-400" : "text-red-400"}`}>{estado.mensaje}</p>
      )}

      <div className="space-y-2">
        {resultados.map((m) => (
          <div key={m.id} className="flex items-center justify-between bg-discord-surface border border-discord-border rounded p-3">
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt={m.username} className="w-9 h-9 rounded-full" />
              <div>
                <p className="font-medium">{m.displayName}</p>
                <p className="text-xs text-gray-400">
                  @{m.username} · {m.highestRole}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {ACCIONES.map((a) => (
                <button
                  key={a.valor}
                  onClick={() => abrirAccion(m, a.valor)}
                  className={`text-white text-xs px-2 py-1 rounded transition ${a.color}`}
                >
                  {a.etiqueta}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {seleccionado && accion && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-discord-surface border border-discord-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-1">
              {ACCIONES.find((a) => a.valor === accion)?.etiqueta} a {seleccionado.username}
            </h3>
            <p className="text-sm text-gray-400 mb-4">Esta acción quedará registrada en el canal de logs.</p>

            {accion === "mute" && (
              <>
                <label className="block text-sm mb-1">Duración (ej: 1h, 30m, 1d)</label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-discord-bg border border-discord-border rounded px-3 py-2 mb-3"
                />
              </>
            )}

            <label className="block text-sm mb-1">Razón</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full bg-discord-bg border border-discord-border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSeleccionado(null);
                  setAccion(null);
                }}
                className="px-4 py-2 rounded border border-discord-border hover:bg-discord-bg transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                disabled={enviando}
                className="px-4 py-2 rounded bg-discord-blurple hover:bg-indigo-500 transition disabled:opacity-50"
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