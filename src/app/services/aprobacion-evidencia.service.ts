import { Injectable } from '@angular/core';
import { AprobacionEvidencia } from '../models/AprobacionEvidencia';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class AprobacionEvidenciaService {

  constructor(private http: HttpClient) { }

  listar(): Observable<AprobacionEvidencia[]> {
    return this.http.get<AprobacionEvidencia[]>(`${baserUrl}/api/aprobacionevidencia/listar`);
  }
  crear(r: AprobacionEvidencia): Observable<AprobacionEvidencia> {
    return this.http.post<AprobacionEvidencia>(`${baserUrl}/api/aprobacionevidencia/crear`, r
    );
  }

  actualizar(id: any, aproba: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionevidencia/actualizar/${id}`, aproba);
  }

  eliminar(aproba: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionevidencia/eliminarlogic/${aproba.id_aprobacionevi}`, aproba);
  }



  buscar(comp: string): Observable<any> {
    return this.http.get(`${baserUrl}/api/componente/buscarComponenteLike/${comp}`);
  }

}
