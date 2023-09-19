import { Injectable } from '@angular/core';
import { SolicitudActividadPrepuesto } from '../models/SolicitudActividadPresupuesto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';
import { SolicitudesPresupuestoProjection } from '../interface/SolicitudesPresupuestos.Projection';

@Injectable({
  providedIn: 'root'
})
export class SolicitudPresupuestoService {
  constructor(private http: HttpClient) { }

  listar(): Observable<SolicitudActividadPrepuesto[]> {
    return this.http.get<SolicitudActividadPrepuesto[]>(`${baserUrl}/api/solicitudpresupuesto/listar`);
  }
  crear(r: SolicitudActividadPrepuesto): Observable<SolicitudActividadPrepuesto> {
    return this.http.post<SolicitudActividadPrepuesto>(`${baserUrl}/api/solicitudpresupuesto/crear`, r
    );
  }

  actualizar(id: any, soli: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/solicitudpresupuesto/actualizar/${id}`, soli);
  }

  eliminar(comp: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/solicitudpresupuesto/eliminarlogic/${comp.id_componente}`, comp);
  }

  //Listar Solicitudes por Responsable-ESTADO 
  listarSolicitudesResponsableEstado(idResponsable:number, estado:string): Observable<SolicitudesPresupuestoProjection[]> {
    return this.http.get<SolicitudesPresupuestoProjection[]>(`${baserUrl}/api/solicitudpresupuesto/listarSolicitudesResponsableEstado/${idResponsable}/${estado}`);
  }
 
   //Listar Solicitudes por Poa
  listarSolicitudesPoa(idAdmin:number,idPoa:number): Observable<SolicitudActividadPrepuesto[]> {
   return this.http.get<SolicitudActividadPrepuesto[]>(`${baserUrl}/api/solicitudpresupuesto/listarSolicitudAdminPoa/${idAdmin}/${idPoa}`);
  }
}
