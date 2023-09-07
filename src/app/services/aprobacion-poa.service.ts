import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AprobacionPoa } from '../models/AprobacionPoa';
import { Proyecto } from '../models/Proyecto';
import baserUrl from './helper';
import { AprovacionPoa } from '../models/aprovacion-poa';

@Injectable({
  providedIn: 'root'
})
export class AprobacionPoaService {
  constructor(private http: HttpClient) { }

  listar(): Observable<AprobacionPoa[]> {
    return this.http.get<AprobacionPoa[]>(`${baserUrl}/api/aprobacionpoa/listar`);
  }
  crear(r: AprobacionPoa): Observable<AprobacionPoa> {
    return this.http.post<AprobacionPoa>(`${baserUrl}/api/aprobacionpoa/crear`, r
    );
  }

  actualizar(id: any, aprobPoa: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionpoa/actualizar/${id}`, aprobPoa);
  }

  eliminar(aprobPoa: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/aprobacionpoa/eliminarlogic/${aprobPoa.id_aprobacionpoa}`, aprobPoa);
  }


   // Método para listar las observaciones por id del Poa
   listaraaprobacionPorIdPoa(idPoa: number): Observable<AprobacionPoa[]> {
    return this.http.get<AprobacionPoa[]>(`${baserUrl}/api/aprobacionpoa/listaAprobacionPoaPorId/`+idPoa);
  }

 

  getAprobacionPoa(): Observable<AprovacionPoa[]> {
    return this.http.get<AprovacionPoa[]>(`${baserUrl}/api/aprobacionpoa/listar`);
  }

}
