import { UsuarioRol } from './../../../../models/UsuarioRol';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { UsuariorolService } from 'src/app/services/usuariorol.service';
import { DialogoUsuariosComponent } from '../dialogo-usuarios/dialogo-usuarios.component';
import { MatDialog } from '@angular/material/dialog';
import { Programa, ProgramaUsuarioDTO } from 'src/app/models/Programa';
import { ProgramaService } from 'src/app/services/programa.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css'],
})
export class CrearUsuariosComponent implements OnInit {
  //Tabla
  listaUsuarios: UsuarioRol[] = [];
  //Modelos
  usuarioDB = new UsuarioRol(); // informacion que traido de la base
  usuarioEdit = new UsuarioRol();
  programas: Programa[] = [];
  //Variables
  selectedRol: any;
  filterPost = '';

  //Cambiar texto de paginación de la tabla
  itemsPerPageLabel = 'Usuarios por página';
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

  roles = [
    { rolId: 1, rolNombre: 'ADMIN' },
    { rolId: 2, rolNombre: 'SUPERADMIN' },
    { rolId: 3, rolNombre: 'RESPONSABLE' },
    //{ rolId: 4, rolNombre: 'AUTORIDAD' },
  ];

  public usuario = {
    username: '',
    password: '',
  };
  public rol = 0;
  formulario: FormGroup;
  dataSource2 = new MatTableDataSource<UsuarioRol>();
  columnasUsuario: string[] = ['nombre', 'usuario', 'rol', 'actions'];
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild('modal') modal: any;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private paginatorIntl: MatPaginatorIntl,
    private usuariorolservice: UsuariorolService,
    private usuariosService: UsuarioService,
    private programaService: ProgramaService,
    private loadingService: LoadingServiceService
  ) {
    this.formulario = this.formBuilder.group({
      username: { value: '', disabled: true },
      password: ['', Validators.required],
      rol: ['', this.validateRol],
      programa: ['', Validators.required],
    });
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator || null;
  }
  ngOnInit(): void {
    this.cargarDataUsuarios();
  }
  cargarDataUsuarios() {
    this.loadingService.show();
    this.cargarDataProgramas();
    this.usuariorolservice.getLUsuarios().subscribe(
      (listaAsig: UsuarioRol[]) => {
        this.listaUsuarios = listaAsig;
        this.dataSource2.data = this.listaUsuarios;
        console.log(listaAsig);
        this.loadingService.hide();
      },
      (error: UsuarioRol) => {
        console.error('Error al listar los usuarios', error);
        this.loadingService.hide();
      }
    );
  }
  cargarDataProgramas() {
    this.programaService.listar().subscribe((data) => {
      this.programas = data;
      console.log(this.programas);
    });
  }
  openDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogoUsuariosComponent, {
      width: '50%',
      disableClose: false, // Asegúrate de tener esta línea
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.cargarDataUsuarios();
      this.loadingService.hide();
    });
  }
  validateRol(control: FormControl) {
    const selectedRol = control.value;
    if (!selectedRol || selectedRol === 0) {
      return {
        required: true,
      };
    }
    return null;
  }

  eliminar(element: any) {
    const id = element.id;

    Swal.fire({
      title: 'Desea eliminarlo?',
      text: 'No podrá revertirlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuarioLogic(id).subscribe((response) => {
          this.cargarDataUsuarios();
        });

        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      }
    });
  }

  EditarUsuari(usuariossssss: UsuarioRol): void {
    this.usuarioDB = usuariossssss;
  }

  isSaveDisabled(): boolean {
    // Añade aquí todas las validaciones necesarias para tus campos
    return !this.usuarioDB.usuario.username ||
      !this.usuarioDB.usuario.persona.cedula ||
      !this.usuarioDB.usuario.persona.primer_nombre ||
      !this.usuarioDB.usuario.persona.primer_apellido ||
      !this.usuarioDB.usuario.persona.cargo ||
      !this.usuarioDB.usuario.persona.correo ||
      !this.usuarioDB.usuario.persona.celular;
  }

  // usuarioForm es el usuario que recibo del formulario
  Actualizar(usuarioForm: UsuarioRol) {
    this.loadingService.show();

    if (usuarioForm.rol.rolId == 0) {
      usuarioForm.rol = this.usuarioDB.rol;
    }

    if (usuarioForm.usuario.programa.id_programa == 0) {
      usuarioForm.usuario.programa = this.usuarioDB.usuario.programa;
    }

    if (usuarioForm.usuario.password == '') {
      usuarioForm.usuario.password = this.usuarioDB.usuario.password;
    }

    if (usuarioForm.usuario.username == '') {
      usuarioForm.usuario.username = this.usuarioDB.usuario.username;
    }

    if (usuarioForm.usuario.persona.cedula == '') {
      usuarioForm.usuario.persona.cedula =
        this.usuarioDB.usuario.persona.cedula;
    }

    if (usuarioForm.usuario.persona.primer_nombre == '') {
      usuarioForm.usuario.persona.primer_nombre =
        this.usuarioDB.usuario.persona.primer_nombre;
    }

    if (usuarioForm.usuario.persona.primer_apellido == '') {
      usuarioForm.usuario.persona.primer_apellido =
        this.usuarioDB.usuario.persona.primer_apellido;
    }

    if (usuarioForm.usuario.persona.segundo_nombre == '') {
      usuarioForm.usuario.persona.segundo_nombre =
        this.usuarioDB.usuario.persona.segundo_nombre;
    }

    if (usuarioForm.usuario.persona.segundo_apellido == '') {
      usuarioForm.usuario.persona.segundo_apellido =
        this.usuarioDB.usuario.persona.segundo_apellido;
    }

    if (usuarioForm.usuario.persona.direccion == '') {
      usuarioForm.usuario.persona.direccion =
        this.usuarioDB.usuario.persona.direccion;
    }

    if (usuarioForm.usuario.persona.correo == '') {
      usuarioForm.usuario.persona.correo =
        this.usuarioDB.usuario.persona.correo;
    }

    if (usuarioForm.usuario.persona.celular == '') {
      usuarioForm.usuario.persona.celular =
        this.usuarioDB.usuario.persona.celular;
    }

    if (usuarioForm.usuario.persona.cargo == '') {
      usuarioForm.usuario.persona.cargo = this.usuarioDB.usuario.persona.cargo;
    }

    usuarioForm.usuario.id = this.usuarioDB.usuario.id;
    usuarioForm.usuario.persona.id_persona =
    this.usuarioDB.usuario.persona.id_persona;
    usuarioForm.usuarioRolId = this.usuarioDB.usuarioRolId;

    this.loadingService.hide();
    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      this.loadingService.show();
      if (result.isConfirmed) {
        this.usuariorolservice
          .actualizar(usuarioForm.usuarioRolId, usuarioForm)
          .subscribe((response: any) => {
            Swal.fire(
              'Usuario Modificado!',
              'El usuario ha sido modificado éxitosamente',
              'success'
            );
            this.loadingService.hide();
            this.cargarDataUsuarios();
            console.log(response);
            this.usuarioDB = new UsuarioRol();
            this.usuarioEdit = new UsuarioRol();
            console.log(response);
          });
      } else {
        this.loadingService.hide();
        Swal.fire('Se ha cancelado la operación', '', 'info');
      }
    });
  }


  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
    if (!value) {
      this.dataSource2.data = this.listaUsuarios;
    } else {
      value = value.toLowerCase();
      this.dataSource2.data = this.listaUsuarios.filter((usuario) => {
        return (
          usuario.usuario.persona.primer_nombre
            ?.toString()
            .toLowerCase()
            .includes(value) ||
          usuario.usuario.persona.segundo_nombre
            ?.toString()
            .toLowerCase()
            .includes(value) ||
          usuario.usuario.persona.primer_apellido
            ?.toString()
            .toLowerCase()
            .includes(value) ||
          usuario.usuario.persona.segundo_apellido
            ?.toString()
            .toLowerCase()
            .includes(value) ||
          usuario.usuario.username?.toString().toLowerCase().includes(value) ||
          usuario.rol.rolNombre?.toString().toLowerCase().includes(value)
        );
      });
    }
    this.dataSource2._updateChangeSubscription();
  }
  // Asegúrate de que compareRoles compare los objetos de rol por su propiedad 'rolNombre'
  compareRoles(rol1: any, rol2: any): boolean {
    return rol1 && rol2 ? rol1.rolNombre === rol2.rolNombre : rol1 === rol2;
  }
  // Asegúrate de que compareProgramas compare los objetos de programa por su propiedad 'id_programa'
  compareProgramas(programa1: Programa, programa2: Programa): boolean {
    return programa1 && programa2
      ? programa1.id_programa === programa2.id_programa
      : programa1 === programa2;
  }
}

//validaciones meh
function validarCedula(
  control: FormControl
): { [key: string]: boolean } | null {
  const cedula = control.value;
  if (!cedula.match(/^\d{10}$/)) {
    return { cedulaInvalida: true };
  }
  // Aquí puedes agregar la validación específica para cédulas ecuatorianas si lo necesitas.
  return null;
}

function validarNombreApellido(
  control: FormControl
): { [key: string]: boolean } | null {
  if (control.value && (control.value.length < 3 || /\d/.test(control.value))) {
    return { nombreApellidoInvalido: true };
  }
  return null;
}
function validarCelular(
  control: FormControl
): { [key: string]: boolean } | null {
  if (!control.value.match(/^\d{10}$/)) {
    return { celularInvalido: true };
  }
  return null;
}
