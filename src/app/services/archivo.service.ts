import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
 import baserUrl from './helper';
import { Archivo } from '../models/Archivo';
import { ArchivoProjection } from '../interface/ArchivoProjection';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  baserrl= environment.baserUrl;

  constructor(private http: HttpClient) { }
  cargarpparagad(file: File, descripcion: string, valor: number, id_evidencia: number): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('descripcion', descripcion);
    formData.append('valor', valor.toString());
    formData.append('id_evidencia', id_evidencia.toString());
 
    const req = new HttpRequest('POST', `${this.baserrl}/archivo/upload`, formData, {
      reportProgress: true,
     responseType: 'json'
    });
 
    return this.http.request(req);
  }
 
   cargar(file: File, descripcion: string,  id_evidencia: number): Observable<HttpEvent<any>> {
     const formData: FormData = new FormData();
     formData.append('file', file);
     formData.append('descripcion', descripcion);
     formData.append('id_evidencia', id_evidencia.toString());
  
     const req = new HttpRequest('POST', `${this.baserrl}/archivo/upload`, formData, {
       reportProgress: true,
      responseType: 'json'
     });
  
     return this.http.request(req);
   }
  
cargarArchivo(file: File, descripcion: string): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('descripcion', descripcion);
  return this.http.post<any>(`${this.baserrl}/archivo/upload`, formData);
}
  //listado de la clase archivo

get():Observable<Archivo[]>{
  return this.http.get<Archivo[]>(`${baserUrl}/archivo/listarv`);
}

getDatos():Observable<ArchivoProjection[]>{
  return this.http.get<ArchivoProjection[]>(`${baserUrl}/archivo/listararchi`);
}
//listado de la clase archivo
  listar(){
    return this.http.get(`${this.baserrl}/archivo/listar`);
  }


  borrar(filename:string){
    return this.http.get(`${this.baserrl}/archivo/borrar/${filename}`);
}
public geteviasig(user: String): Observable<Archivo[]> {
  return this.http.get<Archivo[]>(`${baserUrl}/archivo/buscarev/${user}`);
}
public getarchivoActividad(idActi: number): Observable<Archivo[]> {
  return this.http.get<Archivo[]>(`${baserUrl}/archivo/buscararchivo/${idActi}`);
}

eliminar(archi:any): Observable<any> {
  return this.http.put(`${baserUrl}/archivo/eliminarlogic/${archi.id_archivo}`,archi);
}


editArchivo(
  archivoId: number,
  file: File,
  descripcion: string,
  valor: number,
  idActividad: number
): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('file', file);
  formData.append('descripcion', descripcion);
  formData.append('valor', valor.toString());
  formData.append('id_evidencia', idActividad.toString());
  const url = `${baserUrl}/upload/${archivoId}`;
  const headers = new HttpHeaders();

  return this.http
    .put(url, formData, { headers, observe: 'response' })
    .pipe(catchError(this.handleError));
}

private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  return throwError('Something went wrong; please try again later.');
}

}
