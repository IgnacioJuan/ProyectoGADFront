import { ObjetivoPDOT } from "./ObjetivoPDOT";

export class MetasPDOT {
    id_meta_pdot: number = 0;
    nombre : string = "";
    descripcion : string = "";
    porcentaje_meta: number = 0;
    visible : boolean = false;
    objetivopdot: ObjetivoPDOT | null = null;
}