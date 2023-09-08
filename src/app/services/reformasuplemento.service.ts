import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { PresupuestoExterno } from '../models/PresupuestoExterno';
import { ReformaSuplemento } from '../models/ReformaSuplemento';

@Injectable({
  providedIn: 'root'
})
export class ReformaSuplementoService {
  rsObject: ReformaSuplemento[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/reformasuplemento/crear`, r
    );
  }

  actualizar(id: any, rs: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/reformasuplemento/actualizar/${id}`, rs);
  }

  getPresupuestoEPorId(id: number): Observable<ReformaSuplemento> {
    return this.http.get<ReformaSuplemento>(`${baserUrl}/api/reformasuplemento/buscar/${id}`);
  }

  eliminarPresupuestoE(rs: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/reformasuplemento/eliminarlogic/${rs.id_ref_suplemento}`, rs);
  }
  
  listarRSActividades(actividadId: number): Observable<ReformaSuplemento[]> {
    return this.http.get<ReformaSuplemento[]>(`${baserUrl}/api/reformasuplemento/listarRSActividades/${actividadId}`);
  }
}