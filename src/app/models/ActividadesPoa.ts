import { Poa } from "./Poa";

export class ActividadesPoa {
    id_actividad!: number;
    nombre!: string;
    descripcion!: string;
    //observaciones!: string;
    presupuesto_referencial!: number;
    codificado!: number;
    ejecutado!: number;
    saldo!: number;
    visible!: boolean;
    poa: Poa | null = null;
   //evidencia:Evidencias|null=null;
   //usuario:Usuario2|null=null;
}
