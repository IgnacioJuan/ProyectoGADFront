import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { Actividad_arch } from 'src/app/services/actividad_arch';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { ModeloService } from 'src/app/services/modelo.service';
import { Archivo } from 'src/app/models/Archivo';


@Component({
  selector: 'app-actividades_desig',
  templateUrl: './actividades_desig.component.html',
  styleUrls: ['./actividades_desig.component.css']
})
export class Actividades_desigComponent implements OnInit {
  acti:Actividad_arch[]=[];
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
  
  constructor(
    private login: LoginService,
    private modeloService: ModeloService,
    private router: Router,
    private serviactiv : ActividadService
 
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

  ngOnInit() {
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );

    console.log("john"+this.user.id);
    this.serviactiv.listaractireponsa(this.user.id).subscribe(data => {
      this.acti = data;
      this.dataSource.data = data;
      this.dataSource.data = this.acti; // Actualizar el dataSource
    });

    
  }
  archivo: Archivo = new Archivo();

  
  verDetalles(archivos: any) {
    this.router.navigate(['/res/activ/subir_archiivo'], { state: { data: archivos } });
  }

}
