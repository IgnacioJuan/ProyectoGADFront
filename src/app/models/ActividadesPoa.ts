import { Poa } from "./Poa";
import { Usuario2 } from "./Usuario2";

export class ActividadesPoa {
    id_actividad: number =0;
    nombre!: string;
    descripcion!: string;
    presupuesto_referencial!: number;
    codificado!: number;
    devengado!: number;
    recursos_propios!: number;
    estado!: string
    visible!: boolean;
    usuario!:Usuario2;
    poa!: Poa;
    
}
