import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Poa } from 'src/app/models/Poa';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { PresupuestoExterno } from 'src/app/models/PresupuestoExterno';
import { ReformaSuplemento } from 'src/app/models/ReformaSuplemento';
import { ReformaTraspasoI } from 'src/app/models/ReformaTraspasoI';
import { ReformaTraspasoD } from 'src/app/models/ReformaTraspasoD';
import { PresupuestoExternoService } from 'src/app/services/presupuestoexterno.service';
import { ReformaSuplementoService } from 'src/app/services/reformasuplemento.service';
import { ReformaTraspasoIService } from 'src/app/services/reformatraspaso-i.service';
import { ReformaTraspasoDService } from 'src/app/services/reformatraspaso-d.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ListaActividadesComponent implements OnInit {
  frmPE: FormGroup;
  frmRS: FormGroup;
  frmRTI: FormGroup;
  frmRTD: FormGroup;
  guardadoExitoso1: boolean = false;
  guardadoExitoso2: boolean = false;
  guardadoExitoso3: boolean = false;
  guardadoExitoso4: boolean = false;
  mostrarTabla1: boolean = false;
  mostrarTabla2: boolean = false;
  mostrarTabla3: boolean = false;
  mostrarTabla4: boolean = false;

  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  searchTerm3: string = '';
  searchTerm4: string = '';
  showHint!: boolean;
  nombreActividad: string = '';
  listaPE!: PresupuestoExterno[];
  listaRS!: ReformaSuplemento[];
  listaRTI!: ReformaTraspasoI[];
  listaRTD!: ReformaTraspasoD[];
  spans: any[] = [];
  spans2: any[] = [];
  spans3: any[] = [];
  spans4: any[] = [];
  act!: ActividadesPoa[];
  

  //tabla
  itemsPerPageLabel = 'Items por página';
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
  poa: Poa = new Poa();
  actividades: any = [];
  miModal!: ElementRef;
  ocultarID: boolean = false;
  public actividad = new ActividadesPoa();

  public presupuestoexterno = new PresupuestoExterno();
  listaPEActividades: PresupuestoExterno[] = [];

  public reformasuplemento = new ReformaSuplemento();
  listaRSActividades: ReformaSuplemento[] = [];

  public rtincremento = new ReformaTraspasoI();
  listaRTIActividades: ReformaTraspasoI[] = [];

  public rtdecremento = new ReformaTraspasoD();
  listaRTDActividades: ReformaTraspasoD[] = [];

  poaId!: number;

  filterPost: string = "";
  resultadosEncontrados: boolean = true;

  dataSource = new MatTableDataSource<ActividadesPoa>(this.act);
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'presupuesto_referencial', 'recursos_propios', 'codificado', 'devengado','totalpresupuestoEterno','totalreformaSuplemento','totalreformaTIncremento','totalreformaTDecremento', 'actions'];

  //LISTAR LOS 4 TIPOS DE PRESUPUESTOS
 // dataSourcePE = new MatTableDataSource<PresupuestoExterno>();
  columnasPE: string[] = ['id_presupuesto_externo', 'nombre_institucion', 'valor', 'fecha','observacion'];
  //dataSourceRS = new MatTableDataSource<ReformaSuplemento>();
  columnasRS: string[] = ['id_ref_suplemento', 'valor', 'fecha'];
//dataSourceRTI = new MatTableDataSource<ReformaTraspasoI>();
  columnasRTI: string[] = ['id_reftras_i', 'valor', 'fecha'];
 // dataSourceRTD = new MatTableDataSource<ReformaTraspasoD>();
  columnasRTD: string[] = ['id_reftras_d', 'valor', 'fecha'];
  
  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private actividadservice: ActividadespoaService, private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder, private userService: UsuarioService,private loadingService: LoadingServiceService,
    private pexternoservice: PresupuestoExternoService, private rsuplementoservice: ReformaSuplementoService,
    private rtincrementoservice: ReformaTraspasoIService, private rtdecrementoservice: ReformaTraspasoDService
  ) {
    this.loadingService.show();
    this.frmPE = fb.group({
      nombre_institucion: ['', [Validators.required, this.noCaracteresEspecialesValidator()]],
      valor: ['', Validators.required],
      observacion: ['', [this.noCaracteresEspecialesValidator1()]],
      fecha: ['', Validators.required]
    });
    this.frmRS = fb.group({
      valor: ['', Validators.required],
      fecha: ['', Validators.required]
    });
    this.frmRTI = fb.group({
      valor: ['', Validators.required],
      fecha: ['', Validators.required]
    });
    this.frmRTD = fb.group({
      valor: ['', Validators.required],
      fecha: ['', Validators.required]
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
  ngOnInit(): void {
    const data = history.state.data;
    this.poa = data;
    console.log(this.poa);
    this.listar(this.poa.id_poa);
    this.actividadservice.obtenerActividades().subscribe((data: ActividadesPoa[]) => {
      this.act = data;
    });
  }

  // VALIDACIONES
  validarFechas(): void {
    /*const fechaElegida = this.frmPE.get('fecha')?.value as string;
    const fechaActual = new Date();
    const fechaElegidaDate = new Date(fechaElegida);
    
    if (fechaElegidaDate < fechaActual) {
      this.frmPE.get('fecha')?.setErrors({ fechaAnterior: true });
    } else {
      this.frmPE.get('fecha')?.setErrors(null);
    }*/
  }
  noCaracteresEspecialesValidator1() {
    return (control: any) => {
      const pattern = /^[a-zA-Z0-9\s]*$/;
      if (!control.value) {
        return null;
      } else if (!pattern.test(control.value)) {
        return { caracteresEspeciales: true };
      }
      return null;
    };
  }
  noCaracteresEspecialesValidator() {
    return (control: any) => {
      const pattern = /^[a-zA-Z0-9\s]*$/;
      if (!control.value) {
        return { required: true }; // Retorna error si está vacío
      } else if (!pattern.test(control.value)) {
        return { caracteresEspeciales: true }; // Retorna error si contiene caracteres especiales
      }
      return null;
    };
  }

  formatNumber(value: number): string {
    return value.toFixed(2);
  }

  //PETICIONES | RUTAS
  verPoas() {
    this.router.navigate(['/sup/actividades-presupuestos/tabla-poas']);
  }

  listar(poaId: number): void {
    this.dataSource.data = [];
    this.actividadservice.getActividadesPoa2(poaId).subscribe(
      (data: any[]) => {
        this.actividades = data;
        this.dataSource.data = this.actividades;
        this.loadingService.hide();
      },
      (error: any) => {
        console.error('Error al listar las actividades:', error);
        this.loadingService.hide();
      }
    );
  }

  selectedActividadId!: number;
  abrirModal(actividadId: number) {
    this.selectedActividadId = actividadId;
  }
  
  guardarPE() {
    this.loadingService.show();
    this.presupuestoexterno = this.frmPE.value;
    this.presupuestoexterno.actividad = new ActividadesPoa();
    this.presupuestoexterno.actividad.id_actividad = this.selectedActividadId;
  
    this.pexternoservice.crear(this.presupuestoexterno)
      .subscribe(
        (response) => {
          console.log('Presupuesto Externo creado con éxito: ', response);
          this.guardadoExitoso1 = true;
          this.listar(this.poa.id_poa);
          this.loadingService.hide();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          );
        },
        (error) => {
          console.error('Error al crear la actividad: ', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          );
        }
      );
  }
  //Guardar Reforma Suplemento a Actividad
  guardarRS() {
    this.loadingService.show();
    this.reformasuplemento = this.frmRS.value;
    this.reformasuplemento.actividad = new ActividadesPoa();
    this.reformasuplemento.actividad.id_actividad = this.selectedActividadId;
    this.rsuplementoservice.crear(this.reformasuplemento)
      .subscribe(
        (response) => {
          console.log('Reforma Suplemento agregada con éxito: ', response);
          this.guardadoExitoso2 = true;
          this.listar(this.poa.id_poa);
          this.loadingService.hide();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al agregar reforma suplemento: ', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
  }
  //Guardar Reforma Traspaso Incremento a Actividad
  guardarRTI() {
    this.loadingService.show();
    this.rtincremento = this.frmRTI.value;
    this.rtincremento.actividad = new ActividadesPoa();
    this.rtincremento.actividad.id_actividad = this.selectedActividadId;
    this.rtincrementoservice.crear(this.rtincremento)
      .subscribe(
        (response) => {
          console.log('Reforma Traspaso Incremento agregada con éxito: ', response);
          this.guardadoExitoso3 = true;
          this.loadingService.hide();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
          this.listar(this.poa.id_poa);
        },
        (error) => {
          console.error('Error al agregar Reforma Traspaso Incremento; ', error);
          this.loadingService.hide();
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
  }

  //Guardar Reforma Traspaso Decremento a Actividad
  guardarRTD() {
    this.loadingService.show();
    this.rtdecremento = this.frmRTD.value;
    this.rtdecremento.actividad = new ActividadesPoa();
    this.rtdecremento.actividad.id_actividad = this.selectedActividadId;
    
    this.rtdecrementoservice.crear(this.rtdecremento)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            Swal.fire(
              'Error',
              'No puede ingresar un decremento mayor al monto actual de la actividad',
              'error'
            );
          } else {
            console.error('Error al agregar Reforma Traspaso Decremento: ', error);
            Swal.fire(
              'Error',
              'Ha ocurrido un error',
              'warning'
            );
          }
          return [];
        })
      )
      .subscribe(
        (response) => {
          console.log('Reforma Traspaso Decremento agregada con éxito: ', response);
          this.guardadoExitoso4 = true;
          this.loadingService.hide();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con éxito',
            'success'
          );
          this.listar(this.poa.id_poa);
        },
        (error) => {
          console.error('Error al agregar Reforma Traspaso Decremento: ', error);
          this.loadingService.hide();
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          );
        }
      );
    this.loadingService.hide();
  }
  limpiarFormulario1() {
    this.frmPE.reset();
    this.actividad = new ActividadesPoa;
  }

  limpiarFormulario2() {
    this.frmRS.reset();
    this.actividad = new ActividadesPoa;
  }
  limpiarFormulario3() {
    this.frmRTI.reset();
    this.actividad = new ActividadesPoa;
  }
  limpiarFormulario4() {
    this.frmRTD.reset();
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

  //PROCESOS PARA LISTAR PRESUPUESTOS DE UNA ACTIVIDAD
  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }
  getRowSpan2(col: any, index: any) {
    return this.spans2[index] && this.spans2[index][col];
  }
  getRowSpan3(col: any, index: any) {
    return this.spans3[index] && this.spans3[index][col];
  }
  getRowSpan4(col: any, index: any) {
    return this.spans4[index] && this.spans4[index][col];
  }
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaPE.length;) {
      let currentValue = accessor(this.listaPE[i]);
      let count = 1;

      for (let j = i + 1; j < this.listaPE.length; j++) {
        if (currentValue !== accessor(this.listaPE[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
  
      this.spans[i][key] = count;
      i += count;
    }
  }
  cacheSpan2(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaRS.length;) {
      let currentValue = accessor(this.listaRS[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.listaRS.length; j++) {
        if (currentValue !== accessor(this.listaRS[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans2[i]) {
        this.spans2[i] = {};
      }
  
      this.spans2[i][key] = count;
      i += count;
    }
  }
  cacheSpan3(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaRTI.length;) {
      let currentValue = accessor(this.listaRTI[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.listaRTI.length; j++) {
        if (currentValue !== accessor(this.listaRTI[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans3[i]) {
        this.spans3[i] = {};
      }
  
      this.spans3[i][key] = count;
      i += count;
    }
  }
  cacheSpan4(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaRTD.length;) {
      let currentValue = accessor(this.listaRTD[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.listaRTD.length; j++) {
        if (currentValue !== accessor(this.listaRTD[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans4[i]) {
        this.spans4[i] = {};
      }
  
      this.spans4[i][key] = count;
      i += count;
    }
  }

  clicEnActividad(actividad: ActividadesPoa) {
    this.actividad = actividad; 
    this.cargarTabla(actividad.id_actividad);
  }

  cargarTabla(actividadId: number) {
    console.log(this.actividad);
    this.nombreActividad= this.act.find(m => m.id_actividad === actividadId)?.nombre || '';
    console.log('Cargando tabla para el id_actividad', actividadId);
    this.pexternoservice.listarPEActividades(actividadId).subscribe((data:PresupuestoExterno[])=>{
      this.listaPE=data;
      console.log("PRESUPUESTOS EXTERNOS ", JSON.stringify(this.listaPE))
      this.cacheSpan('id_presupuesto_externo', (d) => d.id_presupuesto_externo);
      this.cacheSpan('nombre_institucion', (d) => d.id_presupuesto_externo + d.nombre_institucion);
      this.cacheSpan('valor', (d) => d.id_presupuesto_externo + d.nombre_institucion + d.valor);
      this.cacheSpan('fecha', (d) => d.id_presupuesto_externo + d.nombre_institucion + d.valor + d.fecha);
      this.cacheSpan('observacion', (d) => d.id_presupuesto_externo + d.nombre_institucion + d.valor + d.fecha + d.observacion);
    });
    this.rsuplementoservice.listarRSActividades(actividadId).subscribe((data:ReformaSuplemento[])=>{
      this.listaRS=data;
      console.log("REFORMAS SUPLEMENTOS ", JSON.stringify(this.listaRS))
      this.cacheSpan2('id_ref_suplemento', (d) => d.id_ref_suplemento);
      this.cacheSpan2('valor', (d) => d.id_ref_suplemento + d.valor);
      this.cacheSpan2('fecha', (d) => d.id_ref_suplemento + d.valor + d.fecha);
    });
    this.rtincrementoservice.listarRTIActividades(actividadId).subscribe((data:ReformaTraspasoI[])=>{
      this.listaRTI=data;
      console.log("RTINCREMENTOS ", JSON.stringify(this.listaRTI))
      this.cacheSpan3('id_reftras_i', (d) => d.id_reftras_i);
      this.cacheSpan3('valor', (d) => d.id_reftras_i + d.valor);
      this.cacheSpan3('fecha', (d) => d.id_reftras_i + d.valor + d.fecha);
    });
    this.rtdecrementoservice.listarRTDActividades(actividadId).subscribe((data:ReformaTraspasoD[])=>{
      this.listaRTD=data;
      console.log("RTDECREMENTOS ", JSON.stringify(this.listaRTD))
      this.cacheSpan4('id_reftras_d', (d) => d.id_reftras_d);
      this.cacheSpan4('valor', (d) => d.id_reftras_d + d.valor);
      this.cacheSpan4('fecha', (d) => d.id_reftras_d + d.valor + d.fecha);
    });
  }
}
