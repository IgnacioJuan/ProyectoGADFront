import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import baserUrl from './helper';
import { Evidencia } from '../models/Evidencia';
import { Asigna_Evi } from '../models/Asignacion-Evidencia';
import { usuario } from '../models/Usuario';
import { ResponsableProjection } from '../interface/ResponsableProjection';

@Injectable({
  providedIn: 'root'
})
export class AsignaEvidenciaService {

  constructor(private httpClient: HttpClient) { }

  //LISTAR RESPONSABLE
  public listarUsuario(): Observable<usuario[]> {
    return this.httpClient.get(`${baserUrl}/usuarios/listar`).
      pipe(map((response) => response as usuario[]));
  }

  //LISTAR EVIDENCIAS
  public listarEvidencia(): Observable<Evidencia[]> {
    return this.httpClient.get(`${baserUrl}/api/evidencia/listarv`).
      pipe(map((response) => response as Evidencia[]));
  }

  //GUARDAR ASIGNACION_EVICENCIA
  public createAsigna(asigna: Asigna_Evi): Observable<Asigna_Evi> {
    return this.httpClient.post<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/crear`, asigna);
  }

  //LISTAR ASIGNACION
  public listarAsignarEvi(): Observable<Asigna_Evi[]> {
    return this.httpClient.get(`${baserUrl}/api/asignacionevidencia/listarv`).
      pipe(map((response) => response as Asigna_Evi[]));
  }

  //EDITAR ASIGNACION
  public updateAsigna(asigna: Asigna_Evi) {
    console.log(asigna.id_asignacion_evidencia);
    return this.httpClient.put<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/actualizar/` + asigna.id_asignacion_evidencia, asigna);
  }

  //ELIMINAR ASIGNACION
  public deleteAsigna(asigna: Asigna_Evi) {
    return this.httpClient.put<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/eliminarlogic/` + asigna.id_asignacion_evidencia,asigna);
  }

  //BUSCAR POR ID
  public getAsignacionId(id: number): Observable<Asigna_Evi> {
    return this.httpClient.get<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/buscar/` + id);
  }


   //Metodo para eliminar

   eliminarAsignaLogic(detalle: number): Observable<any> {
    console.log(detalle)
    return this.httpClient.put(`${baserUrl}/api/asignacionevidencia/eliminarlogic/${detalle}`, detalle);

  }


   

    public getAsignacionUsuario(user: String): Observable< Evidencia[]> {
      return this.httpClient.get<  Evidencia[]>(`${baserUrl}/api/asignacionevidencia/listarEviUsua/` + user);
    }
}
