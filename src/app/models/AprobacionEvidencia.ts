import { Archivos } from "./Archivos";
import { Usuario2 } from "./Usuario2";

export class AprobacionEvidencia {
    id_aprobacionevi: number = 0;
    estado: string = "";
    observacion: string = "";
    visible : boolean = false;
    usuario:Usuario2 | null = null;
    evidencia:Archivos | null= null;
}
