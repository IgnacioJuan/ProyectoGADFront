import { ActividadesPoa } from "./ActividadesPoa";
import { Poa } from "./Poa";
import { Usuario2 } from "./Usuario2";

export class AprobacionActividad {
    id_aprobacionact!: number;
    estado!: string;
    observacion!: string;
    visible!: boolean;
    usuario!:Usuario2;
    poa!: Poa;
    actividad!: ActividadesPoa;
}
