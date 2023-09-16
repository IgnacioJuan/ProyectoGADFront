export interface PoaActividadProjection {
    id_poa: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    localizacion: string;
    cobertura: string;
    barrio: string;
    comunidad: string;
    linea_base: number;
    tipo_periodo: string;
    cantidadActividades: number; 
}