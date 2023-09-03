import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { MatSelectChange } from '@angular/material/select';

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
  

  //tabla
  itemsPerPageLabel = 'Actividades por página';
  itemsPerPageLabel2 = 'Presupuesto Externo por página';
  itemsPerPageLabel3 = 'R.Suplemento por página';
  itemsPerPageLabel4 = 'R.T.Incremento por página';
  itemsPerPageLabel5 = 'R.T.Decremento por página';
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
  filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;

  dataSource = new MatTableDataSource<ActividadesPoa>();
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'presupuesto_referencial', 'recursos_propios', 'codificado', 'devengado', 'estado', 'actions'];


  dataSource2 = new MatTableDataSource<PresupuestoExterno>();
  columnasUsuario2: string[] = ['id_presupuesto_externo', 'nombre_institucion', 'valor', 'fecha', 'observacion', 'nombreActividad','nombreProyecto'];
  dataSource3 = new MatTableDataSource<ReformaSuplemento>();
  columnasUsuario3: string[] = ['id_ref_suplemento', 'valor', 'fecha', 'nombreActividad','nombreProyecto'];
  dataSource4 = new MatTableDataSource<ReformaTraspasoI>();
  columnasUsuario4: string[] = ['id_reftras_i', 'valor', 'fecha', 'nombreActividad','nombreProyecto'];
  dataSource5 = new MatTableDataSource<ReformaTraspasoD>();
  columnasUsuario5: string[] = ['id_reftras_d', 'valor', 'fecha', 'nombreActividad','nombreProyecto'];
  
  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private actividadservice: ActividadespoaService, private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder, private userService: UsuarioService,
    private pexternoservice: PresupuestoExternoService, private rsuplementoservice: ReformaSuplementoService,
    private rtincrementoservice: ReformaTraspasoIService, private rtdecrementoservice: ReformaTraspasoDService
  ) {
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
    this.listarPE();
    this.listarRS();
    this.listarRTI();
    this.listarRTD();
  }

  opcionSeleccionada: string = 'visualizarAsignaciones'; 
  seleccionarOpcion(event: MatSelectChange) {
    this.opcionSeleccionada = event.value;
  }

  // VALIDACIONES
  validarFechas(): void {
    const fechaElegida = this.frmPE.get('fecha')?.value as string;
    const fechaActual = new Date();
    const fechaElegidaDate = new Date(fechaElegida);
    
    if (fechaElegidaDate < fechaActual) {
      this.frmPE.get('fecha')?.setErrors({ fechaAnterior: true });
    } else {
      this.frmPE.get('fecha')?.setErrors(null);
    }
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

  //PETICIONES | RUTAS
  verPoas() {
    this.router.navigate(['/sup/actividades-presupuestos/tabla-poas']);
  }

  listar(poaId: number): void {
    this.dataSource.data = [];
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

  selectedActividadId!: number;
  abrirModal(actividadId: number) {
    this.selectedActividadId = actividadId;
  }
  
  guardarPE() {
    this.presupuestoexterno = this.frmPE.value;
    this.presupuestoexterno.actividad = new ActividadesPoa();
    this.presupuestoexterno.actividad.id_actividad = this.selectedActividadId;
  
    this.pexternoservice.crear(this.presupuestoexterno)
      .subscribe(
        (response) => {
          console.log('Presupuesto Externo creado con éxito: ', response);
          this.guardadoExitoso1 = true;
          this.listar(this.poa.id_poa);
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
    this.reformasuplemento = this.frmRS.value;
    this.reformasuplemento.actividad = new ActividadesPoa();
    this.reformasuplemento.actividad.id_actividad = this.selectedActividadId;
    this.rsuplementoservice.crear(this.reformasuplemento)
      .subscribe(
        (response) => {
          console.log('Reforma Suplemento agregada con éxito: ', response);
          this.guardadoExitoso2 = true;
          this.listar(this.poa.id_poa);
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
    this.rtincremento = this.frmRTI.value;
    this.rtincremento.actividad = new ActividadesPoa();
    this.rtincremento.actividad.id_actividad = this.selectedActividadId;
    this.rtincrementoservice.crear(this.rtincremento)
      .subscribe(
        (response) => {
          console.log('Reforma Traspaso Incremento agregada con éxito: ', response);
          this.guardadoExitoso3 = true;
          this.listar(this.poa.id_poa);
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al agregar Reforma Traspaso Incremento; ', error);
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
    this.rtdecremento = this.frmRTD.value;
    this.rtdecremento.actividad = new ActividadesPoa();
    this.rtdecremento.actividad.id_actividad = this.selectedActividadId;
    this.rtdecrementoservice.crear(this.rtdecremento)
      .subscribe(
        (response) => {
          console.log('Reforma Traspaso Decremento agregada con éxito: ', response);
          this.guardadoExitoso4 = true;
          this.listar(this.poa.id_poa);
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al agregar Reforma Traspaso Decremento: ', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
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


  //LISTAR TABLAS DE PRESUPUESTOS
  listarPE(): void {
    this.pexternoservice.listarPEActividades().subscribe(
      (data: any[]) => {
        this.listaPEActividades = data;
        this.dataSource2.data = this.listaPEActividades;
      },
      (error: any) => {
        console.error('Error al listar presupuesto externos:', error);
      }
    );
  }
  listarRS(): void {
    this.rsuplementoservice.listarRSActividades().subscribe(
      (data: any[]) => {
        this.listaRSActividades = data;
        this.dataSource3.data = this.listaRSActividades;
      },
      (error: any) => {
        console.error('Error al listar reformas suplementos:', error);
      }
    );
  }
  listarRTI(): void {
    this.rtincrementoservice.listarRTIActividades().subscribe(
      (data: any[]) => {
        this.listaRTIActividades = data;
        this.dataSource4.data = this.listaRTIActividades;
      },
      (error: any) => {
        console.error('Error al listar reformas traspasos incrementos:', error);
      }
    );
  }
  listarRTD(): void {
    this.rtdecrementoservice.listarRTDActividades().subscribe(
      (data: any[]) => {
        this.listaRTDActividades = data;
        this.dataSource5.data = this.listaRTDActividades;
      },
      (error: any) => {
        console.error('Error al listar reformas traspasos decrementos:', error);
      }
    );
  }
}
