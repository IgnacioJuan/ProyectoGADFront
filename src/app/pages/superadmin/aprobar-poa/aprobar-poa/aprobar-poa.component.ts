import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoacService } from 'src/app/services/poac.service';
import { AprobPoa } from 'src/app/models/AprobPoa';
import { DatePipe } from '@angular/common';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';

@Component({
  selector: 'app-aprobar-poa',
  templateUrl: './aprobar-poa.component.html',
  styleUrls: ['./aprobar-poa.component.css'],
})
export class AprobarPoaComponent {
  allCards: AprobPoa[] = [];
  cardsToShow: AprobPoa[] = [];
  totalCards = this.allCards.length;
  pageSize = 3;
  pageIndex = 0;

  constructor(
    private router: Router,
    private poacService: PoacService,
    private loadingService: LoadingServiceService,
    private datePipe: DatePipe
  ) {
    this.loadingService.show();
    this.loadData();
 
  }

  loadData() {
    this.poacService.getPoaAprob().subscribe((data) => {
      this.allCards = data;
      this.totalCards = this.allCards.length;
      this.updateCardsToShow();
      this.loadingService.hide();
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateCardsToShow();
  }

  updateCardsToShow() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.cardsToShow = this.allCards.slice(start, end);
  }
  // Modifica el método redirectToDetails para aceptar el ID del POA
  redirectToDetails(id_Poa: number) {
    this.router.navigate(['/sup/aprobacion-poa/detalle-poa', id_Poa]);
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    if (!value) {
      this.updateCardsToShow(); // Si no hay valor en el input, muestra todas las tarjetas
      return;
    }

    value = value.toLowerCase(); // Convertir el valor a minúsculas para la búsqueda

    this.cardsToShow = this.allCards.filter((card) => {
      const formattedDate = this.datePipe.transform(
        card.fecha_inicio,
        'dd/MM/yyyy'
      ); // Convertir la fecha a string
      return (
        card.nombre_proyecto.toLowerCase().includes(value) 
      ); // Aplica el filtro en la fecha convertida
    });
  }
}
