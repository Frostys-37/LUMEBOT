import { useState } from "react";
import { Search, ShieldAlert, Clock, UserX, Ban, X } from "lucide-react";
import { api } from "../api";
import type { Miembro, AccionModeracion } from "../types";

const ACCIONES: { valor: AccionModeracion; etiqueta: string; icon: typeof Ban }[] = [
  { valor: "warn", etiqueta: "Advertir", icon: ShieldAlert },
  { valor: "mute", etiqueta: "Silenciar", icon: Clock },
  { valor: "kick", etiqueta: "Expulsar", icon: UserX },
  { valor: "ban", etiqueta: "Banear", icon: Ban },
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
      <h2 className="text-lg font-semibold mb-5 text-neu-text">Sanciones</h2>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neu-muted" />
        <input
          type="text"
          placeholder="Busca un usuario por nombre o ID..."
          value={query}
          onChange={(e) => buscar(e.target.value)}
          className="w-full bg-neu-bg shadow-neu-inset rounded-2xl pl-11 pr-4 py-3 text-sm text-neu-text focus:outline-none"
        />
      </div>

      {buscando && <p className="text-neu-muted text-sm mb-3">Buscando...</p>}

      {estado && (
        <p className={`text-sm mb-4 px-4 py-2.5 rounded-xl bg-neu-bg shadow-neu-inset-sm ${estado.tipo === "ok" ? "text-green-400" : "text-red-400"}`}>
          {estado.mensaje}
        </p>
      )}

      <div className="space-y-3">
        {resultados.map((m) => (
          <div key={m.id} className="flex items-center justify-between bg-neu-bg rounded-2xl p-4 shadow-neu">
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt={m.username} className="w-10 h-10 rounded-full shadow-neu-sm" />
              <div>
                <p className="font-medium text-sm text-neu-text">{m.tag}</p>
                <p className="text-xs text-neu-muted">
                  @{m.username} · {m.highestRole}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {ACCIONES.map((a) => (
                <button
                  key={a.valor}
                  onClick={() => abrirAccion(m, a.valor)}
                  title={a.etiqueta}
                  className="flex items-center gap-1.5 text-neu-text text-xs font-medium px-3 py-2 rounded-xl bg-neu-bg shadow-neu-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm transition-shadow"
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
          <div className="bg-neu-bg rounded-3xl p-7 w-full max-w-md shadow-neu">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-base font-bold flex items-center gap-2 text-neu-text">
                <accionActiva.icon size={18} />
                {accionActiva.etiqueta} a {seleccionado.username}
              </h3>
              <button
                onClick={() => {
                  setSeleccionado(null);
                  setAccion(null);
                }}
                className="text-neu-muted hover:text-neu-text"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-neu-muted mb-4">Esta acción quedará registrada en el canal de logs.</p>

            {accion === "mute" && (
              <>
                <label className="block text-xs font-medium text-neu-muted mb-1.5">Duración (ej: 1h, 30m, 1d)</label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-neu-bg shadow-neu-inset-sm rounded-xl px-3 py-2.5 mb-3 text-sm text-neu-text focus:outline-none"
                />
              </>
            )}

            <label className="block text-xs font-medium text-neu-muted mb-1.5">Razón</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full bg-neu-bg shadow-neu-inset-sm rounded-xl px-3 py-2.5 mb-5 text-sm text-neu-text focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSeleccionado(null);
                  setAccion(null);
                }}
                className="px-5 py-2.5 rounded-xl text-sm bg-neu-bg shadow-neu-sm hover:shadow-neu-inset-sm text-neu-text transition-shadow"
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                disabled={enviando}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-neu-bg shadow-neu-sm hover:shadow-neu-inset-sm text-neu-blue disabled:opacity-50 transition-shadow"
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
