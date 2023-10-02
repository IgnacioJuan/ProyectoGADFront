import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListaActividadesUsuario } from '../interface/ListaActividadesUsuario';
import { ActividadesPoa } from '../models/ActividadesPoa';
import { Periodo } from '../models/Periodo';
import { Actividad_arch } from './actividad_arch';
import baserUrl from './helper';

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
    return this.http.post(`${baserUrl}/api/aprobacionactividad/crearAprobacion`, r);
  }

  actualizar(id: any, acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizar/${id}`, acti);
  }

  
  
  actualizarDevengado(id: any, acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizarDevengado/${id}`, acti);
  }
  actualizarCodificado(id: any, acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizarCodificado/${id}`, acti);
  }

  actualizarPeriodosActividad(id: any, periodo: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/periodo/actualizar/${id}`, periodo);
  }

  actualizarPeriodosActividades(idActividad: number, periodos: any[]): Observable<any> {
    return this.http.put(`${baserUrl}/api/periodo/actualizarPeriodos/${idActividad}`, periodos);
  }

  obtenerActividades(): Observable<ActividadesPoa[]> {
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listar2`);
  }
  obtenerActividades2(): Observable<Actividad_arch[]> {
    return this.http.get<Actividad_arch[]>(`${baserUrl}/api/actividades/listar`);
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

  //creame un metodo put 'http://localhost:5000/api/actividades/actualizarResponsable?id_actividad=64&id_responsable=4'
  actualizarResponsable(id_actividad: number, id_responsable: number): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizarResponsable?id_actividad=${id_actividad}&id_responsable=${id_responsable}`, null);
  }
}
