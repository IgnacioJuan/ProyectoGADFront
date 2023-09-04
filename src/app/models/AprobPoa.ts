import { Poa } from "./Poa";
import { Proyecto } from "./Proyecto";
import { Usuario2 } from "./Usuario2";

export class AprobPoa {
    id_aprobacionpoa!: number;
    poa!: Poa;
    proyecto!: Proyecto;
    estado!: string;
    observacion!: string;
    usuario!: Usuario2;
}