import { Component } from '@angular/core';

@Component({
  selector: 'app-aprobar-poa',
  templateUrl: './aprobar-poa.component.html',
  styleUrls: ['./aprobar-poa.component.css']
})
export class AprobarPoaComponent {
  longText = 'Algunos Detalles del POA.';

  // Arreglo de tarjetas
  allCards = [
    {
      title: 'PROPUESTA DE ESTUDIOS  Y CONSTRUCCION DE RESERVORIOS EN EL CANTON SANTA ISABEL, CON PRIORIDAD,  PARROQUIA SHAGLLI',
      subtitle: 'Dog Breed',
      content: this.longText
    },
    {
      title: 'PROPUESTA DE ESTUDIOS  Y CONSTRUCCION DE RESERVORIOS EN EL CANTON SANTA ISABEL, CON PRIORIDAD,  PARROQUIA SHAGLLI',
      subtitle: 'Dog Breed',
      content: this.longText
    },
    {
      title: 'PROPUESTA DE ESTUDIOS  Y CONSTRUCCION DE RESERVORIOS EN EL CANTON SANTA ISABEL, CON PRIORIDAD,  PARROQUIA SHAGLLI',
      subtitle: 'Dog Breed',
      content: this.longText
    },
    {
      title: 'PROPUESTA DE ESTUDIOS  Y CONSTRUCCION DE RESERVORIOS EN EL CANTON SANTA ISABEL, CON PRIORIDAD,  PARROQUIA SHAGLLI',
      subtitle: 'Dog Breed',
      content: this.longText
    },
  ];

  cardsToShow: { title: string; subtitle: string; content: string; }[] = []; // <-- Especifica el tipo aquí

  // Datos ficticios para la paginación
  totalCards = this.allCards.length; // Total de tarjetas
  pageSize = 3; // Cantidad de tarjetas por página
  pageIndex = 0; // Página actual

  constructor() {
    this.updateCardsToShow();
  }

  // Función para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateCardsToShow();
  }

  // Función para actualizar las tarjetas que se mostrarán en función de la página actual
  updateCardsToShow() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.cardsToShow = this.allCards.slice(start, end);
  }
}
