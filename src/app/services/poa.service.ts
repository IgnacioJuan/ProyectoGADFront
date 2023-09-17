import { PoaporFechaRepoProjection } from './../interface/PoaporFechaRepoProjection';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import baserUrl from './helper';
import { PoaActividadProjection } from '../interface/PoaActividadProjection';
import { Poa } from '../models/Poa';
import { PoasAdminEstadoProjection } from '../interface/PoasAdminEstado';

import { PoaNoAprobadoProjection } from '../interface/PoaNoAprobadoProjection';
import { PoaporUsuarioProjection } from '../interface/PoaporUsuarioProjection';
import { PoasConActividadesPendientesProjection } from '../interface/PoasConActividadesPendientesProjection';


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

  buscarPoasPorIds(ids: number[]): Observable<any> {
    // Convierte la lista de IDs en una cadena separada por comas
    const idsString = ids.join(',');
  
    // Configura los parámetros de la solicitud
    const params = new HttpParams().set('ids', idsString);
  
    // Realiza la solicitud HTTP GET con los parámetros
    return this.http.get(`${baserUrl}/api/poa/buscarPorIds`, { params });
  }
  buscarPoasPromedio(ids: number[]): Observable<any> {
    // Convierte la lista de IDs en una cadena separada por comas
    const idsString = ids.join(',');
  
    // Configura los parámetros de la solicitud
    const params = new HttpParams().set('ids', idsString);
  
    // Realiza la solicitud HTTP GET con los parámetros
    return this.http.get(`${baserUrl}/api/poa/listar-promedio`, { params });
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
    return this.http.get<PoaActividadProjection[]>(`${baserUrl}/api/poa/listarPoasDeModelo`);
  }
  listarPoasdelProyecto(id_proyecto:number, estado:string): Observable<Poa[]> {
    return this.http.get<Poa[]>(`${baserUrl}/api/poa/listardelProyecto/${id_proyecto}/${estado}`);
  }


  //Listar POAS por Admin-ESTADO 
  listarPoasAdminEstado(idResponsable:number, estado:string): Observable<PoasAdminEstadoProjection[]> {
    return this.http.get<PoasAdminEstadoProjection[]>(`${baserUrl}/api/poa/listarPoasAdminEstado/${idResponsable}/${estado}`);
  }
  
  getNoAprobados(): Observable<PoaNoAprobadoProjection[]> {
    return this.http.get<PoaNoAprobadoProjection[]>(`${baserUrl}/api/poa/noaprobados`);
  }


  getporUsuario(id_proyecto: number): Observable<PoaporUsuarioProjection[]> {
    return this.http.get<PoaporUsuarioProjection[]>(`${baserUrl}/api/poa/listarporusuario/${id_proyecto}`);

  }



  
  poalist(): Observable<Poa> {
    return this.http.get<any>(`${baserUrl}/api/poa/listar`)
  }

  listarPoasPromedio(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/poa/listar-promedio`);
  }
  PoasConActividadesPendientes(): Observable<PoasConActividadesPendientesProjection> {
    return this.http.get<any>(`${baserUrl}/api/poa/PoasConActividadesP`)
  }
  //Listar poas del admin con fecha
  listarPoaApAdm(idResponsable:number): Observable<PoaporFechaRepoProjection[]> {
    return this.http.get<PoaporFechaRepoProjection[]>(`${baserUrl}/api/poa/listarPoaApAdm/${idResponsable}`);
  }
  actualizarmeta(id: any, nuevaMeta: number): Observable<any> {
    return this.http.put(`${baserUrl}/api/poa/actualizarmeta/${id}`, nuevaMeta);
  }
 }
