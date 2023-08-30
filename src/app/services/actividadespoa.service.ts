import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../models/Evidencia';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { ActividadesPoa } from '../models/ActividadesPoa';
import { AprobacionActividad } from '../models/AprobacionActividad';

@Injectable({
  providedIn: 'root'
})
export class ActividadespoaService {
  actividadObj: ActividadesPoa[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/actividades/crear`, r
    );
  }
  crearRelacionAprobacion(r:any): Observable<any> {
    return this.http.post(`${baserUrl}/api/aprobacionactividad/crear`, r);
  }

  actualizar(id: any, acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizar/${id}`, acti);
  }

  getActividadesPoa(poaId: number): Observable<ActividadesPoa[]> {
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listarActividadesPoa/${poaId}`);
  }

  eliminarActividad(acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/eliminarlogic/${acti.id_actividad}`, acti);
  }
}
