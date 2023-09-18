import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reporte-usuarios',
  templateUrl: './reporte-usuarios.component.html',
  styleUrls: ['./reporte-usuarios.component.css'],
})
export class ReporteUsuariosComponent {
  pdfUrl!: SafeResourceUrl;

  constructor(
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer
  ) {
    this.cargarPDF();
  }

  cargarPDF() {
    this.usuarioService.obtenerPDF().subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const unsafeUrl = URL.createObjectURL(blob);
      console.log('Unsafe URL:', unsafeUrl);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    });
  }
}

