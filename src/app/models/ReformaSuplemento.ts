import { ActividadesPoa } from "./ActividadesPoa";

export class ReformaSuplemento {
    id_ref_suplemento: number = 0;
    valor!: number;
    fecha!: Date;
    visible!: boolean;
    actividad: ActividadesPoa = new ActividadesPoa();
}
