import { number } from "mathjs";

export class Actividad_arch {
    id_actividad!: number;
    codificado!: number;
    devengado!: number;
    presupuesto_referencial!:number;
    recursos_propios!:number;
    nombre!: string;
    descripcion!: string;
     usuario!:usuario;
}

interface usuario {

    id: number ;
    username: string ;
    pasword: string ;
    estado: string ;
    persona:persona;
  
  }

  interface persona{
    id_persona:number;
    primer_nombre:string;
    primer_apellido:string;
    correo:string;
  }