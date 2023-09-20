import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { PoasIndicadoresProjection } from 'src/app/interface/PoasIndicadoresProjection';
import { MetasPDOT } from 'src/app/models/MetasPDOT';
import { MetasPdotService } from 'src/app/services/metas-pdot.service';
import { PoaService } from 'src/app/services/poa.service';
import { LoginService } from 'src/app/services/login.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-repote_metas',
  templateUrl: './repote_metas.component.html',
  styleUrls: ['./repote_metas.component.css']
})
export class Repote_metasComponent implements OnInit {
   //Buscar
   filterPost: string = "";
   filteredComponentes: any[] = [];
   resultadosEncontrados: boolean = true;
  ///////
listaPoasIndicadores: PoasIndicadoresProjection[] = [];
isLoggedIn: boolean;
  user: any;

  pdfUrl!: SafeResourceUrl;

  constructor( 
       private paginatorIntl: MatPaginatorIntl,
       //importar el spinner como servicio
       private loadingService: LoadingServiceService,
       private poasService: PoaService,
       private login: LoginService,
       private sanitizer: DomSanitizer

       
) {
  this.paginatorIntl.nextPageLabel = this.nextPageLabel;
  this.paginatorIntl.lastPageLabel = this.lastPageLabel;
  this.paginatorIntl.firstPageLabel=this.firstPageLabel;
  this.paginatorIntl.previousPageLabel=this.previousPageLabel;
  this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
  this.paginatorIntl.getRangeLabel=this.rango;
  this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator || null;

}
ngOnInit(): void {
  this.login.loginStatusSubjec.asObservable().subscribe((data) => {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
  });
  this.listar();
}
@ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

//tabla
itemsPerPageLabel = 'Metas PDOT por página';
nextPageLabel = 'Siguiente';
lastPageLabel = 'Última';
firstPageLabel='Primera';
previousPageLabel='Anterior';
rango:any= (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
  return `${startIndex + 1} - ${endIndex} de ${length}`;
};
//Columnas Tabla
dataSource = new MatTableDataSource<PoasIndicadoresProjection>();

columnasUsuario: string[] = [ 'nombre_proyecto', 'tipo_periodo', 'linea_base','meta_alcanzar','meta_planificada','tipo_evaluacion', 'nombre_metapdot', 'porcentaje_cumplimiento'];
listar(): void {
 this.loadingService.show();

 this.poasService.listarPoasIndicadores().subscribe(
   (data: any[]) => {
     this.listaPoasIndicadores = data;
     console.log("listado")

     console.log(this.listaPoasIndicadores)
     this.dataSource.data = this.listaPoasIndicadores;
     this.loadingService.hide();

   },
   (error: any) => {
     console.error('Error al listar los objetivos:', error);
     this.loadingService.hide();

   }
 );
}

getColorClass(porcentaje: number): string {
 if (porcentaje < 70.0) {
   return 'rojo';
 } else if (porcentaje >= 70.0 && porcentaje <= 84.9) {
   return 'amarillo';
 } else {
   return 'verde';
 }
}
getColorClass1(porcentaje: number): string {
  if (porcentaje >= 85) {
    return 'sem-verde'; // Clase CSS para porcentaje >= 85
  } else if (porcentaje >= 70) {
    return 'sem-amarillo'; // Clase CSS para porcentaje >= 70 y < 85
  } else {
    return 'sem-rojo'; // Clase CSS para porcentaje < 70
  }
}


generarInformeTotal(): void {
  // Obtén los datos de dataSource
  const dataRows = this.dataSource.data;

  // Define el contenido del informe PDF
  const content = [];

  // Agrega la fecha de generación del PDF
  const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  content.push({
    columns: [
      {
        image: 'data:image/png;base64,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', // Reemplaza con la ruta de tu imagen
        width: 80,
        alignment: 'left',
        margin: [0, 10, 0, 10],
      },
      {
        text: `Fecha de generación: ${fechaGeneracion}`,
        alignment: 'right',
        margin: [0, 10, 10, 10],
      },
    ],
  });

  // Agrega el nombre del generador del informe (asumiendo que `user` está disponible)
  if (this.user && this.user.persona) {
    content.push({ text: `Generado por: ${this.user.persona.primer_nombre} ${this.user.persona.primer_apellido}`, alignment: 'left' });
  }

  // Agrega el título del informe
  content.push({ text: 'Informe de Cumplimiento de Metas del PDOT', style: 'titulo' });

  // Agrega la tabla de datos
  const tableData = [];

// Define un mapeo de nombres de columna a nombres de encabezado
const columnHeaderMapping: { [key: string]: string } = {
  'nombre_proyecto': 'Nombre del Proyecto',
  'tipo_periodo': 'Tipo de Período',
  'linea_base': 'Línea Base',
  'meta_alcanzar': 'Meta a Alcanzar',
  'meta_planificada': 'Meta Planificada',
  'tipo_evaluacion': 'Tipo de Evaluación',
  'nombre_metapdot': 'Nombre de la Meta PDOT',
  'porcentaje_cumplimiento': '% Cumplimiento PCM',
};

// Agrega los encabezados de la tabla con los nombres mapeados
const headerRowData: { text: string; style: string }[] = [];
this.columnasUsuario.forEach((columnName) => {
  // Usa el mapeo para obtener el nombre del encabezado
  const columnHeader = columnHeaderMapping[columnName] || columnName;
  headerRowData.push({ text: columnHeader, style: 'tabla-encabezado' });
});
tableData.push(headerRowData);

// Agrega los datos de las filas con colores según el semáforo
dataRows.forEach((rowData) => {
  const rowValues: { text: string; style?: string }[] = [];
  this.columnasUsuario.forEach((columnName) => {
    if (columnName in rowData) {
      const cellValue = rowData[columnName as keyof PoasIndicadoresProjection] !== undefined
        ? rowData[columnName as keyof PoasIndicadoresProjection].toString()
        : '';
      const cellStyle: { style?: string } = {};

      if (columnName === 'porcentaje_cumplimiento') {
        // Aplica la clase CSS según el semáforo
        const porcentajePCM = parseFloat(cellValue.replace('%', '').trim());
        cellStyle.style = this.getColorClass1(porcentajePCM);
      }

      rowValues.push({ text: cellValue, ...cellStyle });
    } else {
      rowValues.push({ text: '' }); // Agregar un valor vacío si la columna no existe en el objeto rowData
    }
  });
  tableData.push(rowValues);
});
  // Agrega los datos de la tabla al contenido del informe
  content.push({
    table: {
      headerRows: 1,
      body: tableData,
      layout: 'lightHorizontalLines',
    },
    style: 'tabla',
  });

  // Agrega el semáforo
  content.push(
    {
      text: 'Semáforo de Cumplimiento',
      style: 'text',
      fontSize: 14,
      bold: true,
      color: [0, 128, 0],  // Verde en formato RGB   
    },
    {
      text: [
        { text: 'Cumplida: 85% y el 100%', style: 'sem-verde' },
        { text: ' Parcialmente cumplida: 70% y el 84,9%', style: 'sem-amarillo' },
        { text: ' Incumplida: 0 a 69,9%', style: 'sem-rojo' },
      ],
    }
  );
// Definición de los anchos de columna deseados en puntos (1 pulgada = 72 puntos)

  // Define los estilos del documento
  const styles = {
    titulo: {
      fontSize: 24,
      bold: true,
      alignment: 'center',
      color: [0, 128, 0],  // Verde en formato RGB
    },
    tabla: {
      margin: [0, 10, 0, 10],
      fontSize: 10,
    },
    'tabla-encabezado': {
      fillColor: '#72B6FF',
      bold: true,
      color: '#FFFFFF',
      fontSize: 10,
    },
    'sem-verde': {
      color: 'green',
    },
    'sem-amarillo': {
      color: 'yellow',
    },
    'sem-rojo': {
      color: 'red',
    },
  };

  // Crea el documento PDF
  const documentDefinition: any = {
    content,
    styles,
    pageOrientation: 'portrait',
    pageMargins: [40, 40, 40, 40],
  };

  // Genera el PDF y descárgalo
  pdfMake.createPdf(documentDefinition).download('informe_metas.pdf');
}

cargarPDF() {
  this.poasService.GenerarReporte().subscribe((data) => {
    const blob = new Blob([data], { type: 'application/pdf' });
    const unsafeUrl = URL.createObjectURL(blob);
    console.log('Unsafe URL:', unsafeUrl);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  });
}
}
