
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import baserUrl from "../helper";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PoaInsertService {
    constructor(private http: HttpClient) { }
    public getProject(id: number): Observable<any> {
        return this.http.get(`${baserUrl}/api/proyecto/getProject?id_proyecto=${id}`);
    }

    public crear(r: any, id_responsable: any, id_superadmin: any): Observable<any> {
        return this.http.post<any>(`${baserUrl}/api/poa/solicitud?id_responsable=${id_responsable}&id_superadmin=${id_superadmin}`, r
        );
    }

    //metodo post para este servicio http://localhost:5000/api/aprobacionpoa/solicitarAprobacion?idPoa=3&idUsuario=1&idProyecto=2
    public solicitarAprobacion(idPoa: number, idUsuario: number, idProyecto: number): Observable<any> {
        return this.http.post<any>(`${baserUrl}/api/aprobacionpoa/solicitarAprobacion?idPoa=${idPoa}&idUsuario=${idUsuario}&idProyecto=${idProyecto}`, null
        );
    }

    //METODO POST PARA http://localhost:5000/api/actividades/solicitud?nombre=100&institucion_beneficiaria=100&recursos_externos=100&valor_uno=100&valor_dos=100&valor_tres=100&valor_cuatro=100&descripcion=100&id_poa=100&id_superadmin=100&recursos_propios=100&presupuesto_referencial=100
    public crearActividad(
        nombre: string,
        institucion_beneficiaria: string,
        recursos_externos: number,
        valor_uno: number,
        valor_dos: number,
        valor_tres: number,
        valor_cuatro: number,
        descripcion: string,
        id_poa: any,
        id_superadmin: any,
        recursos_propios: number,
        presupuesto_referencial: number): Observable<any> {
        return this.http.post<any>(`${baserUrl}/api/actividades/solicitud?nombre=${nombre}&institucion_beneficiaria=${institucion_beneficiaria}&recursos_externos=${recursos_externos}&valor_uno=${valor_uno}&valor_dos=${valor_dos}&valor_tres=${valor_tres}&valor_cuatro=${valor_cuatro}&descripcion=${descripcion}&id_poa=${id_poa}&id_superadmin=${id_superadmin}&recursos_propios=${recursos_propios}&presupuesto_referencial=${presupuesto_referencial}`, null);
    }

    //nuevo post para http://localhost:5000/api/aprobacionactividad/Solicitar?id_usuario=1&id_actividad=1&id_poa=2
    public solicitarAprobacionActividad(id_usuario: number, id_actividad: number, id_poa: number): Observable<any> {
        return this.http.post<any>(`${baserUrl}/api/aprobacionactividad/Solicitar?id_usuario=${id_usuario}&id_actividad=${id_actividad}&id_poa=${id_poa}`, null
        );
    }

    //http://localhost:5000/api/presupuestoexterno/Solicitud?valor=45&id_actividad=45&nombre_institucion=45&observacion=45
    public crearPresupuestoExterno(valor: number, id_actividad: number, nombre_institucion: string, observacion: string): Observable<any> {
        return this.http.post<any>(`${baserUrl}/api/presupuestoexterno/Solicitud?valor=${valor}&id_actividad=${id_actividad}&nombre_institucion=${nombre_institucion}&observacion=${observacion}`, null
        );
    }

    //http://localhost:5000/api/periodo/solicitud?value=100&id_actividad=2&referencia=2
    public crearPeriodo(value: number, id_actividad: number, referencia: number): Observable<any> {
        return this.http.post<any>(`${baserUrl}/api/periodo/solicitud?value=${value}&id_actividad=${id_actividad}&referencia=${referencia}`, null
        );
    }
}
