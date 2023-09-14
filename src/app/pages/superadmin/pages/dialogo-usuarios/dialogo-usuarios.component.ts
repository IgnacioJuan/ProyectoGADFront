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
import { CrearUsuariosComponent } from '../crear-usuarios/crear-usuarios.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ProgramaService } from 'src/app/services/programa.service';
import { ProgramaUsuarioDTO } from 'src/app/models/Programa';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-dialogo-usuarios',
  templateUrl: './dialogo-usuarios.component.html',
  styleUrls: ['./dialogo-usuarios.component.css']
})
export class DialogoUsuariosComponent implements OnInit, OnDestroy {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  isLinear = false;
  roles: Rol[] = [];
  programas: ProgramaUsuarioDTO[] = [];
  Programaformulario!: FormGroup;
  
  private clickListener: ((event: MouseEvent) => void) | undefined = undefined;


  constructor(
    private _formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private personaService: PersonaService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<DialogoUsuariosComponent>,
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
      rol: ['', Validators.required],
      id_programa: [null, Validators.required]
    });

    this.programaService.listar().subscribe(data => {
      this.programas = data;
      console.log(this.programas);
    });

    this.clickListener = this.documentClickListener.bind(this);
    document.addEventListener('click', this.clickListener);
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

  guardarUsuario(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {

      const persona: Persona2 = this.firstFormGroup.value;

      this.personaService.createPersona(persona).subscribe((personaGuardada) => {
        const usuario: Usuario2 = this.secondFormGroup.value;
        usuario.persona = personaGuardada; // Asigna la persona guardada con su ID al usuario

        // Obtiene el rol seleccionado
        const rolControl = this.secondFormGroup.get('rol');
        const idRol = rolControl ? rolControl.value : null;

        // Obtiene el programa seleccionado

        const programaControl = this.secondFormGroup.get('id_programa');
        const programaSeleccionado = programaControl ? programaControl.value : null;
        console.log(programaSeleccionado);
        usuario.programa = programaSeleccionado;
        console.log(usuario);


        this.usuarioService.createUsuario(usuario, idRol).subscribe(() => {
          Swal.fire('Usuario guardado', 'Usuario registrado con éxito en el sistema', 'success');
          this.dialogRef.close();

        }, (error) => {
          console.error(error);
          this.snack.open('Error al guardar el usuario', 'Aceptar', {
            duration: 3000
          });
        });
      }, (error) => {
        console.error(error);
        this.snack.open('Error al guardar la persona', 'Aceptar', {
          duration: 3000
        });
      });
    } else {
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
      rol: '',
      programa: ''
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
