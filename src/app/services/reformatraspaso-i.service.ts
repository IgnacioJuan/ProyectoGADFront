import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { ReformaTraspasoI } from '../models/ReformaTraspasoI';

@Injectable({
  providedIn: 'root'
})
export class ReformaTraspasoIService {
  rtiObject: ReformaTraspasoI[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/reformatraspaso_i/crear`, r
    );
  }

  actualizar(id: any, rti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/reformatraspaso_i/actualizar/${id}`, rti);
  }

  getPresupuestoEPorId(id: number): Observable<ReformaTraspasoI> {
    return this.http.get<ReformaTraspasoI>(`${baserUrl}/api/reformatraspaso_i/buscar/${id}`);
  }

  eliminarPresupuestoE(rti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/reformatraspaso_i/eliminarlogic/${rti.id_reftras_i}`, rti);
  }
}