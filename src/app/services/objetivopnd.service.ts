import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import baserUrl from "./helper";
import {Objetivopnd} from "../models/objetivopnd";

@Injectable({
  providedIn: 'root'
})
export class ObjetivopndService {

  constructor(private httpClient : HttpClient) { }

  obtenerListaobjetivospnd(): Observable<Objetivopnd[]>{
    return this.httpClient.get<Objetivopnd[]>(`${baserUrl}/api/objetivopnd/listar`);
  }

  crearobjetivopnd(r: Objetivopnd): Observable<Object> {
    return this.httpClient.post(`${baserUrl}/api/objetivopnd/crear`, r);
  }

  eliminarobjetivopnd(comp: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/api/objetivopnd/eliminarlogic/${comp.id_objetivo_pnd}`, comp);
  }

  actualizarobjetivopnd(id: any, comp: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/api/objetivopnd/actualizar/${id}`, comp);
  }

  listarObjetivosPorEje(eje: any): Observable<Objetivopnd[]> {
    return this.httpClient.get<Objetivopnd[]>(`${baserUrl}/api/objetivopnd/por-eje?idEje=${eje.id_eje}`);
  }

}
