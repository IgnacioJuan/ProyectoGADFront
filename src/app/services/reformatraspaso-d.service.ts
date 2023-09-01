import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { ReformaTraspasoD } from '../models/ReformaTraspasoD';

@Injectable({
  providedIn: 'root'
})
export class ReformaTraspasoDService {
  rtdObject: ReformaTraspasoD[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/reformatraspaso_d/crear`, r
    );
  }

  actualizar(id: any, rtd: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/reformatraspaso_d/actualizar/${id}`, rtd);
  }

  getReformaTDPorId(id: number): Observable<ReformaTraspasoD> {
    return this.http.get<ReformaTraspasoD>(`${baserUrl}/api/reformatraspaso_d/buscar/${id}`);
  }

  eliminarReformaTD(rtd: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/reformatraspaso_d/eliminarlogic/${rtd.id_reftras_d}`, rtd);
  }

  listarRTDActividades(): Observable<ReformaTraspasoD[]> {
    return this.http.get<ReformaTraspasoD[]>(`${baserUrl}/api/reformatraspaso_d/listarRTDActividades`);
  }
}