import { Poa } from "./Poa";
import { Usuario2 } from "./Usuario2";

export class ActividadesPoaDTO {
    id_actividad!: number;
    nombre!: string;
    descripcion!: string;
    presupuesto_referencial!: number;
    recursos_propios!: number;
    recursos_externos!: number;
    estado!: string
}
