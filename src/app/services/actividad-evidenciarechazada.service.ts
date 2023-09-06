import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { environment } from 'src/environments/environment';
import { ActividadArchivosRechazados } from '../models/Actividad-ArchiRechazados';

@Injectable({
  providedIn: 'root'
})
export class ActividadEvidenciarechazadaService {

  baserrl = environment.baserUrl;


  actividad: ActividadArchivosRechazados[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  get(): Observable<ActividadArchivosRechazados[]> {
    return this.http.get<ActividadArchivosRechazados[]>(`${baserUrl}/api/actividades/listarActEviRechazados`);
  }

  listar() {
    return this.http.get(`${this.baserrl}/archivo/listar`);
  }

  borrar(filename: string) {
    return this.http.get(`${this.baserrl}/archivo/borrar/${filename}`);
  }

  eliminar(archi: any): Observable<any> {
    return this.http.put(`${baserUrl}/archivo/eliminarlogic/${archi.id_archivo}`, archi);
  }
}