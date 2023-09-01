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
import { DatePipe } from '@angular/common';

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
  

  //tabla
  itemsPerPageLabel = 'Actividades por página';
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
  public reformasuplemento = new ReformaSuplemento();
  public rtincremento = new ReformaTraspasoI();
  public rtdecremento = new ReformaTraspasoD();

  poaId!: number;

  filterPost: string = "";
  filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;

  dataSource = new MatTableDataSource<ActividadesPoa>();
  //aqui se cambia
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'presupuesto_referencial', 'recursos_propios', 'codificado', 'devengado', 'estado', 'actions'];

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
    this.listar(this.poa.id_poa)
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
}
