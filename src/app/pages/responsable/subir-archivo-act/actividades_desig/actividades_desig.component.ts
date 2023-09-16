import { Component, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { Actividad_arch } from 'src/app/services/actividad_arch';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
//import { ModeloService } from 'src/app/services/modelo.service';
import { Archivo } from 'src/app/models/Archivo';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { Poa_proyec_dto } from 'src/app/interface/poa_proyec_dto';
@Component({
  selector: 'app-actividades_desig',
  templateUrl: './actividades_desig.component.html',
  styleUrls: ['./actividades_desig.component.css'],
})
export class Actividades_desigComponent implements OnInit {
  acti: Actividad_arch[] = [];
  isLoggedIn: boolean;
  user: any;
  botonDeshabilitado: boolean | undefined;
  dataSource = new MatTableDataSource<Actividad_arch>();
  displayedColumns: string[] = [
    'id_actividad',
    'nombre',
    'descripcion',
    'codifcado',
    'devengado',
    'presupuesto_referencial',
    'recursos_propios',
    'Subir archivo',
  ];
  ocultar=false;
  constructor(
    private login: LoginService,
    //private modeloService: ModeloService,
    private router: Router,
    private serviactiv: ActividadService,
    //importar el spinner como servicio
    private loadingService: LoadingServiceService
  ) {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
  }

  ngAfterViewInit() {
    console.log('Paginator:', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
poaacti: Poa_proyec_dto = new Poa_proyec_dto();
  ngOnInit() {
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    const data = history.state.data;
    this.poaacti = data;
    if (this.poaacti == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
console.log("poa ="+this.poaacti.id_poa)

    this.getPoaActividades(this.user.id,this.poaacti.id_poa)
  }
  getPoaActividades(idres: number, idpoa: number): void {
    this.serviactiv.getPoaActividades(idres, idpoa).subscribe(
      data => {
        this.dataSource.data = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
  archivo: Archivo = new Archivo();

  verDetalles(archivos: any) {
    this.router.navigate(['/res/activ/subir_archiivo'], {
      state: { data: archivos },
    });
  }
}
