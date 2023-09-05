import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from 'express';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Poa } from 'src/app/models/Poa';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';

@Component({
  selector: 'app-lista-actividades',
  templateUrl: './lista-actividades.component.html',
  styleUrls: ['./lista-actividades.component.css']
})
export class ListaActividadesComponent {

  //tabla
  itemsPerPageLabel = 'Actividades por página';
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
  //
  poa: Poa = new Poa();
  actividades: any = [];
  miModal!: ElementRef;
  public actividad = new ActividadesPoa();

  poaId!: number;

  filterPost: string = "";
  filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;

  dataSource = new MatTableDataSource<ActividadesPoa>();
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'presupuesto_referencial', 'recursos_propios', 'codificado', 'devengado', 'estado', 'actions'];
  
  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private actividadservice: ActividadespoaService, private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder
  ) {
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
    const data = history.state.data;
    this.poa = data;
    console.log(this.poa);
    this.listar(this.poa.id_poa);
  }
  listar(poaId: number): void {
    this.dataSource.data = [];
    this.actividadservice.getActividadesPoa(poaId).subscribe(
      (data: any[]) => {
        this.actividades = data;
        this.dataSource.data = this.actividades;
      },
      (error: any) => {
        console.error('Error al listar las actividades:', error);
      }
    );
  }

  selectedActividadId!: number;
  abrirModal(actividadId: number) {
    this.selectedActividadId = actividadId;
  }
 
  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.actividades;
    }
  }
}

