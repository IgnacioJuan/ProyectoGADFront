import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../models/Evidencia';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { ActividadesPoa } from '../models/ActividadesPoa';
import { ListaActividadesUsuario } from '../interface/ListaActividadesUsuario';
import { ActividadesPendientesPorPoaProjection } from '../interface/ActividadesPendientesPorPoaProjection';

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
  crearRelacionAprobacion(r: any): Observable<any> {
    return this.http.post(`${baserUrl}/api/aprobacionactividad/crear`, r);
  }

  actualizar(id: any, acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizar/${id}`, acti);
  }

  obtenerActividades():Observable<ActividadesPoa[]>{
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listar`);
  }

  getActividadesPoa(poaId: number): Observable<ActividadesPoa[]> {
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listarActividadesPoa/${poaId}`);
  }

  getActividadesPoa2(poaId: number): Observable<ActividadesPoa[]> {
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listarActividadesConTotalPresupuestos/${poaId}`);
  }

  getActividadPorId(id: number): Observable<ActividadesPoa> {
    return this.http.get<ActividadesPoa>(`${baserUrl}/api/actividades/buscar/${id}`);
  }

  eliminarActividad(acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/eliminarlogic/${acti.id_actividad}`, acti);
  }

  listarUsuariosActividades(actividadId: number): Observable<ListaActividadesUsuario[]> {
    return this.http.get<ListaActividadesUsuario[]>(`${baserUrl}/api/actividades/listarUsuariosActividadID/${actividadId}`);
  }

  listarActividadesPorIdResponsable(responsableId: number): Observable<ActividadesPoa[]> {
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listarActividadesPorIdResponsable/${responsableId}`);
  }


  public ActividadesPendientesPorPoa(id_Poa: any): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividades/ActividadesPendientesPorPoa/${id_Poa}`);
  }
}
