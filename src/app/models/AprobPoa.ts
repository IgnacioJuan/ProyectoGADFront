import { usuario } from "./Usuario";

export class AprobPoa {
     id_poa!: number;
    responsable!: string;
    nombre_proyecto!: string;
    fecha_inicio!: Date;
    fecha_fin!: Date;
    nombre_ods!: string;
    nombre_pnd!: string;
    nombre_pdot!: string;
    objetivo_proyecto!: string;
    nombre_indicador!: string;
    meta_proyecto!: string;
    linea_base!: number; 
    cobertura!: string;
    localizacion!: string;
    barrio!: string;
    comunidad!: string;
    tipo_periodo!: string;    
}

export interface ActualizarAprobPOA {
    estado: string;
    observacion: string;
}