import { usuario } from "./Usuario";

export class AprobPoa {
    id_poa!: number;
    direccion_departamental!: string;
    responsable!: string;
    correo_responsable!: string;
    area!: string;
    fecha_inicio!: Date;
    fecha_fin!: Date;
    codigo!: string;
    nombre_proyecto!: string;
    descripcion_proyecto!: string;
    nombre_componente!: string;
    nombre_ods!: string;
    nombre_pnd!: string;
    nombre_pdot!: string;
    objetivo_proyecto!: string;
    nombre_indicador!: string;
    nombre_metapdot!: string;
    meta_proyecto!: string;
    nombre_completo!: string;
    meta_planificada!: number; 
    linea_base!: number; 
    cobertura!: string;
    localizacion!: string;
    barrio!: string;
    comunidad!: string;
    tipo_periodo!: string;
    cargo!: string;
}

export interface ActualizarAprobPOA {
    estado: string;
    observacion: string;
}