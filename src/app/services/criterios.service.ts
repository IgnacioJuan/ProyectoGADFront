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

@Injectable({
  providedIn: 'root'
})
export class CriteriosService {

  private url: string = 'http://localhost:5000/api/criterio';
  constructor(private http: HttpClient) { }
  getCriterioById(id: number): Observable<Criterio> {

    return this.http.get<Criterio>(`${baserUrl}/api/criterio/buscar/${id}`);
  }
  public listarCriterio(): Observable<Criterio[]> {
    return this.http
      .get(`${baserUrl}/api/criterio/listar`)
      .pipe(map((response) => response as Criterio[]));
  }
  getCriterios(): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/listar`);
  }
  crear(r: Criterio): Observable<Criterio> {
    return this.http.post<Criterio>(`${baserUrl}/api/criterio/crear`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/criterio/actualizar/${id}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/criterio/eliminar/${crite.id_criterio}`, crite);

  }

  getObtenerCriterio(): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/listarcriteriosMode`);
  }

  getDatos(): Observable<any> {
    return this.http.get<any>(`${baserUrl}/api/criterio/datos`);
  }
  getObtenerCriterio2(id: number): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/listarcriteriosMId/` + id);
  }

  getObtenerIndicadores(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/indicadores/buscarindicador/` + id);
  }

  getIndicador(): Observable<IndicadorProjection[]> {
    return this.http.get<IndicadorProjection[]>(`${baserUrl}/api/indicadores/listarindi`)
  }
  getModeMaximo(): Observable<Modelo> {
    return this.http.get<any>(`${baserUrl}/api/modelo/listarMax`)
  }

  getActividadAtrasada(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividad/listaratrasa`)
  }

  getObtenerPersonaId(id:number): Observable<Persona2> {
    return this.http.get<Persona2>(`${baserUrl}/api/persona/buscarpersonaId/`+id);

  }

  getActividadCumplida(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividad/listarCumpli`)
  }
  getCriteriosUltimoModelo(): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/obtenerCriteriosUltimoModelo`);
  }
  //metodo para consumir las evidencias rechasadas
  public getEvidenciaAtrasFecha(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividad/listarActAtrasa`);
  }

  //listar observaciones por actividad
  public getObservacionByActi(id:number): Observable<Observacion[]> {
    return this.http.get<Observacion[]>(`${baserUrl}/api/observacion/buscarObserByActiv/`+id);

  }
  obtenerDatosCriterios(): Observable<CriterioSubcriteriosProjection[]> {
    return this.http.get<CriterioSubcriteriosProjection[]>(`${baserUrl}/api/criterio/datosCriterios`);
  }

  getCriterioPorEvidencia(idEvidencia: number): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${this.url}/obtenerNombreCriterioPorEvidencia/${idEvidencia}`);
  }

  getCriterioPorEvidenciaproyeccion(idEvidencia: number): Observable<proyeccionCriterio[]> {
    return this.http.get<proyeccionCriterio[]>(`${this.url}/obtenerNombreCriterioPorEvidenciaproyeccion/${idEvidencia}`);
  }  
}
