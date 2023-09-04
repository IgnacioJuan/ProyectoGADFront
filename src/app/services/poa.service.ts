import { Injectable } from '@angular/core';
import { map, Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { PoaActividadProjection } from '../interface/PoaActividadProjection';
import { Poa } from '../models/Poa';
import { PoasAdminEstadoProjection } from '../interface/PoasAdminEstado';

import { PoaNoAprobadoProjection } from '../interface/PoaNoAprobadoProjection';
import { PoaporUsuarioProjection } from '../interface/PoaporUsuarioProjection';


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
    return this.http.get<PoaActividadProjection[]>(`${baserUrl}/api/poa/listarPoasDeModelo`);
  }
  listarPoasdelProyecto(estado:string): Observable<Poa[]> {
    return this.http.get<Poa[]>(`${baserUrl}/api/poa/listardelProyecto/${estado}`);
  }


  //Listar POAS por Admin-ESTADO 
  listarPoasAdminEstado(idResponsable:number, estado:string): Observable<PoasAdminEstadoProjection[]> {
    return this.http.get<PoasAdminEstadoProjection[]>(`${baserUrl}/api/poa/listarPoasAdminEstado/${idResponsable}/${estado}`);
  }
  
  getNoAprobados(): Observable<PoaNoAprobadoProjection[]> {
    return this.http.get<PoaNoAprobadoProjection[]>(`${baserUrl}/api/poa/noaprobados`);
  }


  getporUsuario(): Observable<PoaporUsuarioProjection[]> {
    return this.http.get<PoaporUsuarioProjection[]>(`${baserUrl}/api/poa/listarporusuario`);

  }

}
