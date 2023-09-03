import { Usuario2 } from "./Usuario2";

export class Poa {
    id_poa!: number;
    estado!: string;
    tipo_periodo!: string;
    barrio!: string; 
    comunidad!: string; 
    localizacion!: string; 
    fecha_inicio!: Date; 
    fecha_fin!: Date; 
    cobertura!: string;
    linea_base!: number; 
    meta_alcanzar!: number; 
    meta_planificada!: number;
    visible!: boolean;
    usuario!:Usuario2;
}

