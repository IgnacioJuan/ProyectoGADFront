export interface SolicitudesPresupuestoProjection {
  id_solicitud_presupuesto: number;
  estado: string;
  fecha_solicitud: Date;
  monto_actual: number;
  monto_total: number;
  motivo: string;
  reforma: number;
  responsable_username: string;
  superadmin_username: string;
  actividad: string;
  cargo_responsable: string;
  primer_apellido_responsable: string;
  primer_nombre_responsable: string;
  cargo_superadmin: string;
  primer_apellido_superadmin: string;
  primer_nombre_superadmin: string;
}
