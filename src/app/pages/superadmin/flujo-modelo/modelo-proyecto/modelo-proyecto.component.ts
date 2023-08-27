import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { Proyecto } from 'src/app/models/Proyecto';
import { ProyectoService } from 'src/app/services/proyecto.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modelo-proyecto',
  templateUrl: './modelo-proyecto.component.html',
  styleUrls: ['./modelo-proyecto.component.css']
})
export class ModeloProyectoComponent {
  frmProyecto: FormGroup;
  guardadoExitoso: boolean = false;
  //tabla
  itemsPerPageLabel = 'Proyectos por página';
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
  modelopoa: ModeloPoa = new ModeloPoa();
  proyectos: any[] = [];

  miModal!: ElementRef;
  public subcrite = new Proyecto();

  filterPost = '';
  dataSource = new MatTableDataSource<Proyecto>();
  columnasUsuario: string[] = ['id_proyecto', 'nombre', 'codigo', 'objetivo', 'meta', 'poa', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  fechaMinima: string = "";
  fechaMax: string = "";
  constructor(
    private proyectoservice: ProyectoService, private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder
  ) {
    this.frmProyecto = fb.group({
      nombre: ['', Validators.required],
      codigo: ['', [Validators.required]],
      objetivo: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      porcentaje_alcance: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      pnd: [{ value: '' }, [Validators.required]],
      ods: [{ value: '' }, [Validators.required]],
      programa: [{ value: '' }, [Validators.required]],
      indicador: [{ value: '' }, [Validators.required]],
      competencia: [{ value: '' }, [Validators.required]],

    });
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
  ngOnInit() {
    const data = history.state.data;
    this.modelopoa = data;
    console.log(this.modelopoa);
    if (this.modelopoa == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.listar()
  }



  guardar() {
    this.subcrite = this.frmProyecto.value;
    let a = this.frmProyecto.value;
    this.subcrite.modelopoa = this.modelopoa;
    this.subcrite = {
      ...this.frmProyecto.value,
      modelopoa: this.modelopoa,
      pnd: { id_objetivo_pnd: this.frmProyecto.value.pnd },
      ods: { id_objetivo_ods: this.frmProyecto.value.ods },
      programa: { id_programa: this.frmProyecto.value.programa },
      indicador: { id_indicador: this.frmProyecto.value.indicador },
      competencia: { id_competencia: this.frmProyecto.value.competencia }
    };
    console.log(this.subcrite);
    this.proyectoservice.crear(this.subcrite)
      .subscribe(
        (response: any) => {
          console.log('ModeloPoa creado con éxito:', response);
          this.guardadoExitoso = true;
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error: any) => {
          console.error('Error al crear el proyecto:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
  eliminar(proyecto: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.proyectoservice.eliminar(proyecto).subscribe(
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
    this.proyectoservice.getProyectosdelModelo(this.modelopoa.id_modelo_poa).subscribe(
      (data: any[]) => {
        this.proyectos = data;
        this.dataSource.data = this.proyectos;
      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
      }
    );
  }

  editDatos(proyecto: Proyecto) {
    this.subcrite = proyecto;
    this.frmProyecto = new FormGroup({
      nombre: new FormControl(proyecto.nombre),
      codigo: new FormControl(proyecto.codigo),
      objetivo: new FormControl(proyecto.objetivo),
      meta: new FormControl(proyecto.meta),
      porcentaje_alcance: new FormControl(proyecto.porcentaje_alcance),
      fecha_inicio: new FormControl(proyecto.fecha_inicio),
      pnd: new FormControl(proyecto.pnd.id_objetivo_pnd),
      ods: new FormControl(proyecto.ods.id_objetivo_ods),
      programa: new FormControl(proyecto.programa.id_programa),
      indicador: new FormControl(proyecto.indicador.id_indicador),
      competencia: new FormControl(proyecto.competencia.id_competencia),

    });
  }

  limpiarFormulario() {
    this.frmProyecto.reset();
    this.subcrite = new Proyecto;
    this.selectedPND = null;
    this.selectedODS = null;
    this.selectedPrograma = null;
    this.selectedIndicador = null;
    this.selectedCompetencia = null;
  }

  actualizar() {
    this.subcrite.nombre = this.frmProyecto.value.nombre;
    this.subcrite.codigo = this.frmProyecto.value.codigo;
    this.subcrite.objetivo = this.frmProyecto.value.objetivo;
    this.subcrite.meta = this.frmProyecto.value.meta;
    this.subcrite.porcentaje_alcance = this.frmProyecto.value.porcentaje_alcance;
    this.subcrite.fecha_inicio = this.frmProyecto.value.fecha_inicio;
    this.subcrite.pnd.id_objetivo_pnd = this.frmProyecto.value.id_objetivo_pnd;
    this.subcrite.ods.id_objetivo_ods = this.frmProyecto.value.id_objetivo_ods;
    this.subcrite.programa.id_programa = this.frmProyecto.value.id_programa;
    this.subcrite.indicador.id_indicador = this.frmProyecto.value.id_indicador;
    this.subcrite.competencia.id_competencia = this.frmProyecto.value.id_competencia;

    this.proyectoservice.actualizar(this.subcrite.id_proyecto, this.subcrite)
      .subscribe((response: any) => {
        this.subcrite = new Proyecto();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }

  verDetalles(proyecto: any) {
    this.router.navigate(['/sup/flujo-modelo/proyecto-poa'], { state: { data: proyecto, criterio: this.modelopoa } });
  }
  verModeloPoas() {
    this.router.navigate(['/sup/flujo-modelo/modelo']);
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.proyectos;;
    }
  }

  validarFechas(): void {
    // const fechaInicio = this.frmModeloPoa.get('fecha_inicial')?.value as string;
    // const fechaFin = this.frmModeloPoa.get('fecha_final')?.value as string;

    // if (fechaInicio && fechaFin) {
    //   const dateInicio = new Date(fechaInicio);
    //   const dateFin = new Date(fechaFin);

    //   if (dateFin < dateInicio) {
    //     this.frmModeloPoa.setErrors({ fechasInvalidas: true });
    //   } else {
    //     this.frmModeloPoa.setErrors(null);
    //   }
    // }
  }
  selectedPND: number | null = null; // El valor seleccionado se almacenará aquí
  pndOptions: any[] = [
    { id: 1, nombre: 'Opción 1' },
    { id: 2, nombre: 'Opción 2' },
    { id: 3, nombre: 'Opción 3' }
  ];
  onPNDSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedPND = selectedId;
  }

  selectedODS: number | null = null; // El valor seleccionado se almacenará aquí
  odsOptions: any[] = [
    { id: 1, nombre: 'Opción 1' },
    { id: 2, nombre: 'Opción 2' },
    { id: 3, nombre: 'Opción 3' }
  ];
  onODSSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedODS = selectedId;
  }

  selectedPrograma: number | null = null; // El valor seleccionado se almacenará aquí
  programaOptions: any[] = [
    { id: 1, nombre: 'Opción 1' },
    { id: 2, nombre: 'Opción 2' },
    { id: 3, nombre: 'Opción 3' }
  ];
  onProgramaSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedPrograma = selectedId;
  }

  selectedIndicador: number | null = null; // El valor seleccionado se almacenará aquí
  indicadorOptions: any[] = [
    { id: 1, nombre: 'Opción 1' },
    { id: 2, nombre: 'Opción 2' },
    { id: 3, nombre: 'Opción 3' }
  ];
  onIndicadorSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedIndicador = selectedId;
  }

  selectedCompetencia: number | null = null; // El valor seleccionado se almacenará aquí
  competenciaOptions: any[] = [
    { id: 1, nombre: 'Opción 1' },
    { id: 2, nombre: 'Opción 2' },
    { id: 3, nombre: 'Opción 3' }
  ];
  onCompetenciaSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedCompetencia = selectedId;
  }

  isDisabledFieldsValid(): boolean {
    const pndValue = this.frmProyecto.get('pnd')?.value;
    const odsValue = this.frmProyecto.get('ods')?.value;
    const programaValue = this.frmProyecto.get('programa')?.value;
    const indicadorValue = this.frmProyecto.get('indicador')?.value;
    const competenciaValue = this.frmProyecto.get('competencia')?.value;

    return pndValue && odsValue && programaValue && indicadorValue && competenciaValue;
  }
}
