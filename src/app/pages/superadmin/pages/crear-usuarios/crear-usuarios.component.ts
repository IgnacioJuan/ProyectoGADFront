import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioRol } from 'src/app/models/UsuarioRol';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { Fenix } from 'src/app/models/Fenix';
import { FenixService } from 'src/app/services/fenix.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuariorolService } from 'src/app/services/usuariorol.service';
import { catchError, tap, throwError } from 'rxjs';
import { Usuario2 } from 'src/app/models/Usuario2';
import { Persona2 } from 'src/app/models/Persona2';
import { Router } from '@angular/router';
import { DialogoUsuariosComponent } from '../dialogo-usuarios/dialogo-usuarios.component';
import { MatDialog } from '@angular/material/dialog';
import { ProgramaUsuarioDTO } from 'src/app/models/Programa';
import { ProgramaService } from 'src/app/services/programa.service';

let ELEMENT_DATA: Fenix[] = [];

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css'],
})
export class CrearUsuariosComponent implements OnInit {

  usuarioGuardar = new Usuario2();

  fenix: Fenix = new Fenix();

  listaPersonas: Persona2[] = [];

  listaUsuarios: any[] = [];
  filterPost = '';
  personaSele = new Persona2();
  usuarioDB = new UsuarioRol(); // informacion que triago de la base 
  usuarioEdit = new UsuarioRol(); // informacion que me envia el formulario 
  selectedRol: any;
  //Cambiar texto tabla
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
  //

  roles = [
    { rolId: 1, rolNombre: 'ADMIN' },
    { rolId: 2, rolNombre: 'SUPERADMIN' },
    { rolId: 3, rolNombre: 'RESPONSABLE' },
    //{ rolId: 4, rolNombre: 'AUTORIDAD' },
  ];
  programas: ProgramaUsuarioDTO[] = [];

  public usuario = {
    username: '',
    password: ''
  }
  public rol = 0;
  formulario: FormGroup;
  dataSource2 = new MatTableDataSource<Usuario2>();
  columnasUsuario: string[] = ['nombre', 'usuario', 'rol', 'actions'];
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild('modal') modal: any;
  constructor(
    public dialog: MatDialog,
    private personaService: PersonaService,
    private usuariosService: UsuarioService,
    private fenix_service: FenixService,
    private formBuilder: FormBuilder,
    private paginatorIntl: MatPaginatorIntl,
    private usuariorolservice: UsuariorolService,
    private programaService: ProgramaService
  ) {
    this.formulario = this.formBuilder.group({
      username: { value: '', disabled: true },
      password: ['', Validators.required],
      rol: ['', this.validateRol]
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
    this.Listado();
  }

  Listado() {
    this.programaService.listar().subscribe(data => {
      this.programas = data;
      console.log(this.programas);
    });

    this.personaService.getPersonas().subscribe(
      listaPerso => this.listaPersonas = listaPerso
    );

    this.usuariorolservice.getusuarios().subscribe(
      (listaAsig: any[]) => {
        this.listaUsuarios = listaAsig;
        this.dataSource2.data = this.listaUsuarios;
        console.log(listaAsig)
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogoUsuariosComponent, { width: '100%' });

    dialogRef.afterClosed().subscribe(result => {
      this.Listado();
    });
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource2.data = this.dataSource2.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      // Restaurar los datos originales si no hay filtro aplicado
      this.dataSource2.data = this.listaUsuarios;;
    }
  }

  displayedColumns: string[] = [
    'cedula',
    'primer_apellido',
    'segundo_apellido',
    'primer_nombre',
    'segundo_nombre',
    'celular',
    'acciones'];

  dataSource = ELEMENT_DATA;

  //consumir servicio de fenix para obtener datos de la persona por cedula
  public consultarPorCedula() {
    if (this.fenix.cedula == null || this.fenix.cedula == '') {
      Swal.fire('Error', 'Debe ingresar una cedula', 'error');
      return;
    }
    console.log('si entra');
    this.fenix_service.getDocenteByCedula(this.fenix.cedula).subscribe(
      (result) => {
        this.dataSource = result;
        console.log(this.dataSource);
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por primer_nombre
  public consultarPorNombre() {
    /*if (this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') {
      Swal.fire('Error', 'Debe ingresar un nombre', 'error');
      return;
    }*/
    if (this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un nombre válido',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    this.fenix_service.getDocenteByPrimerNombre(this.fenix.primer_nombre).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por segundo_nombre
  public consultarPorSegundoNombre() {
    if (this.fenix.segundo_nombre == null || this.fenix.segundo_nombre == '') {
      Swal.fire('Error', 'Por favor, ingrese un nombre válido', 'error');
      return;
    }
    this.fenix_service.getDocenteBySegundoNombre(this.fenix.segundo_nombre).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por primer_nombre y segundo_nombre
  public consultarPorPrimerNombreSegundoNombre() {
    if ((this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') && (this.fenix.segundo_nombre == null || this.fenix.segundo_nombre == '')) {
      Swal.fire('Error', 'Por favor, ingrese los nombres válidos', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerNombreSegundoNombre(this.fenix.primer_nombre, this.fenix.segundo_nombre).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por primer_apellido
  public consultarPorApellido() {
    if (this.fenix.primer_apellido == null || this.fenix.primer_apellido == '') {
      Swal.fire('Error', 'Debe ingresar un apellido', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerApellido(this.fenix.primer_apellido).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por segundo_apellido
  public consultarPorSegundoApellido() {
    if (this.fenix.segundo_apellido == null || this.fenix.segundo_apellido == '') {
      Swal.fire('Error', 'Debe ingresar un apellido', 'error');
      return;
    }
    this.fenix_service.getDocenteBySegundoApellido(this.fenix.segundo_apellido).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }
  //metodo para obtener docentes por primer_apellido y segundo_apellido
  public consultarPorPrimerApellidoAndSegundoApellido() {
    if ((this.fenix.primer_apellido == null || this.fenix.primer_apellido == '') && (this.fenix.segundo_apellido == null || this.fenix.segundo_apellido == '')) {
      Swal.fire('Error', 'Debe ingresar un apellido', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerApellidoAndSegundoApellido(this.fenix.primer_apellido, this.fenix.segundo_apellido).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }


  //crear un metodo que una los servicios de cedula, primer_nombre,primer_apellido, segundo_nombre y segundo_apellido
  public consultar() {
    if (this.fenix.primer_nombre && this.fenix.primer_apellido) {
      this.consultarPorNombreCompleto();
    } else if (this.fenix.cedula) {
      this.consultarPorCedula();
    } else if (this.fenix.primer_apellido && this.fenix.segundo_apellido) {
      this.consultarPorPrimerApellidoAndSegundoApellido();
    } else if (this.fenix.primer_apellido) {
      this.consultarPorApellido();
    } else if (this.fenix.primer_nombre) {
      this.consultarPrimerNombre();
    } else {
      Swal.fire('Error', 'Debe ingresar un valor a buscar', 'error');
      return;
    }
  }

  public consultarPorNombreCompleto() {
    if (this.fenix.primer_nombre == null && this.fenix.primer_apellido == null || this.fenix.primer_nombre == "" && this.fenix.primer_apellido == "") {
      Swal.fire('Error', 'Debe llenar los campos', 'error');
      return;
    }
    this.fenix_service.getDocenteByNombresCompletos(this.fenix.primer_nombre, this.fenix.primer_apellido).subscribe(
      (result) => {
        this.dataSource = result;
        console.log(this.dataSource);
      }
    )
  }
  public consultarPrimerNombre() {
    if (this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') {
      Swal.fire('Error', 'Debe ingresar un nombre', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerNombre(this.fenix.primer_nombre).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  public seleccionar(element: any) {

    this.personaSele.cedula = element.cedula;
    this.personaSele.primer_apellido = element.primer_apellido;
    this.personaSele.segundo_apellido = element.segundo_apellido;
    this.personaSele.primer_nombre = element.primer_nombre;
    this.personaSele.segundo_nombre = element.segundo_nombre;
    this.personaSele.celular = element.celular;
    this.personaSele.correo = element.correo;
    this.personaSele.direccion = element.direccion;
    console.log(this.personaSele);
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.persona = this.personaSele;
  }


  public seleccionar2(element: any) {
    this.personaSele = element;
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.persona.id_persona = this.personaSele.id_persona;
  }

  registrarUsuario() {
    console.log(this.usuarioGuardar)
    this.personaService.findByCedula(this.personaSele.cedula).subscribe(
      (data2: Persona2) => {
        if (!data2) { // Si no se encuentra ningún resultado
          this.personaService.createPersona(this.personaSele).subscribe(
            (data) => {
              console.log(data);
              this.usuarioGuardar.username = data.cedula;
              this.usuarioGuardar.persona = data;
              this.crearUsuario();
            },
            (error) => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'No se pudo registrar persona',
                text: 'Error al registrar!',
                footer: '<a href=""></a>',
              });
            }
          );
        } else {
          // Aquí puedes agregar código adicional para manejar el caso cuando se encuentra una persona con la misma cédula
          this.usuarioGuardar.username = data2.cedula;
          this.usuarioGuardar.persona = data2;
          this.crearUsuario();
        }
      },
      (error: any) => {
        console.error('Error al listar los indicadors:', error);
      }
    );
  }

  crearUsuario() {

    console.log(this.usuarioGuardar)
    this.usuariosService.createUsuario(this.usuarioGuardar, this.rol).subscribe(
      () => {
        Swal.fire(
          'Usuario Registrado!',
          'El usuario ha sido registrado éxitosamente',
          'success'
        );
        this.Listado();

        this.formulario.reset();
        this.formulario.markAsPristine();
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar usuario',
          text: 'Error al registrar!',
          footer: '<a href=""></a>',
        });
      }
    );
  }

  guardarUsuario() {
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.password = this.formulario.value.password;
    this.rol = this.formulario.value.rol;
    console.log(this.usuarioGuardar.username)
    console.log(this.usuarioGuardar.password)
    console.log(this.rol)
    if (!this.usuarioGuardar.username || !this.usuarioGuardar.password || !this.rol) {
      Swal.fire('Campos Vacios', 'Por favor llene todos los campos', 'warning');
      return;
    }

    this.usuariosService.obtenerUsuario(this.usuarioGuardar.username).pipe(
      tap((existeUsuario: boolean) => {
        if (existeUsuario) {
          Swal.fire('Usuario existente', 'El usuario ya está registrado', 'warning');
        } else {
          this.registrarUsuario();
        }
      }),
      catchError((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al comprobar usuario',
          text: 'Error al comprobar la existencia del usuario',
          footer: '<a href=""></a>',
        });
        return throwError(error);
      })
    ).subscribe();
  }

  cerrarModal() {
    this.formulario.reset();
    this.formulario.markAsPristine();
  }

  validateRol(control: FormControl) {
    const selectedRol = control.value;
    if (!selectedRol || selectedRol === 0) {
      return {
        required: true
      };
    }
    return null;
  }


  eliminar(element: any) {
    const id = element.id;

    Swal.fire({
      title: 'Desea eliminarlo?',
      text: "No podrá revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuarioLogic(id).subscribe((response) => {
          this.Listado();
        });

        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      }
    });
  }

  EditarUsuari(usuariossssss: any): void {
    this.usuarioDB = usuariossssss
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1 && role2 ? role1.rolNombre === role2.rolNombre : role1 === role2;
  }

  // usuarioForm es el usuario que recibo del formulario 
  Actualizar(usuarioForm: UsuarioRol) {
    if (usuarioForm.rol.rolId == 0) {
      usuarioForm.rol = this.usuarioDB.rol;
    }

    if (usuarioForm.usuario.programa == null) {
      console.log(this.usuarioDB.usuario.programa);
      usuarioForm.usuario.programa = this.usuarioDB.usuario.programa;
    }

    if (usuarioForm.usuario.password == "") {
      usuarioForm.usuario.password = this.usuarioDB.usuario.password
    }
    if (usuarioForm.usuario.username == "") {
      usuarioForm.usuario.username = this.usuarioDB.usuario.username
    }

    if (usuarioForm.usuario.persona.cedula == "") {
      usuarioForm.usuario.persona.cedula = this.usuarioDB.usuario.persona.cedula
    }

    if (usuarioForm.usuario.persona.primer_nombre == "") {
      usuarioForm.usuario.persona.primer_nombre = this.usuarioDB.usuario.persona.primer_nombre
    }

    if (usuarioForm.usuario.persona.primer_apellido == "") {
      usuarioForm.usuario.persona.primer_apellido = this.usuarioDB.usuario.persona.primer_apellido
    }

    if (usuarioForm.usuario.persona.segundo_nombre == "") {
      usuarioForm.usuario.persona.segundo_nombre = this.usuarioDB.usuario.persona.segundo_nombre
    }

    if (usuarioForm.usuario.persona.segundo_apellido == "") {
      usuarioForm.usuario.persona.segundo_apellido = this.usuarioDB.usuario.persona.segundo_apellido
    }

    if (usuarioForm.usuario.persona.direccion == "") {
      usuarioForm.usuario.persona.direccion = this.usuarioDB.usuario.persona.direccion
    }

    if (usuarioForm.usuario.persona.correo == "") {
      usuarioForm.usuario.persona.correo = this.usuarioDB.usuario.persona.correo
    }

    if (usuarioForm.usuario.persona.celular == "") {
      usuarioForm.usuario.persona.celular = this.usuarioDB.usuario.persona.celular
    }

    if (usuarioForm.usuario.persona.cargo == "") {
      usuarioForm.usuario.persona.cargo = this.usuarioDB.usuario.persona.cargo
    }


    usuarioForm.usuarioRolId = this.usuarioDB.usuarioRolId;
    console.log(usuarioForm);

    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuariorolservice.actualizar(usuarioForm.usuarioRolId, usuarioForm)
          .subscribe((response: any) => {
            Swal.fire(
              'Usuario Modificado!',
              'El usuario ha sido modificado éxitosamente',
              'success'
            );
            this.Listado();

            this.usuarioDB = new UsuarioRol();
            this.usuarioEdit = new UsuarioRol();
          });
      } else {
        Swal.fire('Se ha cancelado la operación', '', 'info')
      }
    })
  }

}
