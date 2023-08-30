import { Poa } from "./Poa";
import { Usuario2 } from "./Usuario2";

export class ActividadesPoa {
    id_actividad!: number;
    nombre!: string;
    descripcion!: string;
    presupuesto_referencial!: number;
    codificado!: number;
    ejecutado!: number;
    saldo!: number;
    recursos_propios!: number;
    recursos_externos!: number;
    visible!: boolean;
    usuario:Usuario2|null=null;
    poa: Poa | null = null;
    
}
