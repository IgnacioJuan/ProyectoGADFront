import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { PresupuestoExterno } from '../models/PresupuestoExterno';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoExternoService {
  peObject: PresupuestoExterno[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/presupuestoexterno/crear`, r
    );
  }

  actualizar(id: any, pe: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/presupuestoexterno/actualizar/${id}`, pe);
  }

  getPresupuestoEPorId(id: number): Observable<PresupuestoExterno> {
    return this.http.get<PresupuestoExterno>(`${baserUrl}/api/presupuestoexterno/buscar/${id}`);
  }

  eliminarPresupuestoE(pe: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/presupuestoexterno/eliminarlogic/${pe.id_presupuesto_externo}`, pe);
  }

  listarPEActividades(actividadId: number): Observable<PresupuestoExterno[]> {
    return this.http.get<PresupuestoExterno[]>(`${baserUrl}/api/presupuestoexterno/listarPEActividades/${actividadId}`);
  }

}
