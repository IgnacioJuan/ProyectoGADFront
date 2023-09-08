import { ActividadesPoa } from "./ActividadesPoa";
import { Usuario2 } from "./Usuario2";

export class SolicitudActividadPrepuesto {
    id_solicitud_presupuesto!: number;
    motivo: string ="";
    monto_actual: number =0;
    reforma: number =0;
    monto_total: number =0;
    fecha_solicitud!: Date;
    actividadSolicitud : ActividadesPoa | null = null;
    destinatario : Usuario2 | null = null;
    responsable: Usuario2 | null = null;
    estado: string ="";
    visible: boolean=true;

  }