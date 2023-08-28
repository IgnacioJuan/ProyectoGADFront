import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetasPDOT } from '../models/MetasPDOT';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class MetasPdotService {
  constructor(private http: HttpClient) { }

  listar(): Observable<MetasPDOT[]> {
    return this.http.get<MetasPDOT[]>(`${baserUrl}/api/metapdot/listar`);
  }
  crear(r: MetasPDOT): Observable<MetasPDOT> {
    return this.http.post<MetasPDOT>(`${baserUrl}/api/metapdot/crear`, r
    );
  }

  actualizar(id: any, meta: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/metapdot/actualizar/${id}`, meta);
  }

  eliminar(id: any, meta: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/metapdot/eliminarlogic/${id}`, meta);
  }

  // Método para listar las metas Pdots por ID de objetivosPDOT
  listarmetasPdotsPorIdObjetivo(idObjetivo: number): Observable<MetasPDOT[]> {
    return this.http.get<MetasPDOT[]>(`${baserUrl}/api/metapdot/listaMetasPdots/`+idObjetivo);
  }
}
