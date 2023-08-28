import {Component, ElementRef, OnInit} from '@angular/core';
import {EjeService} from "../../../../services/eje.service";
import {Eje} from "../../../../models/eje";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {Componentes} from "../../../../models/Componentes";
import {ComponentesService} from "../../../../services/componentes.service";

@Component({
  selector: 'app-ejes-lista',
  templateUrl: './ejes-lista.component.html',
  styleUrls: ['./ejes-lista.component.css']
})
export class EjesListaComponent implements OnInit{
  ejeobjeto: Eje = new Eje();
  ejeslista: Eje[] = [];

  ejeForm: FormGroup;
  public Ejechose = new Eje();
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  listaComponentes: Componentes[] = [];

  mostrarFormulario: boolean = false;
  nombreeje = '';
  constructor(private ejeServicio:EjeService,private formBuilder: FormBuilder) {
    this.ejeForm = this.formBuilder.group({
      nombre: ['', Validators.required]// Define los controles aquí
    });
  }

  //aqui esta el on init para cosas que se carguen al iniciar el programa
  ngOnInit(): void {
    this.obtenerejes();


  }

  private obtenerejes(){
    this.ejeServicio.obtenerListaejes().subscribe(dato => {
      this.ejeslista = dato;
    });
  }
guardareje(){
  this.ejeobjeto = this.ejeForm.value;
  //console.log(this.ejeobjeto);
  this.ejeServicio.crearejes(this.ejeobjeto)
    .subscribe(
      (response) => {
        console.log('eje creado con éxito:', response);
        this.guardadoExitoso = true;
        this.obtenerejes();
        Swal.fire(
          'Exitoso',
          'Se ha completado el registro con exito',
          'success'
        )
      },
      (error) => {
        console.error('Error al crear el EJE:', error);
        Swal.fire(
          'Error',
          'Ha ocurrido un error',
          'warning'
        )
      }
    );
}


  eliminareje(seleccion: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.ejeServicio.eliminareje(seleccion).subscribe(
          (response) => {
            this.obtenerejes();
            Swal.fire('Eliminado!', '', 'success')
          }
        );
      }
    })

  }


  editDatoseje(componente: Eje) {
    this.Ejechose = componente;
    this.ejeForm = new FormGroup({
      nombre: new FormControl(componente.nombre)
    });
  }

}
