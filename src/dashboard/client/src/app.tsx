import { useState } from "react";
import { ReportsTable } from "./components/ReportsTable";
import { ModerationPanel } from "./components/ModerationPanel";

type Pestaña = "reportes" | "sanciones";

export default function App() {
  const [activa, setActiva] = useState<Pestaña>("reportes");

  return (
    <div className="min-h-screen">
      <header className="border-b border-discord-border px-6 py-4">
        <h1 className="text-2xl font-bold">Panel de Staff — Lumecraft</h1>
      </header>

      <nav className="flex gap-1 px-6 pt-4">
        {(["reportes", "sanciones"] as Pestaña[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiva(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition ${
              activa === tab
                ? "bg-discord-surface text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="bg-discord-surface rounded-tr-lg min-h-[60vh]">
        {activa === "reportes" ? <ReportsTable /> : <ModerationPanel />}
      </main>
    </div>
  );
}