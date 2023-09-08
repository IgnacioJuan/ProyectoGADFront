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
    return this.http.get<SolicitudActividadPrepuesto[]>(`${baserUrl}/api/solictudpresupuesto/listar`);
  }
  crear(r: SolicitudActividadPrepuesto): Observable<SolicitudActividadPrepuesto> {
    return this.http.post<SolicitudActividadPrepuesto>(`${baserUrl}/api/solictudpresupuesto/crear`, r
    );
  }

  actualizar(id: any, comp: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/solictudpresupuesto/actualizar/${id}`, comp);
  }

  eliminar(comp: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/solictudpresupuesto/eliminarlogic/${comp.id_componente}`, comp);
  }

  //Listar Solicitudes por Responsable-ESTADO 
  listarSolicitudesResponsableEstado(idResponsable:number, estado:string): Observable<SolicitudesPresupuestoProjection[]> {
    return this.http.get<SolicitudesPresupuestoProjection[]>(`${baserUrl}/api/solictudpresupuesto/listarSolicitudesResponsableEstado/${idResponsable}/${estado}`);
  }
}
