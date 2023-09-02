import { ActividadesPoa } from "./ActividadesPoa";

export class ReformaTraspasoI {
    id_reftras_i: number = 0;
    valor!: number;
    fecha!: Date;
    visible!: boolean;
    actividad: ActividadesPoa = new ActividadesPoa();

    //no borrar es de uso para listar tablas presupuestos
    nombreActividad!: string;
}
