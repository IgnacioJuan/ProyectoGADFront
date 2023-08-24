import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Actividad } from 'src/app/models/Actividad';
import { AutoIndicador } from 'src/app/models/AutoridadIndicador';
import { Indicador } from 'src/app/models/Indicador';
import { CriteriosService } from 'src/app/services/criterios.service';

@Component({
  selector: 'app-consulta-actividad',
  templateUrl: './consulta-actividad.component.html',
  styleUrls: ['./consulta-actividad.component.css']
})
export class ConsultaActividadComponent implements OnInit {

  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  actividad: Actividad[] = [];

  constructor(private service: CriteriosService) { }

  ngOnInit(): void {

    this.getListar();
  }

  getListar() {
    this.service.getActividadCumplida().subscribe(
      data => {
        this.actividad = data;
      }
    )
  }

}