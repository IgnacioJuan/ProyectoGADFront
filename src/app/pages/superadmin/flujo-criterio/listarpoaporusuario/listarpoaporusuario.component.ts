import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PoaService } from 'src/app/services/poa.service';
import { MatTableDataSource } from '@angular/material/table';
import { PoaporUsuarioProjection } from 'src/app/interface/PoaporUsuarioProjection';
import { NgStyle } from '@angular/common';
import { Proyecto } from 'src/app/models/Proyecto';


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

  proyecto: Proyecto = new Proyecto();
  proyectos: any[] = [];


  public compete = new PoaporUsuarioProjection();
  competencias: PoaporUsuarioProjection[] = [];
  

  filterPost = '';
  dataSource = new MatTableDataSource<PoaporUsuarioProjection>();
  columnasUsuario: string[] = ['cedula','nombre_completo','username','nombre','nombrepro', 'estado'];



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
    
    this.compete = history.state.proyecto;
    if (this.compete == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }

    this.compete.id_proyecto

    console.log(this.compete.id_proyecto)

    this.listar( );
  }

 
  listar(): void {
    this.poasservice.getporUsuario(this.compete.id_proyecto ).subscribe(
      (data: any[]) => {
        this.competencias = data;
        this.dataSource.data = this.competencias;
      },
      (error: any) => {
        console.error('Error al listar los usuarios:', error);
      }
    );
  }


  

     verProyectos() {
    this.router.navigate(['/sup/flujo-criterio/listaproyecto'], { state: { data: this.proyecto } });
  }
  verModelos() {
    this.router.navigate(['/sup/flujo-criterio/listaproyecto']);
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
    const estadoUpper = estado.toUpperCase(); // Convertir el estado a mayúsculas
    let backgroundColor = 'white'; // Color de fondo predeterminado
  
    switch (estadoUpper) {
      case 'APROBADO':
        backgroundColor = 'rgb(168, 216, 159)';
        break;
      case 'RECHAZADO':
        backgroundColor = 'rgb(231, 87, 87)';
        break;
      case 'PENDIENTE':
        backgroundColor = 'rgb(235, 253, 133)';
        break;
      default:
        break;
    }


  
    return { 'background-color': backgroundColor };
  }
  
  
  

}



