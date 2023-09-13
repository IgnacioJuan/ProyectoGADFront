import { SolicitudActividadPrepuesto } from "./SolicitudActividadPresupuesto";
import { Usuario2 } from "./Usuario2";

export class AprobacionSolicitud{
    id_aprobacionsolicitudpres: number = 0;
    observacion: string = '';
    estado: string = '';
    visible: boolean = true;
    solicitud: SolicitudActividadPrepuesto | null = null;
    usuario: Usuario2 | null = null;
    fecha_aprobacion!: Date;
  }
  