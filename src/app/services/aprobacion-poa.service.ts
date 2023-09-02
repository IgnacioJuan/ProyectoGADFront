import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proyecto } from '../models/Proyecto';
import baserUrl from './helper';
import { AprovacionPoa } from '../models/aprovacion-poa';

@Injectable({
  providedIn: 'root'
})
export class AprobacionPoaService {

  constructor(private http: HttpClient) { }

  getAprobacionPoa(): Observable<AprovacionPoa[]> {
    return this.http.get<AprovacionPoa[]>(`${baserUrl}/api/aprobacionpoa/listar`);
  }

}
