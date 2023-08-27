import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CriterioSubcriteriosProjection } from 'src/app/interface/CriterioSubcriteriosProjection';
import { Componentes } from 'src/app/models/Componentes';
import { Criterio } from 'src/app/models/Criterio';
import { ComponentesService } from 'src/app/services/componentes.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { ObjetivoPdotService } from 'src/app/services/objetivo-pdot.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componentes',
  templateUrl: './componentes.component.html',
  styleUrls: ['./componentes.component.css']
})
export class ComponentesComponent  implements OnInit {
  formComponentes: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Componentes por página';
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
  public crite = new Criterio();
  public componentes = new Componentes();

  criterios: CriterioSubcriteriosProjection[] = [];
  listaComponentes: Componentes[] = [];

numeroObjetivos:number=0;
  filterPost = '';
  //dataSource = new MatTableDataSource<CriterioSubcriteriosProjection>();
  dataSource = new MatTableDataSource<Componentes>();
  //dataSource3 = new MatTableDataSource<Componentes>();

  columnasUsuario: string[] = ['id_componente', 'codigo', 'nombre', 'descripcion', 'cantidadObjetivoPDOT', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private criterioservice: CriteriosService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private componentesService: ComponentesService,
    private objetivoPDOTService: ObjetivoPdotService
  ) {
    this.formComponentes = fb.group({
      codigo: ['', Validators.required],
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
    this.componentes = this.formComponentes.value;
    this.componentesService.crear(this.componentes)
      .subscribe(
        (response) => {
          console.log('Componente creado con éxito:', response);
          this.guardadoExitoso = true;
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear el Componente:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
  eliminar(componente: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.componentesService.eliminar(componente).subscribe(
          (response) => {
            this.listar()
            Swal.fire('Eliminado!', '', 'success')

          }
        );
      }
    })

  }

  listar(): void {
    this.componentesService.listar().subscribe(
      (data: any[]) => {
        this.listaComponentes = data;
        this.dataSource.data = this.listaComponentes;
      },
      (error: any) => {
        console.error('Error al listar los componentes:', error);
      }
    );
  }
  /*listarObjetivos(idComponente: number): void {
    this.objetivoPDOTService.listarObjetivosPdotsPorIdComponente(idComponente).subscribe(
      (data: any) => {
        this.numeroObjetivos = data.length; // Asigna el número de registros obtenidos
      },
      (error: any) => {
        console.error('Error al listar los objetivos:', error);
      }
    );
  }*/
  editDatos(componente: Componentes) {
   this.componentes = componente;
    this.formComponentes = new FormGroup({
      codigo: new FormControl(componente.codigo),
      nombre: new FormControl(componente.nombre),
      descripcion: new FormControl(componente.descripcion)

    });
  }

  limpiarFormulario() {
   this.formComponentes.reset();
    this.componentes = new Componentes();
  }

  actualizar() {
    this.componentes.codigo = this.formComponentes.value.codigo;
   this.componentes.nombre = this.formComponentes.value.nombre;
    this.componentes.descripcion = this.formComponentes.value.descripcion;
    this.componentesService.actualizar(this.componentes.id_componente, this.componentes)
      .subscribe(response => {
        this.componentes = new Componentes();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }

  verDetalles(componente: any) {
    this.router.navigate(['/sup/flujo_Componentes/componente_objetivoPDOT'], { state: { data: componente } });
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
     // this.dataSource.data = this.criterios;;
    }
  }
}
