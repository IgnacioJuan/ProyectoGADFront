import { ActividadesPoa } from "./ActividadesPoa";

export class ReformaTraspasoD {
    id_reftras_d: number = 0;
    valor!: number;
    fecha!: Date;
    visible!: boolean;
    actividad: ActividadesPoa = new ActividadesPoa();

    //no borrar es de uso para listar tablas presupuestos
    nombreActividad!: string;
    nombreProyecto!: string;
}