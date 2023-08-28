import {Component, OnInit} from '@angular/core';
import {EjeService} from "../../../../services/eje.service";
import {Eje} from "../../../../models/eje";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ejes-lista',
  templateUrl: './ejes-lista.component.html',
  styleUrls: ['./ejes-lista.component.css']
})
export class EjesListaComponent implements OnInit{
  ejeobjeto: Eje = new Eje();
  ejeslista: Eje[] = [];
  mostrarFormulario: boolean = false;
  nombreeje = '';
  constructor(private ejeServicio:EjeService) { }

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
    console.log(this.ejeobjeto);

}
  guardarDatos(formulario: any) {
    // Aquí puedes procesar y guardar los datos ingresados en el formulario
    // formulario.value contendrá los valores ingresados
    console.log(formulario.value);
    // Puedes realizar más acciones como enviar datos al servidor, etc.
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario; // Cambia el valor para mostrar u ocultar el formulario
  }

}
