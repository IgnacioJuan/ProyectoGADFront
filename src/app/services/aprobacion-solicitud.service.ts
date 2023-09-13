import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AprobacionSolicitud } from '../models/AprobacionSolicitud';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class AprobacionSolicitudService {
  constructor(private http: HttpClient) { }

  listar(): Observable<AprobacionSolicitud[]> {
    return this.http.get<AprobacionSolicitud[]>(`${baserUrl}/api/aprobacionsolicitud/listar`);
  }
  crear(r: AprobacionSolicitud): Observable<AprobacionSolicitud> {
    return this.http.post<AprobacionSolicitud>(`${baserUrl}/api/aprobacionsolicitud/crear`, r
    );
  }

  actualizar(id: any, comp: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionsolicitud/actualizar/${id}`, comp);
  }

  eliminar(comp: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionsolicitud/eliminarlogic/${comp.id_componente}`, comp);
  }

}
