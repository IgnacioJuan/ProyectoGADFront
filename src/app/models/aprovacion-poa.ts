import { Poa } from "./Poa";
import { Proyecto } from "./Proyecto";
import { UsuarioRol } from "./UsuarioRol";

export class AprovacionPoa {
    id_aprobacionpoa :number =0;
    observacion :string ="";
    estado :string="";
    visible: string = "";
    poa :Poa | null = null;
    proyecto:Proyecto | null = null;
    usuario:UsuarioRol | null = null;

}
