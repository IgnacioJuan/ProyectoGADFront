import { Component, ViewChild, ElementRef } from '@angular/core';
import { Criterio } from 'src/app/models/Criterio';
import { Indicador } from 'src/app/models/Indicador';
import { CriteriosService } from 'src/app/services/criterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-criterio-reporte',
  templateUrl: './criterio-reporte.component.html',
  styleUrls: ['./criterio-reporte.component.css']
})
export class CriterioReporteComponent {

  searchText = '';
  constructor(
    private indicadorservice: IndicadoresService,
    private criterioservice: CriteriosService,
  ) {
  }
  ngOnInit() {
    this.listar()
  }

  buscar = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  miModal!: ElementRef;
  public indic = new Indicador();
  indicadors: any[] = [];
  criterios: any[] = [];
  listar(): void {
    this.indicadorservice.indicadoresPorCriterios([]).subscribe(
      (data: Indicador[]) => {
        this.indicadors = data;
        this.listarcriterio();
      },
      (error: any) => {
        console.error('Error al listar los indicadors:', error);
      }
    );
  }
  listarcriterio(): void {
    this.criterioservice.getCriteriosUltimoModelo().subscribe(
      (data: Criterio[]) => {
        // Agregar opción inicial "Seleccione todos"
        this.criterios = data;
      },
      (error: any) => {
        console.error('Error al listar los criterios:', error);
      }
    );
  }
  public criteriosSeleccionados: Criterio[] = [];

  toggleCriterioSelection(criterio: Criterio) {
    if (this.isCriterioSelected(criterio)) {
      this.criteriosSeleccionados = this.criteriosSeleccionados.filter((c) => c.id_criterio !== criterio.id_criterio);
    } else {
      this.criteriosSeleccionados.push(criterio);
    }
  }

  isCriterioSelected(criterio: Criterio) {
    return this.criteriosSeleccionados.some((c) => c.id_criterio === criterio.id_criterio);
  }
  public buscarPorCriterio(): void {
    if (this.criteriosSeleccionados.length === 0) {
      this.listar();
    } else {
      const idsCriterios = this.criteriosSeleccionados.map((criterio) => criterio.id_criterio);
      this.indicadorservice.indicadoresPorCriterios(idsCriterios).subscribe(
        (data: Indicador[]) => {
          this.indicadors = data;
        },
        (error: any) => {
          console.error('Error al buscar los indicadores por criterio:', error);
        }
      );
    }
  }

  generarInforme(): void {
    const content = [];
  // Agrega la fecha de generación del PDF
  const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  content.push({ text: `Fecha de generación: ${fechaGeneracion}`, alignment: 'right' });

    // Agrega el título
    content.push({ text: 'Reporte por Criterio', style: 'titulo' });
    content.push({ text: '\n' });
  
    // Crea la tabla de datos
    const tableData = [];
    
    // Estilo para las cabeceras de la tabla
    const headerStyle = {
      fillColor: '#72B6FF', // Color de fondo
      bold: true, // Negrita
      color: '#FFFFFF', // Color de texto
    };
    const criteriosUnicos = Array.from(
      new Set(this.indicadors.map((indicador) => indicador.subcriterio.criterio.nombre))
    );
    criteriosUnicos.forEach((criterio) => {
      const indicadoresCriterio = this.indicadors.filter(
        (indicador) => indicador.subcriterio.criterio.nombre === criterio
      );
    
      // Genera la tabla para el criterio actual
      const tableDataCriterio = [];
      tableDataCriterio.push([
        { text: 'SUBCRITERIO', style: headerStyle },
        { text: 'INDICADOR', style: headerStyle },
        { text: 'DESCRIPCIÓN', style: headerStyle },
        { text: 'VALOR OBTENIDO', style: headerStyle },
        { text: 'PORCENTAJE OBTENIDO', style: headerStyle },
        { text: 'PORCENTAJE UTILIDAD', style: headerStyle },
      ]);
    
      indicadoresCriterio.forEach((indicador, index) => {
        const rowStyle = index % 2 === 0 ? { fillColor: '#F2F2F2' } : {}; // Colores intercalados
    
        tableDataCriterio.push([
          { text: indicador.subcriterio.nombre, style: rowStyle },
          { text: indicador.nombre, style: rowStyle },
          { text: indicador.descripcion, style: rowStyle },
          { text: indicador.valor_obtenido, style: rowStyle },
          { text: indicador.porc_obtenido, style: rowStyle },
          { text: indicador.porc_utilida_obtenida, style: rowStyle },
        ]);
      });
    
      // Agrega la tabla al contenido del informe
      content.push({
        text: ' - Criterio: '+criterio,
        style: 'subtitulo',
      });
      content.push({
        table: {
          headerRows: 1,
          body: tableDataCriterio,
        },
        style: 'tabla',
      });
    });
    const footer = function (currentPage: number, pageCount: number) {
      return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center' };
    };
  
    
    
    const styles = {
      titulo: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subtitulo: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tabla: {
        margin: [0, 10, 0, 10],
      },
    };
  
    // Crea el documento PDF
    const documentDefinition:any = {
      content,
      styles,
      pageOrientation: 'landscape',
    };
  
    // Genera el PDF y descárgalo
    pdfMake.createPdf(documentDefinition).download('informe.pdf');
  }
  

}
