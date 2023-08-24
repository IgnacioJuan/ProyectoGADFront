import { Component, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Actividades } from 'src/app/models/actividades';
import { usuario } from 'src/app/models/Usuario';
import { EvidenciaService } from 'src/app/services/evidencia.service';
@Component({
  selector: 'app-actividad-autoridad',
  templateUrl: './actividad-autoridad.component.html',
  styleUrls: ['./actividad-autoridad.component.css']
})
export class ActividadAutoridadComponent {
  constructor(private serEvide:EvidenciaService, private services: ActividadService, private router: Router,
    private fb: FormBuilder) { }

    searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
    searchTerm: string = '';
    public actividades: Actividades[] = [];
    responsable:usuario[]=[];
    public actividad = new Actividades();
    filteredActividades: usuario[] | undefined;
  ngOnInit(): void {
    //this.get();
    this.getResponsables();
  }

  get() {
    this.services.get().subscribe((actividades) => {
      this.actividades = actividades;
      this.filterActividades(); // <-- Actualización aquí
    });
//    this.services.get()
  ///(())    .subscribe(response => this.actividades = response);
  }

  getResponsables(){
    this.serEvide.listarUsuarioRes().subscribe(
      data =>{
        this.responsable=data;
        this.filterActividades();
        //console.log(this.responsable);
      }
    )
  }

  listaAct(usu:usuario){
    this.services.getActByUsua(usu.id).subscribe(
      data => {
        this.actividades=data;
        console.log(this.actividades);
      }
    )
  }

  filterActividades() {
    this.filteredActividades = this.responsable.filter(
      (actividad) =>
        actividad.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        actividad.persona.primer_nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
