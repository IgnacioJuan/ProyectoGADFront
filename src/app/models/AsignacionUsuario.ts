import { ActividadesPoa } from "./ActividadesPoa";
import { Usuario2 } from "./Usuario2";

export class AsignacionUsuario {
    id_asignacion!: number;
    fecha_asignacion!: Date;
    usuario!: Usuario2;
    actividad!: ActividadesPoa;
}
