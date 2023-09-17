import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-reporte-usuarios',
  templateUrl: './reporte-usuarios.component.html',
  styleUrls: ['./reporte-usuarios.component.css']
})
export class ReporteUsuariosComponent {
  pdfUrl: any;

  constructor(private usuarioService: UsuarioService) {
    this.usuarioService.obtenerPDF().subscribe(data => {
      const blob = new Blob([data], { type: 'application/pdf' });
      this.pdfUrl = URL.createObjectURL(blob);
    });
  }
   
}
