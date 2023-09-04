import { Actividad_arch } from "../services/actividad_arch";

export class Archivo {
  geteviasig(username: any) {
    throw new Error('Method not implemented.');
  }
  id_archivo: number = 0;
  enlace: string = "";
  nombre: string = "";
  descripcion: string = "";
  estado:string="";
  fecha:Date | undefined;
  valor :number=0;

 actividad:Actividad_arch|null=null;

  visible: string = "";
 // indicador:Indicador | null = null;
}

