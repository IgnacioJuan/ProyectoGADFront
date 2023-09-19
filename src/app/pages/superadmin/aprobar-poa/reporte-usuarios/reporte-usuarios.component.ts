import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportICompetencia } from 'src/app/models/ReportICompetencia';
import { CompetenciaService } from 'src/app/services/competencia.service';

@Component({
  selector: 'app-reporte-usuarios',
  templateUrl: './reporte-usuarios.component.html',
  styleUrls: ['./reporte-usuarios.component.css'],
})
export class ReporteUsuariosComponent {
  pdfUrl!: SafeResourceUrl;
  rCompentencias!: ReportICompetencia[];

  constructor(
    private usuarioService: UsuarioService,
    private competenciaService: CompetenciaService,
    private sanitizer: DomSanitizer
  ) {
    this.cargarPDF();
    this.cargarDataRICompetencias();
  }

  cargarPDF() {
    this.usuarioService.obtenerPDF().subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const unsafeUrl = URL.createObjectURL(blob);
      console.log('Unsafe URL:', unsafeUrl);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    });
  }
  cargarDataRICompetencias() {
     this.competenciaService.obtenerReportesICompetencias().subscribe((data) => {
      this.rCompentencias = data;
      console.log('Data:', this.rCompentencias);
    });
  }
}

