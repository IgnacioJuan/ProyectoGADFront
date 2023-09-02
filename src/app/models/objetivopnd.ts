import {Componentes} from "./Componentes";
import {Eje} from "./eje";

export class Objetivopnd {
  id_objetivo_pnd: number = 0;
  nombre : string = "";
  descripcion : string = "";
  visible : boolean = false;
  eje: Eje = new Eje();
}
