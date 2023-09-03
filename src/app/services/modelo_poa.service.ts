import { Injectable } from '@angular/core';
import { ModeloPoa } from '../models/ModeloPoa';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ModeloPoaService {

  constructor(private http: HttpClient) { }
  getModeloPoaById(id_modelo: number): Observable<any> {
    return this.http.get(`${baserUrl}/api/modelopoa/buscar/${id_modelo}`);

  }

  getModeloPoas(): Observable<ModeloPoa[]> {
    return this.http.get<ModeloPoa[]>(`${baserUrl}/api/modelopoa/listar_modelo`);
  }
  crear(r: ModeloPoa): Observable<ModeloPoa> {
    return this.http.post<ModeloPoa>(`${baserUrl}/api/modelopoa/crear_modelo`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/modelopoa/actualizar/${id}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/modelopoa/eliminar/${crite.id_modelo_poa}`, crite);

  }

 
}
