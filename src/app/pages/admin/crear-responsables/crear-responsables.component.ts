import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioRol } from 'src/app/models/UsuarioRol';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
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
import { MatDialog } from '@angular/material/dialog';
import { ProgramaUsuarioDTO } from 'src/app/models/Programa';
import { ProgramaService } from 'src/app/services/programa.service';
import { UsuarioResponsableDTO } from 'src/app/models/UsuarioResponsableDTO';
import { DialogoUresponsablesComponent } from '../dialogo-uresponsables/dialogo-uresponsables.component';
import { response } from 'express';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';


let ELEMENT_DATA: Fenix[] = [];

@Component({
  selector: 'app-crear-responsables',
  templateUrl: './crear-responsables.component.html',
  styleUrls: ['./crear-responsables.component.css']
})
export class CrearResponsablesComponent implements OnInit {

  fenix: Fenix = new Fenix();

  listaPersonas: Persona2[] = [];

  listaUsuarios: UsuarioResponsableDTO[] = [];
  filterPost = '';
  personaSele = new Persona2();
  usuarioBase = new Usuario2();
  usuarioEdit = new Usuario2();

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
  //
  public usuario = {
    username: '',
    password: ''
  }

  dataSource2 = new MatTableDataSource<UsuarioResponsableDTO>();
  columnasUsuarioResponsable: string[] = ['primer_nombre', 'primer_apellido', 'usuario', 'programa', 'cargo', 'actions'];
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
    private loadingService: LoadingServiceService

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
    this.Listado();
  }

  Listado() {

    this.personaService.getPersonas().subscribe(
      listaPerso => this.listaPersonas = listaPerso
    );

    this.usuariorolservice.getuResponsables().subscribe(
      (listaAsig: any[]) => {
        this.listaUsuarios = listaAsig;
        this.dataSource2.data = this.listaUsuarios;
        console.log(listaAsig)
      }
    );
  }

  openDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogoUresponsablesComponent, {
      width: '50%',
      disableClose: false
    });

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

  // CODIGO PARA BUSCAR POR PARAMETROS
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


  eliminar(element: any) {
    const id = element.id_usuario_responsable;

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


  editarUsuari(userId: number): void {
    if (userId) {
      this.usuariosService.obtenerUsuarioResponsable(userId).subscribe(
        (data) => {
          this.usuarioBase = data;
          console.log(this.usuarioBase);
        });
    }
  }

  // this.usuarioEdit es el usuario que recibo del formulario 
  Actualizar() {

    if (this.usuarioEdit.password == "") {
      this.usuarioEdit.password = this.usuarioBase.password
    }
    if (this.usuarioEdit.username == "") {
      this.usuarioEdit.username = this.usuarioBase.username
    }

    if (this.usuarioEdit.persona.cedula == "") {
      this.usuarioEdit.persona.cedula = this.usuarioBase.persona.cedula
    }

    if (this.usuarioEdit.persona.primer_nombre == "") {
      this.usuarioEdit.persona.primer_nombre = this.usuarioBase.persona.primer_nombre
    }

    if (this.usuarioEdit.persona.primer_apellido == "") {
      this.usuarioEdit.persona.primer_apellido = this.usuarioBase.persona.primer_apellido
    }

    if (this.usuarioEdit.persona.segundo_nombre == "") {
      this.usuarioEdit.persona.segundo_nombre = this.usuarioBase.persona.segundo_nombre
    }

    if (this.usuarioEdit.persona.segundo_apellido == "") {
      this.usuarioEdit.persona.segundo_apellido = this.usuarioBase.persona.segundo_apellido
    }

    if (this.usuarioEdit.persona.direccion == "") {
      this.usuarioEdit.persona.direccion = this.usuarioBase.persona.direccion
    }

    if (this.usuarioEdit.persona.correo == "") {
      this.usuarioEdit.persona.correo = this.usuarioBase.persona.correo
    }

    if (this.usuarioEdit.persona.celular == "") {
      this.usuarioEdit.persona.celular = this.usuarioBase.persona.celular
    }

    if (this.usuarioEdit.persona.cargo == "") {
      this.usuarioEdit.persona.cargo = this.usuarioBase.persona.cargo
    }

    this.usuarioEdit.id = this.usuarioBase.id;
    console.log('USUARIO ACTUALIZADOOOOO:',this.usuarioEdit);


    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuariosService.actualizarResponsable(this.usuarioEdit.id, this.usuarioEdit)
          .subscribe((response: any) => {
            Swal.fire(
              'Usuario Modificado!',
              'El usuario ha sido modificado éxitosamente',
              'success'
            );
            this.Listado();
            console.log(response);
            this.usuarioBase = new Usuario2();
            this.usuarioEdit = new Usuario2();
          });
      } else {
        Swal.fire('Se ha cancelado la operación', '', 'info')
      }
    })
  }

}