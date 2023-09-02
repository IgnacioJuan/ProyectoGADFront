import { Injectable } from '@angular/core';
import { Proyecto } from '../models/Proyecto';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private http: HttpClient) { }

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${baserUrl}/api/proyecto/listar`);
  }
  getProyectoById(id: number): Observable<Proyecto> {

    return this.http.get<Proyecto>(`${baserUrl}/api/proyecto/buscar/${id}`);
  }
// No borar sirve para bsucar el proyecto del poa 

buscarProyectosPorIds(ids: number[]): Observable<any> {
  // Convierte la lista de IDs en una cadena separada por comas
  const idsString = ids.join(',');

  // Configura los parámetros de la solicitud
  const params = new HttpParams().set('ids', idsString);

  // Realiza la solicitud HTTP GET con los parámetros
  return this.http.get(`${baserUrl}/api/proyecto/buscarPorIds`, { params });
}



  getProyectosPoa(id_poa:any): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${baserUrl}/api/proyecto/poa/${id_poa}`);
  }
  getProyectosPorPoa(id_poa: any): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${baserUrl}/api/proyecto/poa/${id_poa}`);
  }
  getProyectosdelModelo(id_modelo_poa:number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${baserUrl}/api/proyecto/listardelModelo/${id_modelo_poa}`);
  }
  crear(r: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${baserUrl}/api/proyecto/crear`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/proyecto/actualizar/${id}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/proyecto/eliminarlogic/${crite.id_proyecto}`, crite);

  }

 
  //Listas para crear el proyecto en el flujo proyecto
  getPNDOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/objetivopnd/listar`);
  }
  getODSOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/objetivosods/listar`);
  }
  getProgramaOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/programa/listar`);
  }
  getIndicadorOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/Indicador/listar`);
  }
  getCompetenciaOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/competencia/listar`);
  }
}
