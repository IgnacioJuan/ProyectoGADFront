import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AprobPoa, CrearAprobPOA } from '../models/AprobPoa';
import baserUrl from './helper';


@Injectable({
  providedIn: 'root'
})
export class PoacService {

  constructor(private http: HttpClient, private httpClient: HttpClient) { }

  //Metodo para listar POA
  public getPoaAprob(): Observable<AprobPoa[]> {
    return this.httpClient.get(`${baserUrl}/api/aprobacionpoa/obtenerpoasaprb`).
      pipe(map((response) => response as AprobPoa[]));
  }
  // Método para obtener una aprobación de POA por su ID
  public getPoaAprobById(idPoa: number): Observable<AprobPoa> {
    return this.httpClient.get(`${baserUrl}/api/aprobacionpoa/obtenerpoaprb/${idPoa}`)
      .pipe(map((response) => response as AprobPoa));
  }
  // Método para actualizar el estado de aprobación del POA
  public crearEstadoAprobacion(id_poa: number, datap: CrearAprobPOA): Observable<AprobPoa> {
    return this.httpClient.post<AprobPoa>(`${baserUrl}/api/aprobacionpoa/crearnestadoaprob/${id_poa}`, datap);
  }

  public existProject(id_proyecto: number): Observable<any> {
    return this.http.get<boolean>(`${baserUrl}/api/proyecto/existProject?id_proyecto=${id_proyecto}`);
  }
}
