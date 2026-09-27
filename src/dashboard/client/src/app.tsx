import { useEffect, useState } from "react";
import { ShieldAlert, Gavel, LogOut, Activity } from "lucide-react";
import { ReportsTable } from "./components/ReportsTable";
import { ModerationPanel } from "./components/ModerationPanel";
import { ServerStatusPanel } from "./components/serverStatusPanel";

type Pestaña = "reportes" | "sanciones" | "servidor";

interface Usuario {
  id: string;
  username: string;
  avatar: string | null;
}

const PESTAÑAS: { id: Pestaña; label: string; icon: typeof ShieldAlert }[] = [
  { id: "reportes", label: "Reportes", icon: ShieldAlert },
  { id: "sanciones", label: "Sanciones", icon: Gavel },
  { id: "servidor", label: "Servidor", icon: Activity },
];

export default function App() {
  const [activa, setActiva] = useState<Pestaña>("reportes");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUsuario)
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neu-bg">
        <div className="w-9 h-9 rounded-full shadow-neu-inset" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neu-bg">
        <div className="bg-neu-bg p-10 rounded-3xl text-center max-w-sm shadow-neu">
          <img src="/logo.png" alt="Lumecraft" className="h-14 w-14 rounded-2xl mx-auto mb-4 shadow-neu-sm" />
          <h1 className="text-2xl font-bold mb-2 text-neu-text">Panel de Staff</h1>
          <p className="text-neu-muted mb-6 text-sm">Inicia sesión con tu cuenta de Discord para continuar.</p>
          <a
            href="/api/auth/login"
            className="inline-flex items-center gap-2 bg-neu-bg text-neu-blue px-6 py-3 rounded-2xl font-semibold shadow-neu-sm hover:shadow-neu-inset-sm transition-shadow"
          >
            Iniciar sesión con Discord
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neu-bg">
      <header className="px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Lumecraft" className="h-10 w-10 rounded-xl shadow-neu-sm" />
          <div>
            <h1 className="text-lg font-bold leading-tight text-neu-text">Panel de Staff</h1>
            <p className="text-xs text-neu-muted leading-tight">Lumecraft Network</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-neu-bg px-3 py-1.5 rounded-full shadow-neu-inset-sm">
            {usuario.avatar && <img src={usuario.avatar} alt={usuario.username} className="w-7 h-7 rounded-full" />}
            <span className="font-medium text-neu-text">{usuario.username}</span>
          </div>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-1.5 text-xs text-neu-muted hover:text-red-400 bg-neu-bg rounded-xl px-3 py-2 shadow-neu-sm hover:shadow-neu-inset-sm transition-shadow"
          >
            <LogOut size={14} />
            Cerrar sesión
          </a>
        </div>
      </header>

      <div className="px-8 pb-8">
        <nav className="flex gap-3 mb-5">
          {PESTAÑAS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiva(id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-2xl transition-shadow bg-neu-bg ${
                activa === id ? "shadow-neu-inset text-neu-blue" : "shadow-neu-sm text-neu-muted hover:text-neu-text"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <main className="bg-neu-bg rounded-3xl shadow-neu min-h-[65vh]">
          {activa === "reportes" && <ReportsTable />}
          {activa === "sanciones" && <ModerationPanel />}
          {activa === "servidor" && <ServerStatusPanel />}
        </main>
      </div>
    </div>
  );
}
