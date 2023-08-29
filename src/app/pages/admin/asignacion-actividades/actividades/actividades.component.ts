import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Poa } from 'src/app/models/Poa';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit{
  frmActividad: FormGroup;
  frmActResp: FormGroup;
  guardadoExitoso: boolean = false;
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
  poa: Poa = new Poa();
  actividades: any[] = []; 
  miModal!: ElementRef;
  public actividad = new ActividadesPoa();

  filterPost = '';
  filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;

  dataSource = new MatTableDataSource<ActividadesPoa>();
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'presupuesto_referencial', 'codificado', 'ejecutado', 'saldo','actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private actividadservice: ActividadespoaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder
  ) {
    this.frmActividad = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      presupuesto_referencial: ['', Validators.required]
    });
    this.frmActResp = fb.group({
      responsable: ['', Validators.required]
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
    const data = history.state.data;
    this.poa = data;
    console.log(this.poa);
    if (this.poa == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.listar(this.poa.id_poa)
  } 

  verPoas() {
    this.router.navigate(['/adm/asignacion-actividades/poa-actividad']);
  }
  asignarResponsable() {
    this.router.navigate(['/adm/asignacion-actividades/actividad-responsable']);
  }
 
  guardar() {
    this.actividad = this.frmActividad.value;
    this.actividad.poa = this.poa;
    this.actividadservice.crear(this.actividad)
      .subscribe(
        (response) => {
          console.log('Actividad creada con éxito:', response);
          this.guardadoExitoso = true;
          this.listar(this.poa.id_poa);
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

  listar(poaId:number): void {
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

  eliminar(activ: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.actividadservice.eliminarActividad(activ).subscribe(
          (response) => {
            this.listar(this.poa.id_poa)
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

  limpiar() {
    this.frmActResp.reset();
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
