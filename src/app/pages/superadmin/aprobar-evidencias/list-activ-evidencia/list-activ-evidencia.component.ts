import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { ArchivoService } from 'src/app/services/archivo.service';
import { Archivos } from 'src/app/models/Archivos';
import { LoginService } from 'src/app/services/login.service';
import { Poa } from 'src/app/models/Poa';
@Component({
  selector: 'app-list-activ-evidencia',
  templateUrl: './list-activ-evidencia.component.html',
  styleUrls: ['./list-activ-evidencia.component.css']
})
export class ListActivEvidenciaComponent implements OnInit {
//Listar actividades-acrchivos-acitividad seleccionada
  public actividadSe = new ActividadesPoa();
  listaActividades: ActividadesPoa[] = [];
  listaArchivos: Archivos[] = [];
  //Usuario logueado
  user: any = null;
  isLoggedIn = false;
  //Objeto poa
  poa: Poa = new Poa();

  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private actividadService: ActividadespoaService,
    private archivoService: ArchivoService,
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
    this.dataSource2.paginator = this.paginator || null;


  }
  ngOnInit(): void {
    //Obtener id del poa
    const data = history.state.data;
    this.poa = data;
    console.log(this.poa);
    if (this.poa == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    } 
    //Capturar usuario logueado
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.listar(this.poa.id_poa);
  }
  //Tabla para listado de actividades
  dataSource = new MatTableDataSource<ActividadesPoa>();
  //Tabla para listado de archivos
  dataSource2 = new MatTableDataSource<Archivos>();

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  //tabla
  itemsPerPageLabel = 'Componentes por página';
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
//Columnas tabla actividades
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'evidencias'];

//Columnas tabla archivos
  columnasArchivos: string[] = ['id_archivo', 'nombre', 'descripcion','enlace', 'fecha'];



  listar(idPoa: number): void {
    this.actividadService.getActividadesPoa(idPoa).subscribe(
      (data: any[]) => {
        this.listaActividades = data;
        console.log("Dataa")
        console.log(this.listaActividades)
        this.dataSource.data = this.listaActividades;
      },
      (error: any) => {
        console.error('Error al listar los objetivos:', error);
      }
    );
  }



seleccionarActividad(activ: ActividadesPoa){
  this.actividadSe=activ
  this.archivoService.listarArchivosPorActividad(activ.id_actividad).subscribe(
    (data: any[]) => {
      this.listaArchivos = data;
      console.log("Dataa")
      console.log(data)
      this.dataSource2.data = this.listaArchivos;
    },
    (error: any) => {
      console.error('Error al listar los componentes:', error);
    }
  );

}




  buscar() {
    // Filtra los componentes basados en el filtro
    this.filteredComponentes = this.listaActividades.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );
  
    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource.data = this.filteredComponentes;
  
    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }


  //Ir a poas
  verPoas() {
    this.router.navigate(['/sup/aprobarEvidencias/listPoaAprobarEvidenciaSuper']);
  }
  //Ir archivos
verDetalles(acti: any) {
  this.router.navigate(['/sup/aprobarEvidencias/listPoaAprobarArchivoSuper'], { state: { data: acti } });
}

}
