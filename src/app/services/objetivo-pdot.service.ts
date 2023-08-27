import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjetivoPDOT } from '../models/ObjetivoPDOT';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoPdotService {
  constructor(private http: HttpClient) { }

  listar(): Observable<ObjetivoPDOT[]> {
    return this.http.get<ObjetivoPDOT[]>(`${baserUrl}/api/objetivopdot/listar`);
  }
  crear(r: ObjetivoPDOT): Observable<ObjetivoPDOT> {
    return this.http.post<ObjetivoPDOT>(`${baserUrl}/api/objetivopdot/crear`, r
    );
  }

  actualizar(id: any, objet: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/objetivopdot/actualizar/${id}`, objet);
  }

  eliminar(objet: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/objetivopdot/eliminarlogic/${objet.id_objetivo_pdot}`, objet);
  }

     // Método para listar los objetivos Pdots por ID de componente
     listarObjetivosPdotsPorIdComponente(idComponente: number): Observable<ObjetivoPDOT[]> {
      return this.http.get<ObjetivoPDOT[]>(`${baserUrl}/api/objetivopdot/listaObjetivosPdots/`+idComponente);
    }
 
}
