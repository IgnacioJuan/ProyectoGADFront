import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../models/Evidencia';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { ActividadesPoa } from '../models/ActividadesPoa';

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

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/actualizar/${id}`, crite);
  }
  //Metodo para listar

  getActividades(): Observable<ActividadesPoa[]> {
    return this.http.get<ActividadesPoa[]>(`${baserUrl}/api/actividades/listarModeloActivPoaAprov`);
  }

  eliminarActividad(acti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividades/eliminarlogic/${acti.id_actividad}`, acti);
  }

  //Listar por usuario
  public getAsignacionUsuario(user: String): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/asignacionevidencia/listarEviUsua/` + user);
  }

  public geteviasig(user: String): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/buscarev/${user}`);
  }

  //LISTAR RESPONSABLE AUN NO HAY
  public listarUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarRespActividad`);
  }


}
