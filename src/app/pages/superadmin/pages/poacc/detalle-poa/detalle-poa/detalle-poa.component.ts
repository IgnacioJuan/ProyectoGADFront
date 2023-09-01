import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-detalle-poa',
  templateUrl: './detalle-poa.component.html',
  styleUrls: ['./detalle-poa.component.css']
})

export class DetallePoaComponent {
  direcciondep = new FormControl('PLANIFICACIÓN');
  responsable = new FormControl('NICOLÁS CEVALLOS CABRERA');
  areadelproyecto = new FormControl('JEFATURA DE PRODUCCION Y COMERCIALIZACIÓN');
  supervisionproyecto = new FormControl('NICOLÁS CEVALLOS CABRERA');
  denominacionprogproyecto = new FormControl('PROPUESTA DE ESTUDIOS Y CONSTRUCCION DE RESERVORIOS EN EL CANTON SANTA ISABEL CON PRIORIDAD EN LA PARROQUIA SAHGLLI');
  descripcionprogproyecto = new FormControl('4');
  nombreprogproyecto = new FormControl('PROPUESTA DE ESTUDIOS Y CONSTRUCCION DE RESERVORIOS EN EL CANTON SANTA ISABEL CON PRIORIDAD EN LA PARROQUIA SAHGLLI');
  ods = new FormControl('Objetivo 6 Agua Limpia y Saneamiento');
  objetivopnd = new FormControl('Garantizar el derecho a la salud integral, gratuita y de calidad.');
  objetivopdot = new FormControl('Lograr un manejo sostenible de los recursos naturales renovables y no renovables, minimizar los riesgos ambientales por acción natural o antrópica; mediante el uso de herramientas adecuadas para la gestión ambiental y la creación de áreas protegidas en donde se priorice la conservación sobre las actividades extractivas como la minería metálica.');
  objetivoprogproyecto = new FormControl('Promover la soberanía alimentaria en el marco de las competencias de la provincia, donde se prioricen acciones en favor de la economía campesina y local, respetando la naturaleza y la cultura de los pueblos');
  indicardemeta = new FormControl('construccion de reservorios');
  metadelprogproyecto = new FormControl('6 nuevos reservorios');
  lineabase = new FormControl('las comunidades involucradas no cuenta con reservorios');
  cobertura = new FormControl('Cantonal');
  localizacion = new FormControl('Parroquia Shaglli');
  barrio = new FormControl('Páramo');
  comunidad = new FormControl('terrenos comunales y diversos propietarios');

   // Nuevas propiedades para la nueva tabla
    displayedColumns: string[] = ['position', 'name', 'objetivo', 'meta', 'ver', 'acciones', 'actividades'];
    dataSource = ELEMENT_DATA;  // Puedes modificar ELEMENT_DATA para que contenga las propiedades 'objetivo', 'meta', 'ver', 'acciones', y 'actividades'.
}


