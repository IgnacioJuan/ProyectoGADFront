import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArchivosRechazados } from '../models/ArchivosRechazados';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ArchivosrechazadosService {

  baserrl= environment.baserUrl;

  constructor(private http: HttpClient) { }
 

get():Observable<ArchivosRechazados[]>{
  return this.http.get<ArchivosRechazados[]>(`${baserUrl}/archivo/listarv`);
}

  listar(){
    return this.http.get(`${this.baserrl}/archivo/listar`);
  }

  borrar(filename:string){
    return this.http.get(`${this.baserrl}/archivo/borrar/${filename}`);
}

eliminar(archi:any): Observable<any> {
  return this.http.put(`${baserUrl}/archivo/eliminarlogic/${archi.id_archivo}`,archi);
}

}
