import { MetasPDOT } from "./MetasPDOT";

export class Indicadores {
    id_indicador: number = 0;
    nombre : string = "";
    tipo_evaluacion : string = "";
    descripcion : string = "";
    visible : boolean = false;
    metapdot: MetasPDOT | null = null;

}