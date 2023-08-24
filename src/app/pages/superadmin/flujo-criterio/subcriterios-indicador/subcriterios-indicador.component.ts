import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Indicador } from 'src/app/models/Indicador';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { ActivatedRoute, Router } from '@angular/router';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { IndicadorEvidenciasProjection } from 'src/app/interface/IndicadorEvidenciasProjection';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Criterio } from 'src/app/models/Criterio';

@Component({
  selector: 'app-subcriterios-indicador',
  templateUrl: './subcriterios-indicador.component.html',
  styleUrls: ['./subcriterios-indicador.component.css']
})
export class SubcriteriosIndicadorComponent {
  frmIndicador: FormGroup;
  guardadoExitoso: boolean = false;
  //tabla
  itemsPerPageLabel = 'Indicadores por página';
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
  indicadors: any[] = [];
  subcriterio: Subcriterio = new Subcriterio();
  criterio: Criterio = new Criterio();

  miModal!: ElementRef;
  public indic = new Indicador();
  selectedTipo: string="";

  filterPost = '';
  dataSource = new MatTableDataSource<IndicadorEvidenciasProjection>();
  columnasUsuario: string[] = ['id_indicador', 'nombre', 'descripcion','peso', 'estandar', 'tipo', 'cantidadEvidencia', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(private indicadorservice: IndicadoresService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.frmIndicador = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
      peso: ['', Validators.required],
      estandar: [''],
      tipo: ['', Validators.required],
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
    this.subcriterio = history.state.data;
    this.criterio = history.state.criterio;
    if (this.subcriterio == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.listar()
  }

  

  guardar() {
    this.indic = this.frmIndicador.value;
    this.indic.subcriterio = this.subcriterio;
    this.indicadorservice.crear(this.indic)
      .subscribe(
        (response: any) => {
          console.log('Subcriterio creado con éxito:', response);
          this.guardadoExitoso = true;
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error: any) => {
          console.error('Error al crear el indicador:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
  eliminar(indicador: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.indicadorservice.eliminar(indicador.id_indicador, indicador).subscribe(
          (response: any) => {
            this.listar()
            Swal.fire('Eliminado!', '', 'success')
          }
        );
      }
    })
  }

  listar(): void {
    this.indicadorservice.obtenerDatosIndicadores(this.subcriterio.id_subcriterio).subscribe(
      (data: any[]) => {
        this.indicadors = data;
        this.dataSource.data=this.indicadors;
      },
      (error: any) => {
        console.error('Error al listar los indicadors:', error);
      }
    );
  }

  editDatos(indicador: Indicador) {
    this.indic = indicador;
    this.frmIndicador = new FormGroup({
      nombre: new FormControl(indicador.nombre),
      descripcion: new FormControl(indicador.descripcion),
      peso: new FormControl(indicador.peso),
      estandar: new FormControl(indicador.estandar),
      tipo: new FormControl(indicador.tipo)
    });
  }

  limpiarFormulario() {
    this.frmIndicador.reset();
    this.indic = new Indicador;
  }

  actualizar() {
    this.indic.nombre = this.frmIndicador.value.nombre;
    this.indic.descripcion = this.frmIndicador.value.descripcion;
    this.indic.estandar = this.frmIndicador.value.estandar;
    this.indic.tipo = this.frmIndicador.value.tipo;

    this.indicadorservice.actualizar(this.indic.id_indicador, this.indic)
      .subscribe((response: any) => {
        this.indic = new Indicador();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')

      });
  }
  verEvaluacion(indicador: any) {
      this.router.navigate(['/sup/flujo-criterio/evaluacion-cuantitativa'], { state: { data: indicador, criterio:this.criterio, subcriterio:this.subcriterio } });
  }
  verEvidencias(indicador: any) {
    this.router.navigate(['/sup/flujo-criterio/indicador-evidencia'], { state: { data: indicador, criterio:this.criterio, subcriterio:this.subcriterio } });
  }
  verSubcriterios() {
    this.router.navigate(['/sup/flujo-criterio/criterios-subcriterio'], { state: { data: this.criterio } });
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
      this.dataSource.data = this.indicadors;;
    }
  }

  
}
