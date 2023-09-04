import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Eje} from "../models/eje";
import baserUrl from "./helper";

@Injectable({
  providedIn: 'root'
})
export class AprobacionEvidenciaService {

  constructor(private httpClient : HttpClient) { }



}
