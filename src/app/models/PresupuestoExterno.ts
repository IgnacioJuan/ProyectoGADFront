import { ActividadesPoa } from "./ActividadesPoa";

export class PresupuestoExterno {
    id_presupuesto_externo: number = 0;
    nombre_institucion!: string;
    valor!: number;
    observacion!: string;
    fecha!: Date;
    visible!: boolean;
    actividad: ActividadesPoa = new ActividadesPoa();

    //no borrar es de uso para listar tablas presupuestos
    nombreActividad!: string;
}