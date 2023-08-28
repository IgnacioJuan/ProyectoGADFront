export interface PoaActividadProjection {
    id_poa: number;
    meta_alcanzar: number;
    meta_fisica: number;
    avance_real: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    localizacion: string;
    cobertura: string;
    barrio: string;
    comunidad: string;
    nombre_funcionario: string;
    cargo: string;
    recursos_propios: number;
    transferencias_gobierno: number;
    convenios: number;
    linea_base: string;
    cantidadActividades: number;
}