import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import baserUrl from "./helper";
import {Objetivoods} from "../models/objetivoods";

@Injectable({
  providedIn: 'root'
})
export class ObjetivoodsService {

  constructor(private httpClient : HttpClient) { }


  obtenerListaobjetivoods(): Observable<Objetivoods[]>{
    return this.httpClient.get<Objetivoods[]>(`${baserUrl}/api/objetivosods/listar`);
  }

  crearobjetivoods(r: Objetivoods): Observable<Object> {
    return this.httpClient.post(`${baserUrl}/api/objetivosods/crear`, r);
  }

  eliminarobjetivoods(comp: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/api/objetivosods/eliminarlogic/${comp.id_objetivo_ods}`, comp);
  }
}
