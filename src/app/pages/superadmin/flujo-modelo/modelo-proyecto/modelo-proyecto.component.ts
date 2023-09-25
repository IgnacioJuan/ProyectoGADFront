import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { Exportarexcel } from 'src/app/interface/Exportarexcel';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { Proyecto } from 'src/app/models/Proyecto';
import { IndicadorService } from 'src/app/services/indicador.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
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
  dataSource = new MatTableDataSource<Exportarexcel>();
  columnasUsuario: string[] = ['codigo', 'nombre', 'objetivo', 'meta', 'poa', 'actions'];

  columnaexportar: string[] = [ 'codigo', 'nombre_objetivoods', 'nombre_objetivopnd','nombre_objetivopdot','nombre_metapdot','nombre_indicador','nombre','objetivo','meta', 'nombre_competencia'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  fechaMinima: string = "";
  fechaMax: string = "";
  selectedCodigo: string = "";
  data: any;
  constructor(
    private proyectoservice: ProyectoService,
    private indicadorservice: IndicadorService,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private fb: FormBuilder,
    private loadingService: LoadingServiceService,
    

  ) {
    this.frmProyecto = fb.group({
      nombre: ['', Validators.required],
      codigo: [''],
      objetivo: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      porcentaje_alcance: ['', [Validators.required]],
      area: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      pnd: ['', [Validators.required]],
      ods: ['', [Validators.required]],
      programa: ['', [Validators.required]],
      indicador: ['', [Validators.required]],
      competencia: ['', [Validators.required]],
      programaControl: [''],
      pndControl: [''],
      odsControl: [''],
      indicadorControl: [''],
      competenciaControl: ['']
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
    this.alimentarOptions();
  }
  ngOnInit() {
    const data = history.state.data;
    this.modelopoa = data;
    if (this.modelopoa == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.listar()
  }

   //optimizar
   listar(): void {
    this.loadingService.show();
    this.proyectoservice.getexportarexcel(this.modelopoa.id_modelo_poa).subscribe(
      
      (data: any[]) => {
        this.proyectos = data;
        this.dataSource.data = this.proyectos;
        this.loadingService.hide();

      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
        this.loadingService.hide();
      }
    );
  }


  exportarr(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('materiaModaExcel')
    );
 
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla 1');
  
    XLSX.writeFile(wb, 'Proyectos.xlsx');
  }
  
  

  exportar(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('materiaModaExcel')
    );
  
    // Obtener los datos de la tabla HTML
    const tableData = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
    // Insertar un encabezado adicional
    tableData.unshift(['Hola']); // Agrega un array con "Hola" como primer elemento
  
    // Calcular el ancho de las columnas
    const columnWidths: number[] = this.calcularAnchoColumnas(tableData);
  
    // Aplicar el ancho calculado a las columnas en la hoja de trabajo
    columnWidths.forEach((width, colIndex) => {
      if (width) {
        const colLetter = XLSX.utils.encode_col(colIndex);
        ws['!cols'] = ws['!cols'] || [];
        ws['!cols'][colIndex] = { wch: width };
      }
    });
  
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla 1');
  
    XLSX.writeFile(wb, 'Proyectos.xlsx');
  }
  
  // Función para calcular el ancho de las columnas
  private calcularAnchoColumnas(data: any[]): number[] {
    const columnWidths: number[] = [];
  
    data.forEach((rowData: any) => {
      let columnIndex = 0;
  
      for (const key in rowData) {
        if (rowData.hasOwnProperty(key)) {
          const cellValue = rowData[key];
          const cellText = cellValue ? cellValue.toString() : '';
          const cellTextLength = cellText.length;
  
          if (!columnWidths[columnIndex] || cellTextLength > columnWidths[columnIndex]) {
            columnWidths[columnIndex] = cellTextLength;
          }
  
          columnIndex++;
        }
      }
    });
  
    return columnWidths;
  }
  


  guardar() {
    this.loadingService.show();

    this.subcrite = this.frmProyecto.value;
    let a = this.frmProyecto.value;
    this.subcrite.modelopoa = this.modelopoa;
    this.subcrite.codigo = this.selectedCodigo;
    this.subcrite = {
      ...this.frmProyecto.value,
      modelopoa: this.modelopoa,
      pnd: { id_objetivo_pnd: this.frmProyecto.value.pnd },
      ods: { id_objetivo_ods: this.frmProyecto.value.ods },
      programa: { id_programa: this.frmProyecto.value.programa },
      indicador: { id_indicador: this.frmProyecto.value.indicador },
      competencia: { id_competencia: this.frmProyecto.value.competencia }
    };
    this.proyectoservice.crear(this.subcrite, this.selectedCodigo)
      .subscribe(
        (response: any) => {
          console.log('Proyecto creado con éxito:', response);
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
          this.loadingService.hide();

        }
      );

  }
  eliminar(proyecto: any) {
    this.loadingService.show();

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
 
  editDatos(proyecto: any) {
    this.subcrite = proyecto;
    this.frmProyecto = new FormGroup({
      nombre: new FormControl(proyecto.nombre),
      codigo: new FormControl(proyecto.codigo),
      objetivo: new FormControl(proyecto.objetivo),
      meta: new FormControl(proyecto.meta),
      porcentaje_alcance: new FormControl(proyecto.porcentaje_alcance),
      area: new FormControl(proyecto.area),

      fecha_inicio: new FormControl(proyecto.fecha_inicio),
      fecha_fin: new FormControl(proyecto.fecha_inicio),
      
      pnd: new FormControl(proyecto.id_objetivo_pnd),
      ods: new FormControl(proyecto.id_objetivo_ods),
      programa: new FormControl(proyecto.id_programa),
      indicador: new FormControl(proyecto.id_indicador),
      competencia: new FormControl(proyecto.id_competencia),

    });
  }

  limpiarFormulario() {
    this.frmProyecto.reset();
    this.subcrite = new Proyecto;
    this.frmProyecto.get('programa')?.setValue('');
    this.frmProyecto.get('indicador')?.setValue('');
    this.frmProyecto.get('pnd')?.setValue('');
    this.frmProyecto.get('ods')?.setValue('');
    this.frmProyecto.get('competencia')?.setValue('');

  }

  actualizar() {
    this.loadingService.show();

    this.subcrite.nombre = this.frmProyecto.value.nombre;
    this.subcrite.codigo = this.frmProyecto.value.codigo;
    this.subcrite.objetivo = this.frmProyecto.value.objetivo;
    this.subcrite.meta = this.frmProyecto.value.meta;
    this.subcrite.porcentaje_alcance = this.frmProyecto.value.porcentaje_alcance;
    this.subcrite.area = this.frmProyecto.value.area;

    this.subcrite.fecha_inicio = this.frmProyecto.value.fecha_inicio;
    this.subcrite.fecha_fin = this.frmProyecto.value.fecha_fin;

    this.subcrite = {
      ...this.subcrite,
      modelopoa: this.modelopoa,
      pnd: { id_objetivo_pnd: this.frmProyecto.value.pnd },
      ods: { id_objetivo_ods: this.frmProyecto.value.ods },
      programa: { id_programa: this.frmProyecto.value.programa },
      indicador: { id_indicador: this.frmProyecto.value.indicador },
      competencia: { id_competencia: this.frmProyecto.value.competencia }
    };
    this.subcrite.modelopoa.usuario = null;
    console.log(this.subcrite)
    this.proyectoservice.actualizar(this.subcrite.id_proyecto, this.subcrite)
      .subscribe((response: any) => {
        this.subcrite = new Proyecto();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      }, (error) => {
        console.error('Error al crear el modelo_poa:', error);
        this.loadingService.hide();

        Swal.fire(
          'Error',
          'Ha ocurrido un error',
          'warning'
        )
      });
  }

  verDetalles(proyecto: any) {
    this.router.navigate(['/sup/flujo-modelo/proyecto-poa'], { state: { proyecto: proyecto, modelo: this.modelopoa } });
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

  alimentarOptions(): void {
    this.proyectoservice.getPNDOptions().subscribe(
      (data: any[]) => {
        this.pndOptions = data;
        this.filteredPndOptions = this.pndOptions;

      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
      }
    );
    this.proyectoservice.getODSOptions().subscribe(
      (data: any[]) => {
        this.odsOptions = data;
        this.filteredodsOptions = this.odsOptions;
      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
      }
    );
    this.proyectoservice.getProgramaOptions().subscribe(
      (data: any[]) => {
        this.programaOptions = data;
        this.filteredprogramaOptions = this.programaOptions;
      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
      }
    );
    this.indicadorservice.listarIndicadoresconComponente().subscribe(
      (data: any[]) => {
        this.indicadorOptions = data;
        this.filteredindicadorOptions = this.indicadorOptions;
      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
      }
    );
    this.proyectoservice.getCompetenciaOptions().subscribe(
      (data: any[]) => {
        this.competenciaOptions = data;
        this.filteredcompetenciaOptions = this.competenciaOptions;
      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
      }
    );
  }
  filteredPndOptions: any[] = [];
  selectedPND: number | null = null;
  pndOptions: any[] = [];

  filteredodsOptions: any[] = [];
  selectedODS: number | null = null;
  odsOptions: any[] = [];


  filteredprogramaOptions: any[] = [];
  selectedPrograma: number | null = null;
  programaOptions: any[] = [];

  filteredindicadorOptions: any[] = [];
  selectedIndicador: number | null = null;
  indicadorOptions: any[] = [];

  filteredcompetenciaOptions: any[] = [];
  selectedCompetencia: number | null = null;
  competenciaOptions: any[] = [];

  filterPNDOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredPndOptions = this.pndOptions.filter(option =>
      option.nombre.toLowerCase().includes(searchTerm)
    );
  }
  onPNDSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedPND = selectedId;
  }
  filterODSOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredodsOptions = this.odsOptions.filter(option =>
      option.nombre.toLowerCase().includes(searchTerm)
    );
  }
  onODSSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedODS = selectedId;
  }
  filterProgramaOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredprogramaOptions = this.programaOptions.filter(option =>
      option.nombre.toLowerCase().includes(searchTerm)
    );
  }
  onProgramaSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedPrograma = selectedId;
  }
  filterIndicadorOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredindicadorOptions = this.indicadorOptions.filter(option =>
      option.nombre.toLowerCase().includes(searchTerm)
    );
  }
  onIndicadorSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedIndicador = selectedId;
    console.log(this.frmProyecto.value.indicador)
  }
  filterCompenteciaOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredcompetenciaOptions = this.competenciaOptions.filter(option =>
      option.nombre.toLowerCase().includes(searchTerm)
    );
  }
  onCompetenciaSelected(event: any): void {
    const selectedId = parseInt(event.target.value, 10); // Convertir el valor a número
    this.selectedCompetencia = selectedId;
  }




  isDisabledFieldsValid(): boolean {
    const pndValue = this.frmProyecto.value.pnd;
    const odsValue = this.frmProyecto.value.ods;
    const programaValue = this.frmProyecto.value.programa;
    const indicadorValue = this.frmProyecto.value.indicador;
    const competenciaValue = this.frmProyecto.value.competencia;
    console.log(this.frmProyecto.value.indicador)
    return pndValue && odsValue && programaValue && indicadorValue && competenciaValue;
  }
  sendCodigo(event: any): void {
    const selectedId = +event.target.value; // Convertir el valor a número

    const selectedOption = this.indicadorOptions.find(option => option.id_indicador === selectedId);

    if (selectedOption) {
      this.selectedCodigo = selectedOption.codigo;
    }
  }
}
