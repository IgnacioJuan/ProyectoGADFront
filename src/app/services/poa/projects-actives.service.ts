
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import baserUrl from "../helper";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProjectsActivesService {
    constructor(private http: HttpClient) { }

    //metod for get all projects actives
    public getProjectsActives(): Observable<any> {
        return this.http.get(`${baserUrl}/api/proyecto/listsActiveProjects`);
    }
}
