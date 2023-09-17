import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { PoasIndicadoresProjection } from 'src/app/interface/PoasIndicadoresProjection';
import { MetasPDOT } from 'src/app/models/MetasPDOT';
import { MetasPdotService } from 'src/app/services/metas-pdot.service';
import { PoaService } from 'src/app/services/poa.service';

@Component({
  selector: 'app-prueba-report-metas',
  templateUrl: './prueba-report-metas.component.html',
  styleUrls: ['./prueba-report-metas.component.css']
})
export class PruebaReportMetasComponent implements OnInit {
   //Buscar
   filterPost: string = "";
   filteredComponentes: any[] = [];
   resultadosEncontrados: boolean = true;
  ///////
listaPoasIndicadores: PoasIndicadoresProjection[] = [];

   constructor(
     private paginatorIntl: MatPaginatorIntl,
     private metaPDOTService: MetasPdotService,
        //importar el spinner como servicio
        private loadingService: LoadingServiceService,
        private poasService: PoaService
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
   @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  
   //tabla
   itemsPerPageLabel = 'Metas PDOT por página';
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
  dataSource = new MatTableDataSource<PoasIndicadoresProjection>();

  columnasUsuario: string[] = [ 'nombre_proyecto', 'tipo_periodo','meta_alcanzar','meta_planificada','tipo_evaluacion', 'nombre_metapdot', 'porcentaje_cumplimiento'];
   listar(): void {
    this.loadingService.show();
  
    this.poasService.listarPoasIndicadores().subscribe(
      (data: any[]) => {
        this.listaPoasIndicadores = data;
        console.log("listado")

        console.log(this.listaPoasIndicadores)
        this.dataSource.data = this.listaPoasIndicadores;
        this.loadingService.hide();
  
      },
      (error: any) => {
        console.error('Error al listar los objetivos:', error);
        this.loadingService.hide();
  
      }
    );
  }
  
  getColorClass(porcentaje: number): string {
    if (porcentaje < 70.0) {
      return 'rojo';
    } else if (porcentaje >= 70.0 && porcentaje <= 84.9) {
      return 'amarillo';
    } else {
      return 'verde';
    }
  }

  

}
