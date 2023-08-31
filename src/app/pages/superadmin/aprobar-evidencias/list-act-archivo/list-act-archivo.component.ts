import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Archivos } from 'src/app/models/Archivos';
import { ArchivoService } from 'src/app/services/archivo.service';
import { LoginService } from 'src/app/services/login.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-list-act-archivo',
  templateUrl: './list-act-archivo.component.html',
  styleUrls: ['./list-act-archivo.component.css']
})
export class ListActArchivoComponent {
  listaArchivos: Archivos[] = [];

  
  //Usuario logueado
   user: any = null;
   isLoggedIn = false;
   //Objeto actividad
   actividad: ActividadesPoa = new ActividadesPoa();
 
   //Buscar
   filterPost: string = "";
   filteredComponentes: any[] = [];
   resultadosEncontrados: boolean = true;
 
   constructor(
     private paginatorIntl: MatPaginatorIntl,
     private router: Router,
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
     this.dataSource2.paginator = this.paginator || null;
 
 
   }
  ngOnInit(): void {
    //Obtener id del poa
    const data = history.state.data;
    this.actividad = data;
    if (this.actividad == undefined) {
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
    this.listar(this.actividad.id_actividad);
  }
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
 
  columnasArchivos: string[] = ['id_archivo', 'nombre', 'descripcion','enlace', 'fecha', 'evaluar'];


  listar(activ: number){

    this.archivoService.listarArchivosPorActividad(activ).subscribe(
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
    this.filteredComponentes = this.listaArchivos.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource2.data = this.filteredComponentes;
    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }

  //Ir a poas
  verPoas() {
    this.router.navigate(['/sup/aprobarEvidencias/listPoaAprobarEvidenciaSuper']);
  }

}
