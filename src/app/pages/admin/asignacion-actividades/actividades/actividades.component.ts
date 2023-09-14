import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Poa } from 'src/app/models/Poa';
import { Usuario2 } from 'src/app/models/Usuario2';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { AprobacionActividad } from 'src/app/models/AprobacionActividad';
import { ListaActividadesUsuario } from 'src/app/interface/ListaActividadesUsuario';
import { MatDialog } from '@angular/material/dialog';
import { UsuariorolService } from 'src/app/services/usuariorol.service';
import 'jquery';
import 'popper.js';
import { AsignacionUsuarioService } from 'src/app/services/asignacionusuario.service';
import { AsignacionUsuario } from 'src/app/models/AsignacionUsuario';
import { PoaInsertService } from 'src/app/services/poa/poa-insert.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { Periodo } from 'src/app/models/Periodo';
declare var $: any;

interface DynamicControls {
  [key: string]: FormControl;
}

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {
  frmActividad: FormGroup;
  guardadoExitoso: boolean = false;
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

  //VARIABLES
  poa: Poa = new Poa();
  actividades: any = [];
  listaUsuariosActividades: ListaActividadesUsuario[] = [];
  miModal!: ElementRef;
  public actividad = new ActividadesPoa();
  act!: ActividadesPoa[];
  public aprobAct = new AprobacionActividad();
  public asignacion = new AsignacionUsuario();
  usuarios: Usuario2[] = [];
  poaId!: number;
  filterPost: string = "";
  filtroUsuarios: string = '';
  resultadosEncontrados: boolean = true;
  usuariosFiltrados: Usuario2[] = []; // Lista de usuarios filtrados
  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  showHint!: boolean;
  nombreActividad: string = '';
  listaU!: ListaActividadesUsuario[];
  listaU2!: ListaActividadesUsuario[];
  spans: any[] = [];
  spans2: any[] = [];
  modoCreacion: boolean = true;


  //listarActividades
  dataSource = new MatTableDataSource<ActividadesPoa>(this.act);
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'presupuesto_referencial', 'recursos_propios', 'codificado', 'devengado', 'estado', 'actions'];
  //listarUsuariosconActividades
  columUsuario1: string[] = ['id_usuario', 'username', 'nombre', 'apellido', 'cargo'];
  columUsuario2: string[] = ['id_usuario', 'username', 'nombre', 'apellido', 'cargo','fecha_asignacion'];
  //Listar Usuarios para Asignarles Actividad
  dataSource3 = new MatTableDataSource<Usuario2>();
  columnasUsuario3: string[] = ['id','nombre', 'apellido','usuario','actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private cdRef: ChangeDetectorRef, public dialog: MatDialog,
    private actividadservice: ActividadespoaService, private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder, private userService: UsuarioService,
    private usuariorolservice: UsuariorolService, private asignacionservice: AsignacionUsuarioService,
    private poaInsertService: PoaInsertService, private route: ActivatedRoute, private loadingService: LoadingServiceService
  ) {
    this.frmActividad = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      presupuesto_referencial: [0, Validators.min(0)],
      recursos_propios: [0, Validators.min(0)],
      codificado: [0, Validators.min(0)],
      devengado: [0, Validators.min(0)],
      valor1: [''],
      valor2: [''],
      valor3: [''],
      valor4: ['']
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
    this.cargarUsuarios();
    this.poa = data;
    console.log(this.poa);
    const tipoPeriodo = data.tipo_periodo;
    console.log('Tipo de período:', tipoPeriodo);
    this.listar(this.poa.id_poa);
    this.Listado();
    this.actividadservice.obtenerActividades().subscribe((data: ActividadesPoa[]) => {
      this.act = data;
    });
  }

  verPoas() {
    this.router.navigate(['/adm/asignacion-actividades/poa-actividad']);
  }

  // CRUD ACTIVIDADES
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

  guardar2() {
    this.actividad = this.frmActividad.value;
    this.actividad.poa = this.poa;
    this.actividad.estado = 'PENDIENTE';
    this.actividadservice.crear(this.actividad)
      .subscribe(
        (response) => {

          console.log('Actividad creada con éxito:', response);
          this.guardadoExitoso = true;
          const idActividadCreada = response.id_actividad;
          const idPoa = this.poa.id_poa;
          this.crearAprobacion(response);
          console.log(idActividadCreada + ' ' + idPoa);
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
 
  guardar() {
    this.loadingService.show();
    this.actividad = this.frmActividad.value;
    this.actividad.presupuesto_referencial = this.actividad.recursos_propios;
    this.actividad.poa = this.poa;
    this.actividad.estado = 'PENDIENTE';
    // Validación de suma
    let suma = 0;
    if (this.poa.tipo_periodo === 'CUATRIMESTRE') {
        suma = Number(this.actividad.valor1) + Number(this.actividad.valor2) + Number(this.actividad.valor3);
    } else if (this.poa.tipo_periodo === 'TRIMESTRE') {
        suma = Number(this.actividad.valor1) + Number(this.actividad.valor2) + Number(this.actividad.valor3) + Number(this.actividad.valor4);
    }
    console.log("Suma total:", suma);
    if (suma !== 100) {
        Swal.fire('Advertencia', 'La suma de los valores de periodo debe 100', 'warning');
        this.loadingService.hide();
        return;
    }
    this.actividadservice.crear(this.actividad).subscribe(
      (response) => {
        console.log('Actividad creada con éxito:', response);
        const idActividad = response.id_actividad;
        if (this.poa.tipo_periodo === 'CUATRIMESTRE') {
          this.crearPeriodo(idActividad, this.actividad.valor1, 1);
          this.crearPeriodo(idActividad, this.actividad.valor2, 2);
          this.crearPeriodo(idActividad, this.actividad.valor3, 3);
        } else if (this.poa.tipo_periodo === 'TRIMESTRE') {
          this.crearPeriodo(idActividad, this.actividad.valor1, 1);
          this.crearPeriodo(idActividad, this.actividad.valor2, 2);
          this.crearPeriodo(idActividad, this.actividad.valor3, 3);
          this.crearPeriodo(idActividad, this.actividad.valor4, 4);
        }
        this.guardadoExitoso = true;
        this.crearAprobacion(response);
        this.loadingService.hide();
        Swal.fire('Exitoso', 'Se ha completado el registro con éxito', 'success');
        this.cdRef.detectChanges();
        this.listar(this.poa.id_poa);
      },
      (error) => {
        console.error('Error al crear la actividad:', error);
        Swal.fire('Error', 'Ha ocurrido un error', 'warning');
        this.loadingService.hide();
      }
    );
  }
  
  crearPeriodo(idActividad: number, porcentaje: number, referencia: number) {
    this.poaInsertService.crearPeriodo(porcentaje, idActividad, referencia).subscribe(
      (periodoResponse) => {
        console.log('Registro de período creado con éxito:', periodoResponse);
      },
      (periodoError) => {
        console.error('Error al crear el registro de período:', periodoError);
      }
    );
  }
  
  crearAprobacion(actividad: any) {
    this.aprobAct.estado = 'PENDIENTE';
    this.aprobAct.observacion = '';
    this.aprobAct.actividad = actividad;
    this.aprobAct.poa = this.poa;
    this.actividadservice.crearRelacionAprobacion(this.aprobAct).subscribe(
      (response) => {
        console.log('Relación de aprobación creada:', response);
      },
      (error) => {
        console.error('Error al crear la relación de aprobación:', error);
      }
    );
  }
  
  
  editDatos(activ: ActividadesPoa) {
    //this.modoCreacion = false;
    this.actividad = activ;
    this.frmActividad = new FormGroup({
      nombre: new FormControl(this.actividad.nombre),
      descripcion: new FormControl(this.actividad.descripcion),
      presupuesto_referencial: new FormControl(this.actividad.presupuesto_referencial),
      recursos_propios: new FormControl(this.actividad.recursos_propios),
      codificado: new FormControl(this.actividad.codificado),
      devengado: new FormControl(this.actividad.devengado),
      valor1: new FormControl(this.actividad.valor1),
      valor2: new FormControl(this.actividad.valor2),
      valor3: new FormControl(this.actividad.valor3),
      valor4: new FormControl(this.actividad.valor4)
    });
  }
  

  cargarDatosAlForm(activ: ActividadesPoa) {
    this.actividad = activ;
    const dynamicControls: DynamicControls = {nombre: new FormControl(this.actividad.nombre),
      descripcion: new FormControl(this.actividad.descripcion),
      presupuesto_referencial: new FormControl(this.actividad.presupuesto_referencial),
      recursos_propios: new FormControl(this.actividad.recursos_propios)};

    // Periodos relacionados con la actividad
    this.actividadservice.listarPeriodosPorActividad(this.actividad.id_actividad).subscribe(
      (periodos) => {
        periodos.forEach((periodo) => {
          dynamicControls[`valor${periodo.referencia}`] = new FormControl(periodo.porcentaje);
        });
        console.log(periodos)
        this.frmActividad = new FormGroup(dynamicControls);
      },
      (error) => {
        console.error('Error al obtener los periodos de la actividad:', error);
      }
    );
  }

  actualizars() {
    this.loadingService.show();
    this.actividad.nombre = this.frmActividad.value.nombre;
    this.actividad.descripcion = this.frmActividad.value.descripcion;
    //this.actividad.presupuesto_referencial = this.frmActividad.value.this.recursos_propios;
    this.actividad.recursos_propios = this.frmActividad.value.recursos_propios;
    this.actividad.estado = 'PENDIENTE';
  
    // Validación de suma
    let suma = 0;
    if (this.poa.tipo_periodo === 'CUATRIMESTRE') {
      suma = Number(this.frmActividad.value.valor1) + Number(this.frmActividad.value.valor2) + Number(this.frmActividad.value.valor3);
    } else if (this.poa.tipo_periodo === 'TRIMESTRE') {
      suma = Number(this.frmActividad.value.valor1) + Number(this.frmActividad.value.valor2) + Number(this.frmActividad.value.valor3) + Number(this.frmActividad.value.valor4);
    }
    console.log("Suma total Actualizacion:", suma);
    if (suma !== 100) {
      Swal.fire('Advertencia', 'La suma de los valores de periodo debe ser 100', 'warning');
      this.loadingService.hide();
      return;
    }
  
    // Actualiza la actividad
    this.actividadservice.actualizar(this.actividad.id_actividad, this.actividad)
      .subscribe(response => {
        // Actualiza los periodos
        //this.actualizarPeriodos(this.actividad.id_actividad);
      }, error => {
        console.error('Error al actualizar la actividad:', error);
        Swal.fire('Error', 'Ha ocurrido un error al actualizar la actividad', 'warning');
        this.loadingService.hide();
      });
      this.loadingService.hide();
  }
  
  actualizars2() {
    this.loadingService.show();
    this.actividad.nombre = this.frmActividad.value.nombre;
    this.actividad.descripcion = this.frmActividad.value.descripcion;
    this.actividad.presupuesto_referencial = this.frmActividad.value.recursos_propios;
    this.actividad.recursos_propios = this.frmActividad.value.recursos_propios;
    this.actividad.estado = 'PENDIENTE';
    this.actividadservice.actualizar(this.actividad.id_actividad, this.actividad)
      .subscribe(response => {
        this.actividad = new ActividadesPoa();
        this.loadingService.hide();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
        this.cdRef.detectChanges();
        this.listar(this.poa.id_poa);
      });
      this.loadingService.hide();
  }

  actualizar() {
    this.loadingService.show();
    
    // Actualiza los datos de la actividad
    this.actividad.nombre = this.frmActividad.value.nombre;
    this.actividad.descripcion = this.frmActividad.value.descripcion;
    this.actividad.presupuesto_referencial = this.frmActividad.value.recursos_propios;
    this.actividad.recursos_propios = this.frmActividad.value.recursos_propios;
    this.actividad.estado = 'PENDIENTE';
    
    const valoresPeriodos: { [key: number]: number } = {};
    for (let i = 1; i <= 4; i++) {
      const campo = `valor${i}`;
      if (this.frmActividad.contains(campo)) {
        valoresPeriodos[i] = this.frmActividad.value[campo];
      }
    }
    const valoresPeriodosNoVacios = Object.values(valoresPeriodos).some(value => value !== null && value !== undefined);
    if (valoresPeriodosNoVacios) {
      const periodosActualizados = [];
      for (let i = 1; i <= 4; i++) {
        if (valoresPeriodos[i] !== null && valoresPeriodos[i] !== undefined) {
          periodosActualizados.push({ id_periodo: i, porcentaje: valoresPeriodos[i] });
        }
      }
      this.actividadservice.actualizarPeriodosActividades(this.actividad.id_actividad, periodosActualizados)
        .subscribe(
          () => {
            this.loadingService.hide();
            Swal.fire('Operación exitosa!', 'Los periodos se actualizaron con éxito', 'success');
            this.cdRef.detectChanges();
            this.listar(this.poa.id_poa);
          },
          (error) => {
            console.error('Error al actualizar los periodos:', error);
            Swal.fire('Error', 'Ha ocurrido un error al actualizar los periodos', 'warning');
            this.loadingService.hide();
          }
        );
    } else {
      // No se actualizaron campos de periodo, así que solo actualiza la actividad y muestra un mensaje
      this.actividadservice.actualizar(this.actividad.id_actividad, this.actividad)
        .subscribe(
          () => {
            this.loadingService.hide();
            Swal.fire('Operación exitosa!', 'El registro se actualizó con éxito', 'success');
            this.cdRef.detectChanges();
            this.listar(this.poa.id_poa);
          },
          (error) => {
            console.error('Error al actualizar la actividad:', error);
            Swal.fire('Error', 'Ha ocurrido un error al actualizar la actividad', 'warning');
            this.loadingService.hide();
          }
        );
    }
  }
  
  
  actualiza() {
    this.loadingService.show();
    
    // Actualiza los datos de la actividad
    this.actividad.nombre = this.frmActividad.value.nombre;
    this.actividad.descripcion = this.frmActividad.value.descripcion;
    this.actividad.presupuesto_referencial = this.frmActividad.value.recursos_propios;
    this.actividad.recursos_propios = this.frmActividad.value.recursos_propios;
    this.actividad.estado = 'PENDIENTE';

    // Llama al servicio para obtener los ID de los periodos asociados a la actividad
    this.actividadservice.listarPeriodosPorActividad(this.actividad.id_actividad)
      .subscribe((periodos: Periodo[]) => {
        const periodosActualizados = periodos.map(periodo => {
        const referencia = periodo.referencia;
        const porcentaje = this.frmActividad.value[`valor${referencia}`];
          return { id_periodo: periodo.id_periodo, porcentaje };
        });

        // Llama al servicio para actualizar
        this.actividadservice.actualizarPeriodosActividades(this.actividad.id_actividad, periodosActualizados)
          .subscribe(() => {
            this.actividadservice.actualizar(this.actividad.id_actividad, this.actividad)
            .subscribe(() => {
              this.loadingService.hide();
                Swal.fire('Operación exitosa!', 'La actividad y los periodos se actualizaron con éxito', 'success');
                  this.cdRef.detectChanges();
                  this.listar(this.poa.id_poa);
                  }, (error) => {
                    console.error('Error al actualizar la actividad:', error);
                    Swal.fire('Error', 'Ha ocurrido un error al actualizar la actividad', 'warning');
                    this.loadingService.hide();
                  });
          }, (error) => {
            console.error('Error al actualizar los periodos:', error);
            Swal.fire('Error', 'Ha ocurrido un error al actualizar los periodos', 'warning');
            this.loadingService.hide();
            });
        });
  }

  

  actualizarPeriodos(idActividad: number) {
    const valoresPeriodos: { [key: number]: number } = {};
    for (let i = 1; i <= 4; i++) {
      const campo = `valor${i}`;
      if (this.frmActividad.contains(campo)) {
        valoresPeriodos[i] = this.frmActividad.value[campo];
      }
    }
    // Llama al servicio para actualizar los periodos asociados a la actividad
    this.actividadservice.actualizarPeriodosActividad(idActividad, valoresPeriodos)
      .subscribe(response => {
        this.loadingService.hide();
        Swal.fire('Operación exitosa!', 'Los periodos se actualizaron con éxito', 'success');
        this.cdRef.detectChanges();
        this.listar(this.poa.id_poa);
      }, error => {
        console.error('Error al actualizar los periodos:', error);
        Swal.fire('Error', 'Ha ocurrido un error al actualizar los periodos', 'warning');
        this.loadingService.hide();
      });
  }
  
  
  
  eliminar(activ: any) {
    this.loadingService.show();
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.actividadservice.eliminarActividad(activ).subscribe(
          (response) => {
            this.loadingService.hide();
            Swal.fire('Eliminado!', '', 'success')
            this.cdRef.detectChanges();
            this.listar(this.poa.id_poa)
          }
        );
      }
    })

  }
  limpiarFormulario() {
    this.frmActividad.reset();
    this.actividad = new ActividadesPoa;
  }


  // LISTA USUARIOS TABLA
  listaUsuarios: any[] = [];
  Listado() {
    this.usuariorolservice.getusuariosResponsable().subscribe(
      (listaAsig: any[]) => {
        this.listaUsuarios = listaAsig;
        this.dataSource3.data = this.listaUsuarios;
      }
    );
  }
  cargarUsuarios() {
    this.userService.getUsuariosList().subscribe(
      (data: Usuario2[]) => {
        this.usuarios = data;
      },
      (error: any) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  //PROCESO DE ASIGNACION DE RESPONSABLE A LA ACTIVIDAD
  idActividadSeleccionada!: number;
  abrirModalAsignarResponsable(idActividad: number, usuarioAsignado: any) {
    console.log('Valor de usuarioAsignado:', usuarioAsignado);
    console.log('actividad Seleccionada: ', idActividad)
    if (usuarioAsignado !== undefined && usuarioAsignado !== null) {
      Swal.fire({
        title: 'Confirmación',
        text: 'La Actividad ya tiene un usuario designado. ¿Desea cambiar el usuario?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.idActividadSeleccionada = idActividad;
          $('#asignarResponsableModal').modal('show');
        }
      });
    } else {
      this.idActividadSeleccionada = idActividad;
      $('#asignarResponsableModal').modal('show');
    }
  }
  
  //METODO QUE FUNCIONA CON LA SELECCION EN LA TABLA DE USUARIOS
  guardarResponsable(usuarioSeleccionado: any) {
    this.loadingService.show();
    this.actividadservice.getActividadPorId(this.idActividadSeleccionada)
      .subscribe(
        (actividadToUpdate: ActividadesPoa) => {
          const actividadActualizada = { ...actividadToUpdate };
          actividadActualizada.usuario = usuarioSeleccionado;
          this.actividadservice.actualizar(this.idActividadSeleccionada, actividadActualizada)
            .subscribe(
              () => {
                // Registro en la tabla asignaciones_usuarios
                const asignacion = new AsignacionUsuario();
                asignacion.usuario = usuarioSeleccionado;
                asignacion.actividad = new ActividadesPoa();
                asignacion.actividad.id_actividad = actividadToUpdate.id_actividad;
                asignacion.fecha_asignacion = new Date();
                this.asignacionservice.crear(asignacion)
                  .subscribe(
                    () => {
                      this.loadingService.hide();
                      Swal.fire(
                        'Exitoso',
                        'Se ha asignado el responsable con éxito',
                        'success'
                      );
                      this.cdRef.detectChanges();
                      this.listar(this.poa.id_poa);
                    },
                    (error) => {
                      console.error('Error al crear la asignación de responsable:', error);
                      this.loadingService.hide();
                      Swal.fire(
                        'Error',
                        'Ha ocurrido un error al crear la asignación de responsable',
                        'warning'
                      );
                    }
                  );
              },
              (error) => {
                console.error('Error al actualizar el responsable:', error);
                this.loadingService.hide();
                Swal.fire(
                  'Error',
                  'Ha ocurrido un error al actualizar el responsable',
                  'warning'
                );
              }
            );
        },
        (error: any) => {
          console.error('Error al obtener la actividad:', error);
          this.loadingService.hide();
          Swal.fire(
            'Error',
            'Ha ocurrido un error al obtener la actividad',
            'warning'
          );
        }
      );
      this.loadingService.hide();
  }
  
  // FILTROS DE BUSQUEDA
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

  filtrarUsers(){
    if(this.filtroUsuarios){
      const filtro = this.filtroUsuarios.toLowerCase(); 
      this.dataSource3.data = this.dataSource3.data.filter((item: any)=>{
        return JSON.stringify(item).toLowerCase().includes(filtro);
      });
    }else{
      this.dataSource3.data = this.listaUsuarios;
    }
  }

  //PROCESOS PARA LISTAR USUARIOS DE UNA ACTIVIDAD
  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }
  getRowSpan2(col: any, index: any) {
    return this.spans2[index] && this.spans2[index][col];
  }
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaU.length;) {
      let currentValue = accessor(this.listaU[i]);
      let count = 1;

      for (let j = i + 1; j < this.listaU.length; j++) {
        if (currentValue !== accessor(this.listaU[j])) {
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
    for (let i = 0; i < this.listaU2.length;) {
      let currentValue = accessor(this.listaU2[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.listaU2.length; j++) {
        if (currentValue !== accessor(this.listaU2[j])) {
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

  clicEnActividad(actividad: ActividadesPoa) {
    this.actividad = actividad; // Actualiza this.actividad con la actividad seleccionada
    this.cargarTabla(actividad.id_actividad); // Llama a cargarTabla con el ID de la actividad
  }

  cargarTabla(actividadId: number) {
    console.log(this.actividad);
    this.nombreActividad= this.act.find(m => m.id_actividad === actividadId)?.nombre || '';
    console.log('Cargando tabla para el id_actividad', actividadId);
    this.actividadservice.listarUsuariosActividades(actividadId).subscribe((data:ListaActividadesUsuario[])=>{
      this.listaU=data;
      console.log("Responsable Actual ", JSON.stringify(this.listaU))
      this.cacheSpan('id_usuario', (d) => d.id_usuario);
      this.cacheSpan('username', (d) => d.id_usuario + d.username);
      this.cacheSpan('nombre', (d) => d.id_usuario + d.username + d.nombre);
      this.cacheSpan('apellido', (d) => d.id_usuario + d.username + d.nombre + d.apellido);
      this.cacheSpan('cargo', (d) => d.id_usuario + d.username + d.nombre + d.apellido + d.cargo );
    });

    this.asignacionservice.getAsignacionesUsuarios(actividadId).subscribe((data:ListaActividadesUsuario[])=>{
      this.listaU2=data;
      console.log("Usuario Anteriores ", JSON.stringify(this.listaU2))
      this.cacheSpan2('id_usuario', (d) => d.id_usuario);
      this.cacheSpan2('username', (d) => d.id_usuario + d.username);
      this.cacheSpan2('nombre', (d) => d.id_usuario + d.username + d.nombre);
      this.cacheSpan2('apellido', (d) => d.id_usuario + d.username + d.nombre + d.apellido);
      this.cacheSpan2('cargo', (d) => d.id_usuario + d.username + d.nombre + d.apellido + d.cargo );
      this.cacheSpan2('fecha_asignacion', (d) => d.id_usuario + d.username + d.nombre + d.apellido + d.cargo + d.fecha_asignacion);
    });
  }
}
