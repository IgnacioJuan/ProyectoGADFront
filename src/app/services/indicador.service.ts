import { HttpClient, HttpParams } from '@angular/common/http';
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
    // Método para listar los indicadores  por ID de metasPDOT
    listarIndiById(id: number): Observable<Indicadores[]> {
      return this.http.get<Indicadores[]>(`${baserUrl}/api/Indicador/buscar/${id}`);
    }

    //para listar indicadores por proyecto
    listarIndicadoresPorProyectos(ids: number[]): Observable<Indicadores[]> {
      // Convierte la lista de IDs en una cadena separada por comas
      const idsString = ids.join(',');
    
      // Configura los parámetros de la solicitud
      const params = new HttpParams().set('idsProyectos', idsString);
    
      // Realiza la solicitud HTTP GET con los parámetros
      return this.http.get<Indicadores[]>(`${baserUrl}/api/Indicador/porproyectos`, { params });
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
