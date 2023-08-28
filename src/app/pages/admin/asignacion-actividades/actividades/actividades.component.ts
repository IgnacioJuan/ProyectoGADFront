import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { ActividadespoaService } from 'src/app/services/actividadespoa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit{
  frmActividad: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Actividades por página';
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
  //
  public actividad = new ActividadesPoa();
  actividades: any[] = [];  

  //criterios: CriterioSubcriteriosProjection[] = [];
  

  filterPost = '';
  dataSource = new MatTableDataSource<ActividadesPoa>();
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'observaciones', 'presupuesto_referencial', 'codificado', 'ejecutado', 'saldo'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private actividadservice: ActividadespoaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder
  ) {
    this.frmActividad = fb.group({
      nombre: ['', Validators.required]
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
    this.actividad = this.frmActividad.value;
    this.actividadservice.crear(this.actividad)
      .subscribe(
        (response) => {
          console.log('Actividad creada con éxito:', response);
          this.guardadoExitoso = true;
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear la actividad:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }

  listar(): void {
    this.actividadservice.getActividades().subscribe(
      (data: ActividadesPoa[]) => {
        this.actividades = data;
        this.dataSource.data = this.actividades;
      },
      (error: any) => {
        console.error('Error al listar las actividades:', error);
      }
    );
  }

  eliminar(activ: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.actividadservice.eliminarActividad(activ).subscribe(
          (response) => {
            this.listar()
            Swal.fire('Eliminado!', '', 'success')

          }
        );
      }
    })

  }

  limpiarFormulario() {
    this.frmActividad.reset();
    this.actividad = new ActividadesPoa;
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
