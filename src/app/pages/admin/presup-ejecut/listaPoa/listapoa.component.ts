import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { PoaporFechaRepoProjection } from 'src/app/interface/PoaporFechaRepoProjection';
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
  poas: PoaporFechaRepoProjection[] = [];
  public activ = new ActividadesPoa();
  ocultarID: boolean = false;

  user: any = null;

  filterPost = '';
  filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;
  dataSource = new MatTableDataSource<PoaporFechaRepoProjection>();
  columnasPoa: string[] = ['id_poa','nombreProyecto','meta_planificada','tipo_periodo','cantidadActividades'];
  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private poaservice: PoaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private loadingService: LoadingServiceService,
    public login: LoginService,

  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    this.user = this.login.getUser();

    this.listar();
  }

  listar(): void {
    this.loadingService.show();

    let id:number | null = this.user.id;
    if (this.login.getUserRole() === 'SUPERADMIN') {
      id=null;
    }
    this.poaservice.listarPoaApAdm(id).subscribe(
      (data: any[]) => {
        this.loadingService.hide();

        this.poas = data;
        this.dataSource.data = this.poas;
      },
      (error: any) => {
        this.loadingService.hide();

        console.error('Error al listar poas:', error);
      }
    );
  }

  verActividades(poa: any) {
    this.router.navigate(['/adm/presup-ejecut/tabla-actividades'], { state: { data: poa } });
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
