export interface PoaActividadProjection {
    id_poa: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    linea_base: string;
    meta_alcanzar: number;
    meta_fisica: number;
    avance_real: number;
    localizacion: string;
    cobertura: string;
    barrio: string;
    comunidad: string;
    nombre_funcionario: string;
    cargo: string;
    recursos_propios: number;
    transferencias_gobierno: number;
    convenio: number;
    cantidadActividades: number;
}