import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { UsuariorolService } from 'src/app/services/usuariorol.service';
import { Usuario2 } from 'src/app/models/Usuario2';
import { Persona2 } from 'src/app/models/Persona2';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioResponsableDTO } from 'src/app/models/UsuarioResponsableDTO';
import { DialogoUresponsablesComponent } from '../dialogo-uresponsables/dialogo-uresponsables.component';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-crear-responsables',
  templateUrl: './crear-responsables.component.html',
  styleUrls: ['./crear-responsables.component.css'],
})
export class CrearResponsablesComponent implements OnInit {
  listaPersonas: Persona2[] = [];
  listaUsuarios: UsuarioResponsableDTO[] = [];
  filterPost = '';
  usuarioBase = new Usuario2();
  usuarioEdit = new Usuario2();
  user: any = null;
  isLoggedIn = false;
  public usuario = {
    username: '',
    password: '',
  };
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

  dataSource2 = new MatTableDataSource<UsuarioResponsableDTO>();
  columnasUsuarioResponsable: string[] = [
    'primer_nombre',
    'primer_apellido',
    'usuario',
    'programa',
    'cargo',
    'actions',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild('modal') modal: any;
  constructor(
    public dialog: MatDialog,
    private personaService: PersonaService,
    private usuariosService: UsuarioService,
    private paginatorIntl: MatPaginatorIntl,
    private usuariorolservice: UsuariorolService,
    private loadingService: LoadingServiceService,
    public login: LoginService
  ) {
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
    this.capturarDatosUsuarioLog();
    this.Listado();
  }

  capturarDatosUsuarioLog() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
  }

  Listado() {
    console.log('LISTADO', this.user.programa.id_programa);
    this.loadingService.show();
    this.personaService
      .getPersonas()
      .subscribe((listaPerso) => (this.listaPersonas = listaPerso));
  
    this.usuariorolservice.getuResponsables(this.user.programa.id_programa).subscribe((listaAsig: any[]) => {
      this.listaUsuarios = listaAsig;
      this.dataSource2.data = this.listaUsuarios;
      console.log(listaAsig);
      this.loadingService.hide();
    });
  }

  openDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogoUresponsablesComponent, {
      width: '50%',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Listado();
      this.loadingService.hide();
    });
  }

  eliminar(element: any) {
    this.loadingService.show();
    const id = element.id_usuario_responsable;
    this.loadingService.hide();
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
        this.loadingService.show();
        this.usuariosService.eliminarUsuarioLogic(id).subscribe((response) => {
          this.loadingService.hide();
        });
        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
        this.Listado();
      }
    });
  }

  editarUsuari(userId: number): void {
    this.loadingService.show();
    if (userId) {
      this.usuariosService
        .obtenerUsuarioResponsable(userId)
        .subscribe((data) => {
          this.usuarioBase = data;
          this.loadingService.hide();
          console.log(this.usuarioBase);
        });
    }
  }
  // this.usuarioEdit es el usuario que recibo del formulario
  Actualizar() {
    this.loadingService.show();
    
    if (this.usuarioEdit.password == '') {
      this.usuarioEdit.password = this.usuarioBase.password;
    }
    if (this.usuarioEdit.username == '') {
      this.usuarioEdit.username = this.usuarioBase.username;
    }

    if (this.usuarioEdit.persona.cedula == '') {
      this.usuarioEdit.persona.cedula = this.usuarioBase.persona.cedula;
    }

    if (this.usuarioEdit.persona.primer_nombre == '') {
      this.usuarioEdit.persona.primer_nombre =
        this.usuarioBase.persona.primer_nombre;
    }

    if (this.usuarioEdit.persona.primer_apellido == '') {
      this.usuarioEdit.persona.primer_apellido =
        this.usuarioBase.persona.primer_apellido;
    }

    if (this.usuarioEdit.persona.segundo_nombre == '') {
      this.usuarioEdit.persona.segundo_nombre =
        this.usuarioBase.persona.segundo_nombre;
    }

    if (this.usuarioEdit.persona.segundo_apellido == '') {
      this.usuarioEdit.persona.segundo_apellido =
        this.usuarioBase.persona.segundo_apellido;
    }

    if (this.usuarioEdit.persona.direccion == '') {
      this.usuarioEdit.persona.direccion = this.usuarioBase.persona.direccion;
    }

    if (this.usuarioEdit.persona.correo == '') {
      this.usuarioEdit.persona.correo = this.usuarioBase.persona.correo;
    }

    if (this.usuarioEdit.persona.celular == '') {
      this.usuarioEdit.persona.celular = this.usuarioBase.persona.celular;
    }

    if (this.usuarioEdit.persona.cargo == '') {
      this.usuarioEdit.persona.cargo = this.usuarioBase.persona.cargo;
    }

    this.usuarioEdit.id = this.usuarioBase.id;
    console.log('USUARIO ACTUALIZADOOOOO:', this.usuarioEdit);
    this.loadingService.hide();
    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      this.loadingService.show();
      if (result.isConfirmed) {
        this.usuariosService
          .actualizarResponsable(this.usuarioEdit.id, this.usuarioEdit)
          .subscribe((response) => {
            Swal.fire(
              'Usuario Modificado!',
              'El usuario ha sido modificado éxitosamente',
              'success'
            );
            this.loadingService.hide();
            this.Listado();
            console.log(response);
            this.usuarioEdit = new Usuario2();
            this.usuarioBase = new Usuario2();
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
          usuario.primer_nombre?.toLowerCase().includes(value) ||
          usuario.segundo_nombre?.toLowerCase().includes(value) ||
          usuario.primer_apellido?.toLowerCase().includes(value) ||
          usuario.segundo_apellido?.toLowerCase().includes(value) ||
          usuario.usuario?.toLowerCase().includes(value) ||
          usuario.programa?.toLowerCase().includes(value) ||
          usuario.cargo?.toLowerCase().includes(value)
        );
      });
    }
    this.dataSource2._updateChangeSubscription();
  }
}