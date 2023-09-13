import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';
import { AprobacionActividad } from '../models/AprobacionActividad';
import { AprobacionporActividadProjection } from '../interface/AprobacionporActividadProjection';

@Injectable({
  providedIn: 'root'
})
export class AprobacionActividadService {

  constructor(private http: HttpClient) { }

  listar(): Observable<AprobacionActividad[]> {
    return this.http.get<AprobacionActividad[]>(`${baserUrl}/api/aprobacionactividad/listar`);
  }
  crear(r: AprobacionActividad): Observable<AprobacionActividad> {
    return this.http.post<AprobacionActividad>(`${baserUrl}/api/aprobacionactividad/crear`, r
    );
  }

  actualizar(id: any, aproba: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionactividad/actualizar/${id}`, aproba);
  }

  eliminar(aproba: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionactividad/eliminarlogic/${aproba.id_aprobacionevi}`, aproba);
  }


   // Método para listar las observaciones por id del archivo
   listaraporbacionEviPorArchivo(idArchivo: number): Observable<AprobacionActividad[]> {
    return this.http.get<AprobacionActividad[]>(`${baserUrl}/api/aprobacionactividad/listaAprobacionActividad/`+idArchivo);
  }
  listarAprobacionesporActividad(id_actividad: number): Observable<AprobacionporActividadProjection[]> {
    return this.http.get<AprobacionporActividadProjection[]>(`${baserUrl}/api/aprobacionactividad/listarAprobacionesporActividad/`+id_actividad);
  }
}
