import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface PeriodicElement {
  responsable: string;
  cargo: string;
  nactividades: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { responsable: 'dfghj', cargo: 'Hydrogen', nactividades: 1 },
  { responsable: 'fghjkl', cargo: 'Helium', nactividades: 4 },
  { responsable: 'fghjk', cargo: 'Lithium', nactividades: 6 },
  { responsable: 'fghjk', cargo: 'Beryllium', nactividades: 9 },
  { responsable: 'ghjk', cargo: 'Boron', nactividades: 10 }
]
@Component({
  selector: 'app-visualizar-actividades',
  templateUrl: './visualizar-actividades.component.html',
  styleUrls: ['./visualizar-actividades.component.css']
})
export class VisualizarActividadesComponent {

  constructor() { }


  // Nuevas propiedades para la nueva tabla
  displayedColumns: string[] = ['responsable', 'cargo', 'nactividades'];
  dataSource = ELEMENT_DATA;
}
