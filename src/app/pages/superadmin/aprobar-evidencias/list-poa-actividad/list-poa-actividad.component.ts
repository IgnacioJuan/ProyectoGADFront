import { Poa } from 'src/app/models/Poa';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PoaService } from 'src/app/services/poa.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
@Component({
  selector: 'app-list-poa-actividad',
  templateUrl: './list-poa-actividad.component.html',
  styleUrls: ['./list-poa-actividad.component.css']
})
export class ListPoaActividadComponent  implements OnInit {
//Listar Poas
  listaPoas: Poa[] = [];
 //Buscar
 filterPost: string = "";
 filteredComponentes: any[] = [];
 resultadosEncontrados: boolean = true;

 constructor(
   private paginatorIntl: MatPaginatorIntl,
   private router: Router,
   private poaService: PoaService,
      //importar el spinner como servicio
      private loadingService: LoadingServiceService
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
   this.listar();
 }
 dataSource = new MatTableDataSource<Poa>();
 @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

 //tabla
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
//Columnas Tabla
 columnasUsuario: string[] = [ 'proyecto','meta_planificada', 'periodo','evidencias'];

 listar(): void {
  this.loadingService.show();

  this.poaService.obtenerDatosPoas().subscribe(
    (data: any[]) => {
      this.listaPoas = data;
      console.log("Dataa")
      console.log(this.listaPoas)
      this.dataSource.data = this.listaPoas;
      this.loadingService.hide();

    },
    (error: any) => {
      console.error('Error al listar los poas:', error);
      this.loadingService.hide();

    }
  );
}

 buscar() {
  // Filtra los componentes basados en el filtro
  this.filteredComponentes = this.listaPoas.filter((componente) =>
    componente.localizacion.toLowerCase().includes(this.filterPost.toLowerCase())
  );

  // Actualiza los datos del dataSource con los resultados filtrados
  this.dataSource.data = this.filteredComponentes;

  // Verifica si se encontraron resultados
  this.resultadosEncontrados = this.filteredComponentes.length > 0;
}

//Ir a actividades
verDetalles(poa: any) {
  this.router.navigate(['/sup/aprobarEvidencias/listActividadAprobar'], { state: { data: poa } });
}

}
