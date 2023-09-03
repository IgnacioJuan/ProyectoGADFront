import { Componentes } from "./Componentes";

export class ObjetivoPDOT {
    id_objetivo_pdot: number = 0;
    nombre : string = "";;
    descripcion : string = "";; 
    visible : boolean = false;
    componente: Componentes | null = null;
}