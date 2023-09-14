import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../models/Evidencia';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { ActividadesPoa } from '../models/ActividadesPoa';
import { ListaActividadesUsuario } from '../interface/ListaActividadesUsuario';
import { ActividadesPendientesPorPoaProjection } from '../interface/ActividadesPendientesPorPoaProjection';
import { Periodo } from '../models/Periodo';
import { Poa } from '../models/Poa';

@Injectable({
  providedIn: 'root'
})
export class ActividadespoaService {
  actividadObj: ActividadesPoa[] = [];
  //poa!: Poa[];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/actividades/crear`, r
    );
  }
  crearRelacionAprobacion(r: any): Observable<any> {
    return this.http.post(`${baserUrl}/api/aprobacionactividad/crearAprobacion`, r);
  }

  actualizar(id: any, acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizar/${id}`, acti);
  }

  actualizarPeriodosActividad(id: any, periodo: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/periodo/actualizar/${id}`, periodo);
  }

  actualizarPeriodosActividades(idActividad: number, periodos: any[]): Observable<any> {
    return this.http.put(`${baserUrl}/api/periodo/actualizarPeriodos/${idActividad}`, periodos);
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

  eliminarPeriodosPorActividad(actividadId: number): Observable<any> {
    return this.http.delete(`${baserUrl}/api/periodo/eliminarPorActividad/${actividadId}`);
  }

  listarUsuariosActividades(actividadId: number): Observable<ListaActividadesUsuario[]> {
    return this.http.get<ListaActividadesUsuario[]>(`${baserUrl}/api/actividades/listarUsuariosActividadID/${actividadId}`);
  }

  listarActividadesPorIdResponsable(responsableId: number): Observable<ActividadesPoa[]> {
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listarActividadesPorIdResponsable/${responsableId}`);
  }

  listarPeriodosPorActividad(actividadId: number): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${baserUrl}/api/periodo/listarPeriodosPorActividad/${actividadId}`);
  }
  public ActividadesPendientesPorPoa(id_Poa: any): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividades/ActividadesPendientesPorPoa/${id_Poa}`);
  }
}
