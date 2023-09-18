import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Poa } from 'src/app/models/Poa';
import { LoginService } from 'src/app/services/login.service';
import { PoaService } from 'src/app/services/poa.service';
import { ArchivoService } from 'src/app/services/archivo.service';
import { Archivo } from 'src/app/models/Archivo';
import { PoasEnviadosProjection } from 'src/app/interface/PoasAdminEnviadosProjection';
import { PoaporFechaRepoProjection } from 'src/app/interface/PoaporFechaRepoProjection';
import { ArchivoPoaProjection } from 'src/app/interface/ArchivoPoaProjection';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-poas',
  templateUrl: './poas.component.html',
  styleUrls: ['./poas.component.css']
})
export class PoasComponent {
  //meta
  frmPoa: FormGroup;
  public poa = new Poa();

  //Listar Poas
  listaPoas: PoaporFechaRepoProjection[] = [];
  listaArchivo: ArchivoPoaProjection[] = [];

  //Usuario logueado
  user: any = null;
  //tabla
  itemsPerPageLabel = 'Poas por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  //Filtro
  public poaSelected = new Poa();
  rango: any = (page: number, pageSize: number, length: number) => {
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

  //Columnas Tabla
  columnasObservaciones: string[] = ['descripcion', 'fecha', 'valor', 'enlace'];
  columnasUsuario: string[] = [
    'nombre',
    'barrio',
    'cobertura',
    'comunidad',
    'fecha_inicio',
    'fecha_fin',
    'localizacion',
    'meta',
    'observaciones',
  ];
  dataSource = new MatTableDataSource<PoasEnviadosProjection>();
  dataSource3 = new MatTableDataSource<ArchivoPoaProjection>();

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private poaService: PoaService,
    public login: LoginService,
    private archivoService: ArchivoService,
    private fb: FormBuilder,
    private loadingService: LoadingServiceService

  ) {
    this.frmPoa = fb.group({
      meta_alcanzar: ['', Validators.required],
      meta_planificada: ['']
    });
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }
  ngOnInit(): void {
    //Capturar usuario logueado
    this.user = this.login.getUser();
    this.listarPoas();
  }

  //Buscar
  filterPost: string = '';
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  resultadosEncontradosporEstado: boolean = true;
  resultadosEncontradosporObservaciones: boolean = true;

  //Metodo para listar
  listarPoas(): void {
    this.loadingService.show();

    let id:number | null = this.user.id;
    if (this.login.getUserRole() === 'SUPERADMIN') {
      id=null;
    }
    this.poaService.listarPoaApAdm(id).subscribe(
      (data: any[]) => {
        this.loadingService.hide();

        this.listaPoas = data;
        console.log('Dataa');
        console.log(this.listaPoas);
        this.dataSource.data = this.listaPoas;
        this.resultadosEncontradosporEstado = this.listaPoas.length > 0; // Actualiza la variable según si se encontraron resultados
      },
      (error: any) => {
        this.loadingService.hide();

        console.error('Error al listar los poas:', error);
        this.resultadosEncontradosporEstado = false; // Si ocurre un error, no se encontraron resultados
      }
    );
  }

  //Metodo para buscar
  buscar() {
    // Filtra los componentes basados en el filtro
    this.filteredComponentes = this.listaPoas.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource.data = this.filteredComponentes;
    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }





  //Ver observaciones
  verDetalles(poa: any) {
    this.archivoService.listarArchivosdelPoa(poa.id_poa).subscribe(
      (data: any[]) => {
        this.listaArchivo = data;
        this.dataSource3.data = this.listaArchivo;
        this.resultadosEncontradosporObservaciones =
          this.listaArchivo.length > 0; // Actualiza la variable según si se encontraron resultados
      },
      (error: any) => {
        console.error('Error al listar las observaciones:', error);
        this.resultadosEncontradosporObservaciones = false; // Si ocurre un error, no se encontraron resultados
      }
    );
  }

  //agregar meta al modelo

  actualizar() {
    if (this.frmPoa.value.meta_alcanzar !== this.poa.meta_alcanzar) {

    this.loadingService.show();
      this.poa.meta_alcanzar = this.frmPoa.value.meta_alcanzar;
      this.poaService.actualizarmeta(this.poa.id_poa, this.poa.meta_alcanzar)
        .subscribe(response => {
          this.poa = new Poa();
          //this.loadingService.hide();
          Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
          this.listarPoas();
        },
          (error: any) => {
            console.error('Error al listar los modeloPoas:', error);
            this.loadingService.hide();

          });
    }
  }
  limpiarFormulario() {
    this.frmPoa.reset();
    this.poa = new Poa;
  }
  addMeta(poa: any) {
    this.poa = poa;
    console.log(this.poa)
    this.frmPoa = new FormGroup({
      meta_alcanzar: new FormControl(poa.meta_alcanzar),
      meta_planificada: new FormControl(poa.meta_planificada)
    });
  }
}
