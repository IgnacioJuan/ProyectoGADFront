import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Poa } from 'src/app/models/Poa';
import { Usuario2 } from 'src/app/models/Usuario2';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { AprobacionActividad } from 'src/app/models/AprobacionActividad';
import { ListaActividadesUsuario } from 'src/app/interface/ListaActividadesUsuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { MatDialog } from '@angular/material/dialog';
import { UsuariorolService } from 'src/app/services/usuariorol.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {
  frmActividad: FormGroup;
  frmActResp: FormGroup;
  guardadoExitoso: boolean = false;
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
  listaUsuariosActividades: ListaActividadesUsuario[] = [];
  miModal!: ElementRef;
  public actividad = new ActividadesPoa();
  public aprobAct = new AprobacionActividad();
  usuarios: Usuario2[] = [];

  poaId!: number;

  filterPost: string = "";
  filtroUsuarios: string = '';
  //filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;
  mostrarTablaResponsables: boolean = false;
  usuariosFiltrados: Usuario2[] = []; // Lista de usuarios filtrados

  //listarActividades
  dataSource = new MatTableDataSource<ActividadesPoa>();
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'presupuesto_referencial', 'recursos_propios', 'codificado', 'devengado', 'estado', 'actions'];
  //listarUsuariosconActividades
  dataSource2 = new MatTableDataSource<ListaActividadesUsuario>();
  columnasUsuario2: string[] = ['id_usuario', 'username', 'nombre', 'apellido', 'cargo', 'nombreActividad'];

  dataSource3 = new MatTableDataSource<Usuario2>();
  columnasUsuario3: string[] = ['id','nombre', 'apellido','usuario','actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private cdRef: ChangeDetectorRef, private modalService: NgbModal, public dialog: MatDialog,
    private actividadservice: ActividadespoaService, private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder, private userService: UsuarioService,
    private usuariorolservice: UsuariorolService
  ) {
    this.frmActividad = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      presupuesto_referencial: [0, Validators.min(0)],
      recursos_propios: [0, Validators.min(0)],
      codificado: [0, Validators.min(0)],
      devengado: [0, Validators.min(0)]
    });
    this.frmActResp = fb.group({
      usuario: ['', Validators.required]
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
    this.dataSource2.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    const data = history.state.data;
    this.cargarUsuarios();
    this.poa = data;
    console.log(this.poa);
    this.listar(this.poa.id_poa);
    this.listarUsuarios();
    this.Listado();
  }

  verPoas() {
    this.router.navigate(['/adm/asignacion-actividades/poa-actividad']);
  }

  listaUsuarios: any[] = [];
  Listado() {
    this.usuariorolservice.getusuarios().subscribe(
      (listaAsig: any[]) => {
        this.listaUsuarios = listaAsig;
        this.dataSource3.data = this.listaUsuarios;
        console.log(listaAsig)
      }
    );
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

  guardar() {
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

  //PROCESO DE ASIGNACION DE RESPONSABLE A LA ACTIVIDAD
  idActividadSeleccionada!: number;
  abrirModalAsignarResponsable2(idActividad: number) {
    this.idActividadSeleccionada = idActividad;
  }  

  abrirModalAsignarResponsable(idActividad: number, usuarioAsignado: any) {
    console.log('Valor de usuarioAsignado:', usuarioAsignado);
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
          //this.modalService.open('asignarResponsableModal');
        }
      });
    } else {
      this.idActividadSeleccionada = idActividad;
      //this.modalService.open('asignarResponsableModal');
    }
  }
  
  //METODO QUE FUNCIONA CON UN FORM CON UN SELECT DE USUARIOS
  /*guardarResponsable() {
    if (this.frmActResp.valid) {
      const selectedUsuario = this.frmActResp.get('usuario')?.value;
  
      this.actividadservice.getActividadPorId(this.idActividadSeleccionada)
        .subscribe(
          (actividadToUpdate: ActividadesPoa) => {
            actividadToUpdate.usuario = selectedUsuario;
  
            this.actividadservice.actualizar(this.idActividadSeleccionada, actividadToUpdate)
              .subscribe(
                () => {
                  this.frmActResp.reset();
                  this.listar(this.poa.id_poa);
                  Swal.fire(
                    'Exitoso',
                    'Se ha asignado el responsable con éxito',
                    'success'
                  );
                },
                (error) => {
                  console.error('Error al actualizar el responsable:', error);
                  Swal.fire(
                    'Error',
                    'Ha ocurrido un error',
                    'warning'
                  );
                }
              );
          },
          (error: any) => {
            console.error('Error al obtener la actividad:', error);
            Swal.fire(
              'Error',
              'Ha ocurrido un error',
              'warning'
            );
          }
        );
    }
  }*/  


  //METODO QUE FUNCIONA CON LA SELECCION EN LA TABLA DE USUARIOS

  guardarResponsable2(usuarioSeleccionado: any) {
    this.actividadservice.getActividadPorId(this.idActividadSeleccionada)
      .subscribe(
        (actividadToUpdate: ActividadesPoa) => {
          actividadToUpdate.usuario = usuarioSeleccionado;
  
          this.actividadservice.actualizar(this.idActividadSeleccionada, actividadToUpdate)
            .subscribe(
              () => {
                this.listar(this.poa.id_poa);
                Swal.fire(
                  'Exitoso',
                  'Se ha asignado el responsable con éxito',
                  'success'
                );
              },
              (error) => {
                console.error('Error al actualizar el responsable:', error);
                Swal.fire(
                  'Error',
                  'Ha ocurrido un error',
                  'warning'
                );
              }
            );
        },
        (error: any) => {
          console.error('Error al obtener la actividad:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          );
        }
      );
  }
  

  editDatos(activ: ActividadesPoa) {
    this.actividad = activ;
    this.frmActividad = new FormGroup({
      nombre: new FormControl(this.actividad.nombre),
      descripcion: new FormControl(this.actividad.descripcion),
      presupuesto_referencial: new FormControl(this.actividad.presupuesto_referencial),
      recursos_propios: new FormControl(this.actividad.recursos_propios),
      codificado: new FormControl(this.actividad.codificado),
      devengado: new FormControl(this.actividad.devengado)
    });
  }
  actualizar() {

    this.actividad.nombre = this.frmActividad.value.nombre;
    this.actividad.descripcion = this.frmActividad.value.descripcion;
    this.actividad.presupuesto_referencial = this.frmActividad.value.presupuesto_referencial;
    this.actividad.codificado = this.frmActividad.value.codificado;
    this.actividad.devengado = this.frmActividad.value.devengado;
    this.actividad.recursos_propios = this.frmActividad.value.recursos_propios;
    this.actividad.estado = 'PENDIENTE';
    /*const usuarioAsignado = this.actividad.usuario;
    const datosActualizados = { ...this.frmActividad.value };
    delete datosActualizados.usuario; // Elimina el campo usuario del objeto actualizado
    this.actividad = { ...this.actividad, ...datosActualizados, usuario: usuarioAsignado };*/
    this.actividadservice.actualizar(this.actividad.id_actividad, this.actividad)
      .subscribe(response => {
        this.actividad = new ActividadesPoa();
        this.listar(this.poa.id_poa);
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }
  
  eliminar(activ: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.actividadservice.eliminarActividad(activ).subscribe(
          (response) => {
            this.listar(this.poa.id_poa)
            Swal.fire('Eliminado!', '', 'success')

          }
        );
      }
    })

  }

  limpiarFormulario() {
    this.frmActividad.reset();
    this.actividad = new ActividadesPoa;
  }

  limpiar() {
    this.frmActResp.reset();
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

  // 2DA TABLA
  listarUsuarios(): void {
    this.actividadservice.listarUsuariosActividades().subscribe(
      (data: any[]) => {
        this.listaUsuariosActividades = data;
        this.dataSource2.data = this.listaUsuariosActividades;
      },
      (error: any) => {
        console.error('Error al listar poas:', error);
      }
    );
  }
}
