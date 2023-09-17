import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repote_metas',
  templateUrl: './repote_metas.component.html',
  styleUrls: ['./repote_metas.component.css']
})
export class Repote_metasComponent implements OnInit {
  data = [
    { verde: 80, amarillo: 11, rojo: 9, subcolumna2: 'Subcolumna 1.2', subcolumna3: 'Subcolumna 1.3', columna2: 'Contenido de la Segunda Columna' },
    // Agrega más filas según sea necesario
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
