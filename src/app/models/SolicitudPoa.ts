export class SolicitudPoa {
    // Long id_proyecto;
    // Long meta_planificada;
    // String coberura;
    // String barrio;
    // String comunidad;
    // String localizacion;
    // String tipo_periodo;

    // List<SolicitudPoaActividad> actividades;

    //crear con esas especificaciones los atributos
    id_proyecto!: number;
    meta_planificada!: number;
    cobertura!: string;
    barrio!: string;
    comunidad!: string;
    localizacion!: string;
    tipo_periodo!: string;
}

export class SolicitudPoaActividad {
    // String nombre_actividad;
    // String observaciones;
    // Long recursos_propios;
    // Long presupuesto_referencial;
    // List<SolicitudPeriodo> periodos;
    // List<SolicitudPresupExterno> presupuestos_externos;

    //crear con esas especificaciones los atributos
    nombre_actividad!: string;
    observaciones!: string;
    recursos_propios!: number;
    presupuesto_referencial!: number;
}

export class SolicitudPresupExterno {
    // Long valor;
    // String entidad;

    //crear con esas especificaciones los atributos

    valor!: number;
    entidad!: string;
}

export class SolicitudPeriodo {
    // Long referencia;
    // Long porcentaje;

    //crear con esas especificaciones los atributos

    referencia!: number;
    porcentaje!: number;
}