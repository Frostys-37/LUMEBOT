export type EstadoReporte = "Pendiente" | "Aceptado" | "Denegado" | "Resuelto";

export interface Reporte {
  _id: string;
  reportId: string;
  userId: string;
  reporterTag: string;
  reporterAvatar: string | null;
  mcUser: string;
  reason: string;
  evidence?: string;
  link?: string;
  status: EstadoReporte;
  staffAction: string;
  timestamp: string;
}

export interface Miembro {
  id: string;
  username: string;
  tag: string;
  avatar: string;
  highestRole: string;
  joinedAt: string | null;
}

export type AccionModeracion = "ban" | "kick" | "mute" | "warn";

export interface ModalidadEstado {
  nombre: string;
  host: string;
  port: number;
  online: boolean;
  version?: string | null;
  descripcion?: string | null;
  jugadores?: { online: number; max: number } | null;
  ping?: number | null;
  software?: string;
  plugins?: string[];
  mapa?: string;
  jugadoresConectados?: string[];
}
