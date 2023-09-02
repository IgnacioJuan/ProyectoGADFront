import { ObjetivoPDOT } from "./ObjetivoPDOT";

export class MetasPDOT {
    id_meta_pdot: number = 0;
    nombre : string = "";
    descripcion : string = "";
    meta_final: number = 0;
    linea_base: number = 0;
    //porcentaje_meta: number = 0;
    visible : boolean = false;
    objetivopdot: ObjetivoPDOT | null = null;

    
}