import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Indicadores } from '../models/Indicadores';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class IndicadorService {
  constructor(private http: HttpClient) { }

  listar(): Observable<Indicadores[]> {
    return this.http.get<Indicadores[]>(`${baserUrl}/api/Indicador/listar`);
  }
  crear(r: Indicadores): Observable<Indicadores> {
    return this.http.post<Indicadores>(`${baserUrl}/api/Indicador/crear`, r
    );
  }

  actualizar(id: any, indicad: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/Indicador/actualizar/${id}`, indicad);
  }

  eliminar(id: any, indicad: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/Indicador/eliminarlogic/${id}`, indicad);
  }

    // Método para listar los indicadores  por ID de metasPDOT
    listarmetasPdotsPorIdObjetivo(idMeta: number): Observable<Indicadores[]> {
      return this.http.get<Indicadores[]>(`${baserUrl}/api/Indicador/listaIndicadores/`+idMeta);
    }
}
