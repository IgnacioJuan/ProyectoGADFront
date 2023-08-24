import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SubcriterioIndicadoresProjection } from 'src/app/interface/SubcriterioIndicadoresProjection';
import { Criterio } from 'src/app/models/Criterio';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criterios-subcriterio',
  templateUrl: './criterios-subcriterio.component.html',
  styleUrls: ['./criterios-subcriterio.component.css']
})
export class CriteriosSubcriterioComponent implements OnInit {
  frmSubcriterio: FormGroup;
  guardadoExitoso: boolean = false;
 //tabla
 itemsPerPageLabel = 'Subcriterios por página';
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
  criterio: Criterio = new Criterio();
  subcriterios: any[] = [];

  miModal!: ElementRef;
  public subcrite = new Subcriterio();

  filterPost = '';
  dataSource = new MatTableDataSource<SubcriterioIndicadoresProjection>();
  columnasUsuario: string[] = ['id_subcriterio', 'nombre', 'descripcion', 'cantidadIndicadores', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private subcriterioservice: SubcriteriosService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder
  ) {
    this.frmSubcriterio = fb.group({
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
  ngOnInit() {
    const data = history.state.data;
    this.criterio = data;
    console.log(this.criterio);
    if (this.criterio == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.listar()
  }

  

  guardar() {
    this.subcrite = this.frmSubcriterio.value;
    this.subcrite.criterio = this.criterio;
    this.subcriterioservice.crear(this.subcrite)
      .subscribe(
        (response: any) => {
          console.log('Criterio creado con éxito:', response);
          this.guardadoExitoso = true;
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error: any) => {
          console.error('Error al crear el subcriterio:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
  eliminar(subcriterio: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (!result.isConfirmed) {
          this.subcriterioservice.eliminar(subcriterio).subscribe(
            (response) => {
              this.listar()
              Swal.fire('Eliminado!', '', 'success')

            }
          );
      }
    })

  }
  //optimizar
  listar(): void {
    this.subcriterioservice.obtenerDatosCriterios(this.criterio.id_criterio).subscribe(
      (data: any[]) => {
        this.subcriterios = data;
        this.dataSource.data = this.subcriterios;
      },
      (error: any) => {
        console.error('Error al listar los subcriterios:', error);
      }
    );
  }

  editDatos(subcriterio: Subcriterio) {
    this.subcrite = subcriterio;
    this.frmSubcriterio = new FormGroup({
      nombre: new FormControl(subcriterio.nombre),
      descripcion: new FormControl(subcriterio.descripcion)

    });
  }

  limpiarFormulario() {
    this.frmSubcriterio.reset();
    this.subcrite = new Subcriterio;
  }

  actualizar() {
    this.subcrite.nombre = this.frmSubcriterio.value.nombre;
    this.subcrite.descripcion = this.frmSubcriterio.value.descripcion;

    this.subcriterioservice.actualizar(this.subcrite.id_subcriterio, this.subcrite)
      .subscribe((response: any) => {
        this.subcrite = new Subcriterio();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }

  verDetalles(subcriterio: any) {
    this.router.navigate(['/sup/flujo-criterio/subcriterios-indicador'], { state: { data: subcriterio, criterio: this.criterio } });
  }
  verCriterios() {
    this.router.navigate(['/sup/flujo-criterio/criterioSuper']);
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.subcriterios;;
    }
  }
}
