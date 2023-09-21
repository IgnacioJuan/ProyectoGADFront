import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { PoaActividadProjection } from 'src/app/interface/PoaActividadProjection';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Poa } from 'src/app/models/Poa';
import { LoginService } from 'src/app/services/login.service';
import { PoaService } from 'src/app/services/poa.service';

@Component({
  selector: 'app-listapoa',
  templateUrl: './listapoa.component.html',
  styleUrls: ['./listapoa.component.css']
})
export class ListaPoaComponent implements OnInit{
  itemsPerPageLabel = 'Poas por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  rango:any= (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    }
  
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };

  public poa = new Poa();
  poas: PoaActividadProjection[] = [];
  public activ = new ActividadesPoa();
  ocultarID: boolean = false;
  isLoggedIn: boolean;
  user: any;
  userRole: any;

  filterPost = '';
  filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;
  dataSource = new MatTableDataSource<PoaActividadProjection>();
  columnasPoa: string[] = ['id_poa','id_proyecto','nombreProyecto','meta_planificada','tipo_periodo','cantidadActividades'];
  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private poaservice: PoaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private loadingService: LoadingServiceService, private login: LoginService
  ) {
    this.loadingService.show();
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.userRole = this.login.getUserRole();
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;

    if (this.user && this.userRole === 'ADMIN') {
      this.obtenerDatosPoas(this.user.id);
    } else if (this.user && this.userRole === 'SUPERADMIN') {
      this.obtenerDatosPoas2();
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }

  ngOnInit(): void {}

  //    LISTAR POAS SEGUN ADMIN O SUPER
  obtenerDatosPoas(usuarioId: number): void {
    this.poaservice.obtenerDatosPoas(usuarioId).subscribe(
      (data: any[]) => {
        this.poas = data;
        this.dataSource.data = this.poas;
        this.loadingService.hide();
      },
      (error: any) => {
        console.error('Error al listar poas:', error);
        this.loadingService.hide();
      }
    );
  }
  
  obtenerDatosPoas2(): void {
    this.poaservice.obtenerDatosPoas2().subscribe(
      (data: any[]) => {
        this.poas = data;
        this.dataSource.data = this.poas;
        this.loadingService.hide();
      },
      (error: any) => {
        console.error('Error al listar poas:', error);
        this.loadingService.hide();
      }
    );
  }


  verActividades(poa: any) {
    this.router.navigate(['/sup/actividades-presupuestos/tabla-actividades'], { state: { data: poa } });
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.poas;;
    }
  }

}
