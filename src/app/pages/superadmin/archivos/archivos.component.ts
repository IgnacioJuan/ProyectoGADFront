import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ArchivosRechazados } from 'src/app/models/ArchivosRechazados';
import { ArchivosrechazadosService } from 'src/app/services/archivosrechazados.service';


@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosRechazadosComponent implements OnInit {
  miModal!: ElementRef;
  public evi = new ArchivosRechazados();
  archivos: any[] = [];

  //tabla
  itemsPerPageLabel = 'Evidencias por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
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

  filterPost = '';
  dataSource = new MatTableDataSource<ArchivosRechazados>();

  columnasUsuario: string[] = ['id', 'nombre', 'descripcion', 'fecha', 'nombreactividad', 'acciones'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;



  constructor(private archivosrechazadosservice: ArchivosrechazadosService,
    private paginatorIntl: MatPaginatorIntl, private router: Router
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }


  abrirArchivo() {
    
    const nuevaPaginaURL = 'https://scielo.conicyt.cl/pdf/rchnut/v44n2/art06.pdf'; // URL de la página externa
    window.open(nuevaPaginaURL, '_blank');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {
    this.listar()
  }

  listar(): void {
    this.archivosrechazadosservice.get().subscribe(
      (data: any[]) => {
        this.archivos = data;
        this.dataSource.data = this.archivos;
      },
      (error: any) => {
        console.error('Error al listar las evidencias:', error);
      }
    );
  }
  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.archivos;;
    }
  }




}