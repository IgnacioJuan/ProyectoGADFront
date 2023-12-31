
export class Proyecto {
    id_proyecto!: number;
    codigo!: string;    
    nombre!: string;                        
    objetivo!: string;
    meta!: string;
    porcentaje_alcance!: number;
    area!: number;
    fecha_inicio!: string;
    fecha_fin!: string;
    estado!: string;
    visible!: boolean;
    pnd!: { id_objetivo_pnd: number, /* otras propiedades de pnd */ };//ObjetivoPND
    ods!: any;//ObjetivoOds
    modelopoa!: any;//ModeloPoa
    programa!: any;//Programa
    indicador!: any;//Indicador
    competencia!: any;//Competencia
}

