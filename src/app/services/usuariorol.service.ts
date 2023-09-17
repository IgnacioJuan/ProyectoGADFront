import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';
import { Observable } from 'rxjs';
import { UsuarioRol } from '../models/UsuarioRol';
import { UsuarioResponsableDTO } from '../models/UsuarioResponsableDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuariorolService {

  constructor(private http: HttpClient) { }

  getusuarios(): Observable<any[]> {
    return this.http.get<UsuarioRol[]>(`${baserUrl}/api/usuariorol/listarv`);
  }

  getusuariosResponsable(): Observable<any[]> {
    return this.http.get<UsuarioRol[]>(`${baserUrl}/api/usuariorol/listarUsuariosResponsables`);
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/usuariorol/actualizar/${id}`, crite);
  }

  actualizarResponsable(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/usuariorol/actualizarUResponsable/${id}`, crite);
  }

  getuResponsables(): Observable<any[]> {
    return this.http.get<UsuarioResponsableDTO[]>(`${baserUrl}/api/usuariorol/listarUResponsables`);
  }
}
