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
    displayName: string;
    avatar: string;
    highestRole: string;
    joinedAt: string;
}

export type AccionModeracion = "ban" | "kick" | "mute" | "warn";