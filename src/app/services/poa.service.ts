import { Injectable } from '@angular/core';
import { Criterio } from '../models/Criterio';
import { map, Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { Modelo } from '../models/Modelo';
import { Observacion } from '../models/Observacion';
import { Persona2 } from '../models/Persona2';
import { CriterioSubcriteriosProjection } from '../interface/CriterioSubcriteriosProjection';
import { proyeccionCriterio } from '../pages/admin/aprobar-rechazar-admin/proyecciones-testeo/proyeccionCriterio';
import { IndicadorProjection } from '../interface/IndicadorProjection';
import { PoaActividadProjection } from '../interface/PoaActividadProjection';

@Injectable({
  providedIn: 'root'
})
export class PoaService {

  private url: string = 'http://localhost:5000/api/poa';
  constructor(private http: HttpClient) { }
  getPoaById(id: number): Observable<PoaActividadProjection> {

    return this.http.get<PoaActividadProjection>(`${baserUrl}/api/poa/buscar/${id}`);
  }
  public listarPoa(): Observable<PoaActividadProjection[]> {
    return this.http
      .get(`${baserUrl}/api/poa/listar`)
      .pipe(map((response) => response as PoaActividadProjection[]));
  }
  getPoas(): Observable<PoaActividadProjection[]> {
    return this.http.get<PoaActividadProjection[]>(`${baserUrl}/api/poa/listar`);
  }
  crear(r: PoaActividadProjection): Observable<PoaActividadProjection> {
    return this.http.post<PoaActividadProjection>(`${baserUrl}/api/poa/crear`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/poa/actualizar/${id}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/poa/eliminar/${crite.id_criterio}`, crite);

  }

  obtenerDatosPoas(): Observable<PoaActividadProjection[]> {
    return this.http.get<PoaActividadProjection[]>(`${baserUrl}/api/poa/listarPoasAprobados`);
  }
}
