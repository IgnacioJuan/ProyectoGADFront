import { Injectable } from '@angular/core';
import baserUrl from './helper';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Eje} from "../models/eje";

@Injectable({
  providedIn: 'root'
})
export class EjeService {

  constructor(private httpClient : HttpClient) { }

  obtenerListaejes(): Observable<Eje[]>{
    return this.httpClient.get<Eje[]>(`${baserUrl}/api/eje/listar`);
  }

  crearejes(r: Eje): Observable<Object> {
    return this.httpClient.post(`${baserUrl}/api/eje/crear`, r);
  }

  eliminareje(comp: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/api/eje/eliminarlogic/${comp.id_eje}`, comp);
  }

  actualizareje(id: any, comp: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/api/eje/actualizar/${id}`, comp);
  }

}
