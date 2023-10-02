import { Injectable } from '@angular/core';
import { map, Observable, catchError, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { Competencia } from '../models/Competencia';
import { ReportICompetencia } from '../models/ReportICompetencia';


@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {
  private apiUrl = 'http://localhost:5000/api/competencia'; 
  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Error:', error);
    return throwError(error);
  }

  crearCompetencia(competencia: Competencia): Observable<Competencia> {
    return this.http.post<Competencia>(`${this.apiUrl}/crear`, competencia)
      .pipe(catchError(this.handleError));
  }

  obtenerListaCompetencias(): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(`${this.apiUrl}/listar`)
      .pipe(catchError(this.handleError));
  }

  obtenerCompetenciaPorId(id: number): Observable<Competencia> {
    return this.http.get<Competencia>(`${this.apiUrl}/buscar/${id}`)
      .pipe(catchError(this.handleError));
  }

  eliminarCompetencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`)
      .pipe(catchError(this.handleError));
  }

  actualizarCompetencia(id: number, competencia: Competencia): Observable<Competencia> {
    return this.http.put<Competencia>(`${this.apiUrl}/actualizar/${id}`, competencia)
      .pipe(catchError(this.handleError));
  }

  eliminarLogicoCompetencia(id: number): Observable<Competencia> {
    return this.http.put<Competencia>(`${this.apiUrl}/eliminarlogic/${id}`, null)
      .pipe(catchError(this.handleError));
  }

  obtenerCompetenciaPorNombre(nombre: string): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(`${this.apiUrl}/buscarcompetencianombre/${nombre}`)
      .pipe(catchError(this.handleError));
  }

  obtenerReportesICompetencias(): Observable<ReportICompetencia[]> {
    return this.http.get<ReportICompetencia[]>(`${baserUrl}/api/competencia/reporteicompetencias`)
      .pipe(catchError(this.handleError));
  }

  obtenerPDF(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(`${baserUrl}/api/competencia/export-pdf`, { headers: headers, responseType: 'blob' });
  }

}