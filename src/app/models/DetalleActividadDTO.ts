
// modeleo de datos para la tabla de actividades por usuarios
export class DetalleActividadDTO {

    id_actividad!: number;
    nombre_actividad!: string;
    descripcion!: string;
    presupuesto_referencial!: number;
    codificado!: number;
    devengado!: number;
    recursos_propios!: number;
    estado!: string
    visible!: boolean;
    responsable!: string;

}