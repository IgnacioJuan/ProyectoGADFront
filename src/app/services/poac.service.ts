import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import baserUrl from './helper';
import { AprobPoa } from '../models/AprobPoa';
import { ActualizarAprobPOA } from '../models/AprobPoa';

@Injectable({
  providedIn: 'root'
})
export class PoacService {

  constructor(private http: HttpClient, private httpClient: HttpClient) { }

  //Metodo para listar POA
  public getPoaAprob(): Observable<AprobPoa[]> {
    return this.httpClient.get(`${baserUrl}/api/aprobacionpoa/listarAprobaciones`).
      pipe(map((response) => response as AprobPoa[]));
  }
  // Método para obtener una aprobación de POA por su ID
  public getPoaAprobById(idPoa: number): Observable<AprobPoa> {
    return this.httpClient.get(`${baserUrl}/api/aprobacionpoa/obtenerAprobacionPorId/${idPoa}`)
      .pipe(map((response) => response as AprobPoa));
  }
  // Método para actualizar el estado de aprobación del POA
  public actualizarEstadoAprobacion(id_poa: number, datap: ActualizarAprobPOA): Observable<AprobPoa> {
    return this.httpClient.put<AprobPoa>(`${baserUrl}/api/aprobacionpoa/actualizarestadoaprob/${id_poa}`, datap);
  }
}
