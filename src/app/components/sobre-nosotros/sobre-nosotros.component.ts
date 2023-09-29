import { Component, OnInit } from '@angular/core';
import { datos } from './sobre-nosotros.json';

@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent implements OnInit{
  
  nosotros = datos as any[]; 
  grupos: any[][] = [];
  
  constructor() {
    const profilesPerGroup = 3;
    let currentIndex = 0;
    
    while (currentIndex < this.nosotros.length) {
      const group = this.nosotros.slice(currentIndex, currentIndex + profilesPerGroup);
      this.grupos.push(group);
      currentIndex += profilesPerGroup;
    }
  }

  ngOnInit(): void {
  }

  redireccionar(enlace: string | undefined) {
    if (enlace) {
      window.open(enlace, '_blank');
    } else {
      window.location.href = '/sobre-nosotros';
    }
  }
}
