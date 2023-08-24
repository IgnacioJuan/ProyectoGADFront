import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../models/Evidencia';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
  evidenciaObj: Evidencia[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/evidencia/crear`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evidencia/actualizar/${id}`, crite);
  }
  //Metodo para listar

  getEvidencias(): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarv`);
  }

 //Metodo para listarAsigna

 /*getEvidenciasAdmin():Observable<Evidencia[]>{
  return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarvAsigna`);
}*/


getEvidenciasAdmin(id: number): Observable<Evidencia[]> {
  return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarvAsigna/${id}`);
}



  eliminarEvidencia(evi: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evidencia/eliminarlogic/${evi.id_evidencia}`, evi);
  }

  getEvidenciaIndicador(id: number): Observable<Evidencia> {
    return this.http.get<Evidencia>(`${baserUrl}/api/evidencia/listarIndicador/${id}`);
  }

  //Listar por usuario
  public getAsignacionUsuario(user: String): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/asignacionevidencia/listarEviUsua/` + user);
  }

  public geteviasig(user: String): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/buscarev/${user}`);
  }

  //LISTAR RESPONSABLE
  public listarUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarResDatos`);
  }


  /*
 public listarUsuario(): Observable<any> {
    return this.http.get(`${baserUrl}/usuarios/listarResDatos`);
}
*/

  //metodo para consumir servicio @GetMapping("/listarEvidenciaPorIndicador/{id_indicador}")
  public getEvidenciaPorIndicador(id: number): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarEvidenciaPorIndicador/${id}`);
  }

  public listarUsuarioRes(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarResponsableAdmin`);
  }
  

}
