import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoacService } from 'src/app/services/poac.service';
import { AprobPoa } from 'src/app/models/AprobPoa'; // Asegúrate de importar AprobPoa

@Component({
  selector: 'app-aprobar-poa',
  templateUrl: './aprobar-poa.component.html',
  styleUrls: ['./aprobar-poa.component.css']
})
export class AprobarPoaComponent {
  responsable = 'NICOLÁS CEVALLOS CABRERA';
  longText = 'Algunos Detalles del POA.';

  allCards: AprobPoa[] = [

  ];

  cardsToShow: AprobPoa[] = [];

  totalCards = this.allCards.length;
  pageSize = 3;
  pageIndex = 0;

  constructor(private router: Router, private poacService: PoacService) {
    this.poacService.getPoaAprob().subscribe(data => {
      this.allCards = data;
      this.totalCards = this.allCards.length;
      this.updateCardsToShow();
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

}
