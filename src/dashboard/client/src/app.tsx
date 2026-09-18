import { useEffect, useState } from "react";
import { ShieldAlert, Gavel, LogOut } from "lucide-react";
import { ReportsTable } from "./components/ReportsTable";
import { ModerationPanel } from "./components/ModerationPanel";

type Pestaña = "reportes" | "sanciones";

interface Usuario {
  id: string;
  username: string;
  avatar: string | null;
}

const PESTAÑAS: { id: Pestaña; label: string; icon: typeof ShieldAlert }[] = [
  { id: "reportes", label: "Reportes", icon: ShieldAlert },
  { id: "sanciones", label: "Sanciones", icon: Gavel },
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
      <div className="min-h-screen flex items-center justify-center bg-discord-bg">
        <div className="w-8 h-8 border-2 border-discord-blurple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-discord-bg">
        <div className="bg-discord-surface p-10 rounded-2xl text-center max-w-sm shadow-card border border-discord-border">
          <img src="/logo.png" alt="Lumecraft" className="h-14 w-14 rounded-xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Panel de Staff</h1>
          <p className="text-gray-400 mb-6 text-sm">Inicia sesión con tu cuenta de Discord para continuar.</p>
          <a
            href="/api/auth/login"
            className="inline-flex items-center gap-2 bg-discord-blurple hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-card"
          >
            Iniciar sesión con Discord
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-discord-bg">
      <header className="border-b border-discord-border px-8 py-4 flex items-center justify-between bg-discord-surface2">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Lumecraft" className="h-10 w-10 rounded-lg shadow-card" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Panel de Staff</h1>
            <p className="text-xs text-gray-500 leading-tight">Lumecraft Network</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {usuario.avatar && (
              <img src={usuario.avatar} alt={usuario.username} className="w-8 h-8 rounded-full ring-2 ring-discord-border" />
            )}
            <span className="font-medium text-gray-200">{usuario.username}</span>
          </div>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition border border-discord-border hover:border-red-400/50 rounded-lg px-3 py-1.5"
          >
            <LogOut size={14} />
            Cerrar sesión
          </a>
        </div>
      </header>

      <div className="px-8 pt-6">
        <nav className="flex gap-2 border-b border-discord-border">
          {PESTAÑAS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiva(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition border-b-2 -mb-px ${
                activa === id
                  ? "border-discord-blurple text-white bg-discord-surface"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <main className="bg-discord-surface rounded-b-xl rounded-tr-xl shadow-card border border-discord-border border-t-0 min-h-[65vh] my-0">
          {activa === "reportes" ? <ReportsTable /> : <ModerationPanel />}
        </main>
      </div>
    </div>
  );
}