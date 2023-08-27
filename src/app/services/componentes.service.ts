import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Componentes } from '../models/Componentes';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService {
  constructor(private http: HttpClient) { }

  listar(): Observable<Componentes[]> {
    return this.http.get<Componentes[]>(`${baserUrl}/api/componente/listar`);
  }
  crear(r: Componentes): Observable<Componentes> {
    return this.http.post<Componentes>(`${baserUrl}/api/componente/crear`, r
    );
  }

  actualizar(id: any, comp: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/componente/actualizar/${id}`, comp);
  }

  eliminar(comp: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/componente/eliminarlogic/${comp.id_componente}`, comp);
  }


}
