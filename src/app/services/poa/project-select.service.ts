
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import baserUrl from "../helper";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProjectSelectService {
    constructor(private http: HttpClient) { }
    public getProject(id: number): Observable<any> {
        return this.http.get(`${baserUrl}/api/proyecto/getProject?id_proyecto=${id}`);
    }
}
