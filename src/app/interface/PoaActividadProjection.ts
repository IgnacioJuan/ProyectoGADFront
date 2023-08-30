export interface PoaActividadProjection {
    id_poa: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    localizacion: string;
    cobertura: string;
    barrio: string;
    comunidad: string;
    nombre_funcionario: string;
    cargo: string;
    recursos_propios: number;
    recursos_externos: number;
    linea_base: string;
    cantidadActividades: number;
    
}