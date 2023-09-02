import { ObjetivoPDOT } from "./ObjetivoPDOT";

export class MetasPDOT {
    id_meta_pdot: number = 0;
    nombre : string = "";
    descripcion : string = "";
    linea_base: number=0;
    meta_final :number =0;
   
    visible : boolean = false;
    objetivopdot: ObjetivoPDOT | null = null;
}