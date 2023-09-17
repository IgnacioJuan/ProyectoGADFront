import { Component, OnInit, Renderer2, ElementRef, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RolService } from 'src/app/services/rol.service';
import { Usuario2 } from 'src/app/models/Usuario2';
import { Persona2 } from 'src/app/models/Persona2';
import { Rol } from 'src/app/models/Rol';
import { PersonaService } from 'src/app/services/persona.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ProgramaService } from 'src/app/services/programa.service';
import { ProgramaUsuarioDTO } from 'src/app/models/Programa';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-dialogo-uresponsables',
  templateUrl: './dialogo-uresponsables.component.html',
  styleUrls: ['./dialogo-uresponsables.component.css']
})
export class DialogoUresponsablesComponent implements OnInit, OnDestroy {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  isLinear = false;
  roles: Rol[] = [];
  programas: ProgramaUsuarioDTO[] = [];
  Programaformulario!: FormGroup;

  //Usuario logueado
  user: any = null;
  isLoggedIn = false;

  private clickListener: ((event: MouseEvent) => void) | undefined = undefined;


  constructor(
    public login: LoginService,
    private _formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private personaService: PersonaService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<DialogoUresponsablesComponent>,
    private programaService: ProgramaService,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {

  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      cedula: ['', [Validators.required, validarCedula]],
      primer_nombre: ['', [Validators.required, validarNombreApellido]],
      segundo_nombre: ['', [Validators.required, validarNombreApellido]],
      primer_apellido: ['', [Validators.required, validarNombreApellido]],
      segundo_apellido: ['', [Validators.required, validarNombreApellido]],
      celular: ['', [Validators.required, validarCelular]],
      correo: ['', [Validators.required, Validators.email]],
      cargo: ['', [Validators.required, validarNombreApellido]],
      direccion: ['', [Validators.required]],
      visible: [true]
    });

    this.secondFormGroup = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      //rol: ['', Validators.required],
      //id_programa: [null, Validators.required]
    });

    this.programaService.listar().subscribe(data => {
      this.programas = data;
      console.log(this.programas);
    });

    this.clickListener = this.documentClickListener.bind(this);
    document.addEventListener('click', this.clickListener);

    this.capturarDatosUsuarioLog();
  }

  documentClickListener(event: MouseEvent): void {
    const matDialogContainerEl: HTMLElement | null = document.querySelector('mat-dialog-container');
    if (!matDialogContainerEl) return;

    // Si el clic fue dentro del contenedor del diálogo o en un desplegable, no hacemos nada.
    if (matDialogContainerEl.contains(event.target as Node) || event.target instanceof HTMLElement && event.target.closest('mat-option')) {
      return;
    }

    // Si llegamos a este punto, el clic fue fuera del diálogo. Cerramos el diálogo.
    this.dialogRef.close();
  }


  ngOnDestroy(): void {

    // Eliminar el escuchador cuando el componente se destruye para evitar fugas de memoria
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }

  }

  // capturar los datos del usuario loggeado.
  capturarDatosUsuarioLog() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
  }

  guardarUsuario(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      console.log('Formularios válidos, procediendo a guardar...');

      const persona: Persona2 = this.firstFormGroup.value;

      this.personaService.createPersona(persona).subscribe((personaGuardada) => {
        console.log('Persona guardada correctamente:', personaGuardada);

        const usuario: Usuario2 = this.secondFormGroup.value;
        usuario.persona = personaGuardada; // Asigna la persona guardada con su ID al usuario

        // Asignar el rol id 3
        const idRol = 3;

        // Obtiene el programa al que pertenece el usuario loggeado
        console.log('Programa: ', this.user.programa);
        usuario.programa = this.user.programa;
        console.log('Usuario a guardar:', usuario);

        this.usuarioService.createResponsable(usuario, idRol).subscribe(() => {
          console.log('Usuario guardado correctamente.');
          Swal.fire('Usuario guardado', 'Usuario registrado con éxito en el sistema', 'success');
          this.dialogRef.close();

        }, (error) => {
          console.error('Error al guardar el usuario:', error);
          this.snack.open('Error al guardar el usuario', 'Aceptar', {
            duration: 3000
          });
        });
      }, (error) => {
        console.error('Error al guardar la persona:', error);
        this.snack.open('Error al guardar la persona', 'Aceptar', {
          duration: 3000
        });
      });
    } else {
      console.log('Formularios no válidos.');
      this.snack.open('Por favor, complete todos los campos requeridos', 'Aceptar', {
        duration: 3000
      });
    }
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }


  resetForm() {
    this.firstFormGroup.reset({
      cedula: '',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      celular: '',
      correo: '',
      cargo: '',
      direccion: '',
      visible: true
    });
  }


  resetForm2() {
    this.secondFormGroup.reset({
      username: '',
      password: '',
      //rol: '',
      //programa: ''
    });
  }

}

//validaciones meh
function validarCedula(control: FormControl): { [key: string]: boolean } | null {
  const cedula = control.value;
  if (!cedula.match(/^\d{10}$/)) {
    return { 'cedulaInvalida': true };
  }
  // Aquí puedes agregar la validación específica para cédulas ecuatorianas si lo necesitas.
  return null;
}

function validarNombreApellido(control: FormControl): { [key: string]: boolean } | null {
  if (control.value && (control.value.length < 3 || /\d/.test(control.value))) {
    return { 'nombreApellidoInvalido': true };
  }
  return null;
}
function validarCelular(control: FormControl): { [key: string]: boolean } | null {
  if (!control.value.match(/^\d{10}$/)) {
    return { 'celularInvalido': true };
  }
  return null;
}
