import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../models/Evidencia';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { ActividadesPoa } from '../models/ActividadesPoa';
import { ListaActividadesUsuario } from '../interface/ListaActividadesUsuario';
import { ActividadesPendientesPorPoaProjection } from '../interface/ActividadesPendientesPorPoaProjection';
import { AsignacionUsuario } from '../models/AsignacionUsuario';

@Injectable({
  providedIn: 'root'
})
export class AsignacionUsuarioService {
  asignacionObj: AsignacionUsuario[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/asignacion_usuario/crear`, r
    );
  }
  actualizar(id: any, asig: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizar/${id}`, asig);
  }

  obtenerAsignaciones():Observable<AsignacionUsuario[]>{
    return this.http.get<AsignacionUsuario[]>(`${baserUrl}/api/asignacion_usuario/listar`);
  }

  getAsignacionesUsuarios(actividadId: number): Observable<ListaActividadesUsuario[]> {
    return this.http.get<ListaActividadesUsuario[]>(`${baserUrl}/api/asignacion_usuario/listarAsignacionesUsuarios/${actividadId}`);
  }

}
