import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Competencia } from 'src/app/models/Competencia';
import { CompetenciaService } from 'src/app/services/competencia.service';

@Component({
  selector: 'app-crear-competencia',
  templateUrl: './crear-competencia.component.html',
  styleUrls: ['./crear-competencia.component.css']
})
export class CrearcompetenciaComponent implements OnInit {
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


  public compete = new Competencia();
  competencias: Competencia[] = [];
  

  filterPost = '';
  dataSource = new MatTableDataSource<Competencia>();
  columnasUsuario: string[] = ['id_competencia', 'nombre', 'descripcion', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private competenciasservice: CompetenciaService,private paginatorIntl: MatPaginatorIntl,
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
    this.listar();

  }

  guardar() {
    this.compete = this.frmCriterio.value;
    this.competenciasservice.crearCompetencia(this.compete)
      .subscribe(
        (response) => {
          console.log('Competencia COOTAD creada con éxito:', response);
          this.guardadoExitoso = true;
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear la competencis COOTAD:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
    eliminar(id: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.competenciasservice.eliminarLogicoCompetencia(id).subscribe(
          (response) => {
            this.listar()
            Swal.fire('Eliminado!', '', 'success')

          }
        );
      }
    })

  }

  listar(): void {
    this.competenciasservice.obtenerListaCompetencias().subscribe(
      (data: any[]) => {
        this.competencias = data;
        this.dataSource.data = this.competencias;
      },
      (error: any) => {
        console.error('Error al listar las comptencias COOTAD:', error);
      }
    );
  }

  editDatos(pro: Competencia) {
    this.compete = pro;
    this.frmCriterio = new FormGroup({
      nombre: new FormControl(pro.nombre),
      descripcion: new FormControl(pro.descripcion)

    });
  }

  limpiarFormulario() {
    this.frmCriterio.reset();
    this.compete = new Competencia;
  }

  actualizar() {
    this.compete.nombre = this.frmCriterio.value.nombre;
    this.compete.descripcion = this.frmCriterio.value.descripcion;
    this.competenciasservice.actualizarCompetencia(this.compete.id_competencia, this.compete)
      .subscribe(response => {
        this.compete = new Competencia();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
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

}

