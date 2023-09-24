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
    let currentIndex = 0;
    const maxProfilesPerGroup = [3, 3, 3, 3, 2];
    for (const profilesCount of maxProfilesPerGroup) {
      const group = this.nosotros.slice(currentIndex, currentIndex + profilesCount);
      if (group.length > 0) {
        this.grupos.push(group);
        currentIndex += profilesCount;
      }
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
