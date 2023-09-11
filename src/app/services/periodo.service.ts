import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import baserUrl from './helper';
import { Periodo_DTO } from '../interface/Periodo_DTO';
import { PeriodoTotalPOA_DTO } from '../interface/PeriodoTotalPOA_DTO';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  constructor(private http: HttpClient) {}

  public obtenerPeriodosByIdPoa(id_poa: number): Observable<Periodo_DTO[]> {
    return this.http
      .get(`${baserUrl}/api/periodo/porcentajereferencia/${id_poa}`)
      .pipe(map((response) => response as Periodo_DTO[]));
  }

  // Método para obtener los totales de POA por su ID
  public getTotalesPoa(idPoa: number): Observable<PeriodoTotalPOA_DTO> {
    return this.http.get(`${baserUrl}/api/periodo/totalespoa/${idPoa}`)
      .pipe(map((response) => response as PeriodoTotalPOA_DTO));
  }

}
