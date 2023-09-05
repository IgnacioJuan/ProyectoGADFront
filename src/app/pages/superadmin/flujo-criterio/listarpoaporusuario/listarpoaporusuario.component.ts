import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PoaService } from 'src/app/services/poa.service';
import { MatTableDataSource } from '@angular/material/table';
import { PoaporUsuarioProjection } from 'src/app/interface/PoaporUsuarioProjection';
import { NgStyle } from '@angular/common';


@Component({
  selector: 'app-listarpoaporusuario',
  templateUrl: './listarpoaporusuario.component.html',
  styleUrls: ['./listarpoaporusuario.component.css']
})

export class ListarporUsuarioComponent implements OnInit {
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


  public compete = new PoaporUsuarioProjection();
  competencias: PoaporUsuarioProjection[] = [];
  

  filterPost = '';
  dataSource = new MatTableDataSource<PoaporUsuarioProjection>();
  columnasUsuario: string[] = ['username', 'nombre', 'localizacion','barrio', 'estado'];



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
    this.poasservice.getporUsuario().subscribe(
      (data: any[]) => {
        this.competencias = data;
        this.dataSource.data = this.competencias;
      },
      (error: any) => {
        console.error('Error al listar los usuarios:', error);
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
    let backgroundColor = 'white'; // Color de fondo predeterminado
  
    switch (estadoLower) {
      case 'APROBADO':
        backgroundColor = 'green';
        break;
      case 'RECHAZADO':
        backgroundColor = 'yellow';
        break;
      case 'PENDIENTE':
        backgroundColor = 'red';
        break;
      default:
        break;
    }
  
    return { 'background-color': backgroundColor };
  }
  
  

}



