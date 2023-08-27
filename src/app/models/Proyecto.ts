
export class Proyecto {
    id_proyecto!: number;
    codigo!: string;    
    nombre!: string;                        
    objetivo!: string;
    meta!: string;
    procentaje_alcance!: number;
    fecha_inicio!: string;
    estado!: string;
    visible!: boolean;
    pnd!: any;//ObjetivoPND
    ods!: any;//ObjetivoOds
    modelopoa!: any;//ModeloPoa
    programa!: any;//Indicador
    competencia!: any;//Competencia
}

