import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Poa_proyec_dto } from 'src/app/interface/poa_proyec_dto';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { Actividad_arch } from 'src/app/services/actividad_arch';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { PoaService } from '../../../../services/poa.service';
@Component({
  selector: 'app-poa_proyectos',
  templateUrl: './poa_proyectos.component.html',
  styleUrls: ['./poa_proyectos.component.css'],
})
export class Poa_proyectosComponent implements OnInit {
  dataSource = new MatTableDataSource<Poa_proyec_dto>();
  isLoggedIn: boolean;
  user: any;

  ocultar=false;
  
  displayedColumns: string[] = [
    'id_proyecto',
    'id_poa',
    'nombre_proyecto',
    'meta_planificada',
    'Actividades',
  ];

  constructor(
    private login: LoginService,
    //private modeloService: ModeloService,
    private router: Router,
    private loadingService: LoadingServiceService,
  private  poaser:PoaService
  ) {    this.isLoggedIn = this.login.isLoggedIn();
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
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
  });
  this.getPoaactiprojections(this.user.id);
}
  getPoaactiprojections(id: number): void {
    this.loadingService.show();

    this.poaser.getPoaactiprojection(id).subscribe(
      data => {
        this.dataSource.data = data;
        this.loadingService.hide();

      },
      error => {
        console.error('Error fetching data:', error);
        this.loadingService.hide();
      }
    );
  }
  actividades: Actividad_arch = new Actividad_arch();
  verDetalles(actividades: any) {
    this.router.navigate(['/res/activ/actividadesdesig'], {
      state: { data: actividades },
    });
  }
}
