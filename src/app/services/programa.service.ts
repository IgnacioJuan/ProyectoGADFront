import { Injectable } from '@angular/core';
import { map, Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { Programa, ProgramaUsuarioDTO } from '../models/Programa';


@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  private baseUrl: string = 'http://146.190.137.83:5000/api/programa';

  constructor(private http: HttpClient) { }

  crear(programa: Programa): Observable<Programa> {
    return this.http.post<Programa>(`${this.baseUrl}/crear`, programa);
  }

  listar(): Observable<Programa[]> {
    return this.http.get<Programa[]>(`${this.baseUrl}/listar`);
  }

  listarUserPrograma(): Observable<ProgramaUsuarioDTO[]> {
    return this.http.get<ProgramaUsuarioDTO[]>(`${this.baseUrl}/listar`);
  }

  getById(id: number): Observable<Programa> {
    return this.http.get<Programa>(`${this.baseUrl}/buscar/${id}`);
  }

  eliminar(id: number, programa: Programa): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/eliminar/${id}`, { body: programa });
  }

  eliminarLogic(id: number): Observable<Programa> {
    return this.http.put<Programa>(`${this.baseUrl}/eliminarlogic/${id}`, {});
  }

  actualizar(id: number, programa: Programa): Observable<Programa> {
    return this.http.put<Programa>(`${this.baseUrl}/actualizar/${id}`, programa);
  }

  buscarProgramasPorNombreDTO(nombre: string): Observable<Programa[]> {
    return this.http.get<Programa[]>(`${this.baseUrl}/buscarprogramanombre/${nombre}`);
  }
}

