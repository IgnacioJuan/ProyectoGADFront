import { Poa } from 'src/app/models/Poa';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PoaService } from 'src/app/services/poa.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { PoasSolicitudesProjection } from 'src/app/interface/PoasSolicitudesProjection';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-list-poa-solicitud',
  templateUrl: './list-poa-solicitud.component.html',
  styleUrls: ['./list-poa-solicitud.component.css']
})
export class ListPoaSolicitudComponent implements OnInit  {
//Listar Poas
listaPoas: Poa[] = [];
listarPoas: PoasSolicitudesProjection[] = [];

  //Usuario logueado
  user: any = null;
//Buscar
filterPost: string = "";
filteredComponentes: any[] = [];
resultadosEncontrados: boolean = true;

constructor(
  private paginatorIntl: MatPaginatorIntl,
  private router: Router,
  private poaService: PoaService,
  public login: LoginService,

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
   //Capturar usuario logueado
   this.user = this.login.getUser();
   console.log(this.user);
  this.listarPoasSolic(this.user.id);
}
dataSource = new MatTableDataSource<PoasSolicitudesProjection>();
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
columnasUsuario: string[] = [ 'nombre_proyecto','barrio', 'cobertura','comunidad', 'meta_alcanzar', 'meta_planificada','solicitudes'];



listarPoasSolic(idAdmin : number): void {
  this.loadingService.show();
 
  this.poaService.listarPoasSolicitud(idAdmin).subscribe(
    (data: any[]) => {
      this.listarPoas = data;
      console.log("Dataa")
      console.log(this.listarPoas)
      this.dataSource.data = this.listarPoas;
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

//Ir a solicitudes
verDetalles(poa: any) {
 this.router.navigate(['/adm/poas-solicitudes/listaSolicitudes'], { state: { data: poa } });
}
}
