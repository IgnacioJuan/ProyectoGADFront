import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PoaService } from 'src/app/services/poa.service';
import { Poa } from 'src/app/models/Poa';
import { MatTableDataSource } from '@angular/material/table';
import { log, number } from 'mathjs';
import { PoaNoAprobadoProjection } from 'src/app/interface/PoaNoAprobadoProjection';

@Component({
  selector: 'app-crear-competencia',
  templateUrl: './listarpoa.component.html',
  styleUrls: ['./listarpoa.component.css']
})

export class ListarpoaComponent implements OnInit {
  frmCriterio: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Competencias por página';
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


  public compete = new PoaNoAprobadoProjection();
  competencias: PoaNoAprobadoProjection[] = [];
  

  filterPost = '';
  dataSource = new MatTableDataSource<PoaNoAprobadoProjection>();
  columnasUsuario: string[] = ['id_poa', 'nombre','fecha_inicio', 'localizacion','barrio','comunidad', 'estado','observacion'];



  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private poasservice: PoaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder
  ) {
    this.frmCriterio = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]]
    });
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

    this.listar( );
  }


  listar(): void {
    this.poasservice.getNoAprobados().subscribe(
      (data: any[]) => {
        this.competencias = data;
        this.dataSource.data = this.competencias;
      },
      (error: any) => {
        console.error('Error al listar los programas:', error);
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
      this.dataSource.data = this.competencias;;
    }
  } 
  
  

  getColor(estado: string): any {
    const estadoLower = estado.toLowerCase(); // Convertir el estado a minúsculas
    let backgroundColor = estadoLower !== 'APROBADO' ? 'red' : 'white'; // Color de fondo rojo si no es "aprobado"
  
    return { 'background-color': backgroundColor };
  }
  

}

