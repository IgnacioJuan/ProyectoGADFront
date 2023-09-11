import { usuario } from '../../../../models/Usuario';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { Proyecto } from 'src/app/models/Proyecto';
import { IndicadorService } from 'src/app/services/indicador.service';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
  selector: 'app-listaproyecto',
  templateUrl: './listaproyecto.component.html',
  styleUrls: ['./listaproyecto.component.css']
})
export class ProyectosComponent {
  frmProyectos: FormGroup;
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
  columnasUsuario: string[] = ['id_proyecto', 'nombre', 'codigo', 'objetivo', 'meta', 'poa'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  fechaMinima: string = "";
  fechaMax: string = "";
  selectedCodigo: string = "";
  constructor(
    private proyectoservice: ProyectoService,
    private indicadorservice: IndicadorService,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.frmProyectos = fb.group({
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
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }
  ngOnInit() {
    
    this.listar()
  }



 
  //optimizar
  listar(): void {
    this.proyectoservice.getProyectos().subscribe(
      (data: any[]) => {
        this.proyectos = data;
        this.dataSource.data = this.proyectos;
      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);
      }
    );
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
  

  verDetalles(proyecto: any) {
   this.router.navigate(['/sup/flujo-criterio/listarpoausu'], { state: { proyecto: proyecto, modelo: this.modelopoa } });
  }
  verProyectos() {
  this.router.navigate(['/sup/flujo-criterio/listaproyecto']);
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

 

}