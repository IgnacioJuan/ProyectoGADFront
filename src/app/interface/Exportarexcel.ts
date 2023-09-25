export interface Exportarexcel {

    id_proyecto: number;
    codigo: string;
    nombre: string;
    objetivo: string;
    meta: string;
    nombre_objetivopnd: string;
    nombre_objetivoods: string;
    nombre_indicador: string;
    nombre_metapdot: string;
    nombre_objetivopdot: string;
    nombre_competencia: string;

    id_objetivo_pnd:number;
    id_objetivo_ods:number;
    id_programa:number;
    id_indicador:number;
    id_competencia:number;

    porcentaje_alcance:number;
    area: string;

    fecha_inicio: string;
    fecha_fin: string;
}