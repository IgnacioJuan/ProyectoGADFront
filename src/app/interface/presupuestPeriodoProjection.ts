
export interface presupuestPeriodoProjection {
    id_actividad: number;
    fecha_inicio: string; // Asegúrate de ajustar el tipo de dato de fecha según tu necesidad
    fecha_fin: string; // Asegúrate de ajustar el tipo de dato de fecha según tu necesidad
    inversion: number;
    referencia: string;
    porcentaje: number;
    ejecucion: number;
}