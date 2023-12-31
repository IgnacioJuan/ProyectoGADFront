import { Archivos } from "./Archivos";
import { Usuario2 } from "./Usuario2";

export class AprobacionEvidencia {
    id_aprobacionevid: number = 0;
    estado: string = "";
    observacion: string = "";
    visible : boolean = true;
    usuario:Usuario2|null=null;
    evidencia:Archivos | null= new Archivos();
    fecha_aprobacion!: Date;
}
