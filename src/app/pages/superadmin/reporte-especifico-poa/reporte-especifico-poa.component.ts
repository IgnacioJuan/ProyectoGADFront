import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoaService } from 'src/app/services/poa.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { Proyecto } from 'src/app/models/Proyecto';
import { AprovacionPoa } from 'src/app/models/aprovacion-poa';
import { AprobacionPoaService } from 'src/app/services/aprobacion-poa.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IndicadorService } from 'src/app/services/indicador.service';
import { Indicadores } from 'src/app/models/Indicadores';


@Component({
  selector: 'app-reporte-especifico-poa',
  templateUrl: './reporte-especifico-poa.component.html',
  styleUrls: ['./reporte-especifico-poa.component.css']
})
export class ReporteEspecificoPoaComponent implements OnInit {
  @ViewChild("chart")
  chart: any;
  id_poa: any;
 id_proyec:any;
  proyectoDelPoa: Proyecto | null = null;
  aprovacionPoa: AprovacionPoa[] = [];
  indi: Indicadores[] = [];
  result :any;
  indiPro:any;
  metaindi:any;

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectoService,
    private poaService: PoaService,
    private aproPoaService: AprobacionPoaService,
    private indicadoresService:IndicadorService
  ) {}

  ngOnInit(): void {
    this.recibePoa();
    //this.listindicadores();
  }

  recibePoa() {
    this.route.paramMap.subscribe(params => {
      this.id_proyec= params.get('id');
      console.log('ID de POA seleccionado:', this.id_proyec);
      this.listarAprovacionPoa();
    });
  }

  // Listar Asignación deL poa
  listarAprovacionPoa() {
    this.aproPoaService.getAprobacionPoa().subscribe(data => {
      this.aprovacionPoa = data;
      console.log(this.aprovacionPoa, "lista aprobación poa");
      this.buscarProyectosRelacionados();
    });
  }

  listindicadores(){
    this.indicadoresService.listar().subscribe(data=>{
      this.result=data;
     

    });

  };

indiacdorPorProyecto() {
  const idsProyectos: number[] = this.result.map((proyecto: any) => proyecto.id_proyecto);
//listar los indicdores que pertenecen al proyecto del poa selecionado
  this.indicadoresService.listarIndicadoresPorProyectos(idsProyectos)
    .subscribe(data => {
      this.indiPro = data;
      
      // Obtener las metas asociadas a los indicadores
      const metasDeIndicadores :any = this.indiPro.map((indicador: any) => indicador.metapdot);
     
      
      console.log('Indicadores por proyectos:', this.indiPro);
      console.log('Metas asociadas a los indicadores:', metasDeIndicadores);
     // this.createChart();
      
    }, error => {
      console.error('Error al obtener los indicadores por proyectos:', error);
    });
}

  

  buscarProyectosRelacionados(): void {
    // Filtra la lista de aprobaciónPoa para encontrar los elementos que coinciden con el ID del POA
    const poaId = parseInt(this.id_proyec); // Convierte el ID de POA a número si es necesario
    const poasRelacionados:any = this.aprovacionPoa
      .filter(ap => ap.proyecto?.id_proyecto === poaId)
      .map(ap => ap.poa?.id_poa);

    if (poasRelacionados.length > 0) {
      // Utiliza los IDs de proyecto para obtener los proyectos relacionados
      this.poaService.buscarPoasPorIds(poasRelacionados).subscribe(
        proyectos => {
          // Ahora, tienes la lista de proyectos relacionados con el POA seleccionado
          this.result=proyectos;
          console.log('Poas relacionados:', this.result);
          this.indiacdorPorProyecto();

          this.createChart();
        },
        error => {
          console.error('Error al obtener los poas', error);
        }
      );
    } else {
      console.error('No se encontraron elementos de AprobaciónPoa para el ID de POA:', poaId);
    }
  }

    
  
  
    countindi(){
       // Supongamos que tienes una variable "meta" que contiene la meta específica a la que deseas contar los indicadores.
const metaId = this.result.MetasPDOT.id_meta_pdot; // Obtén el ID de la meta específica

// Luego, filtra los indicadores que pertenecen a esta meta.
const indicadoresDeLaMeta = this.result.filter((indicador :any) => indicador.MetasPDOT?.id_meta_pdot === metaId);

// Ahora, puedes obtener la cantidad de indicadores que pertenecen a la meta.
const cantidadIndicadoresEnMeta = indicadoresDeLaMeta.length;

console.log(`La cantidad de indicadores en la meta con ID ${metaId} es: ${cantidadIndicadoresEnMeta}`);

    }
 
  
  
    ///Grafica del pastel
    // GraficaPastel() {
  
  
  
    //   this.chart = new Chart("pastel", {
    //     type: 'pie',
    //     data: {
    //       labels: ['Menor o igual al 25%', 'Mayor al 25% y menor o igual al 50%', 'Mayor al 50% y menor al 75%', 'Mayor al 75%'],
    //       datasets: [
    //         {
    //           label: "Porcentaje de logro",
    //           data: [
    //             this.dataSource.filter((indicador: any) => indicador.porc_obtenido <= 25).length,
    //             this.dataSource.filter((indicador: any) => indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50).length,
    //             this.dataSource.filter((indicador: any) => indicador.porc_obtenido > 50 && indicador.porc_obtenido < 75).length,
    //             this.dataSource.filter((indicador: any) => indicador.porc_obtenido >= 75).length
    //           ],
    //           backgroundColor: ['red', 'orange', 'yellow', 'green']
    //         }
    //       ]
    //     },
    //     options: {
    //       aspectRatio: 2.5
    //     }
    //   });
  
  
  
    // }
  
    //Grafica de barras
    createChart() {
      const labels = this.result.map((apro: any) => apro.id_poa);
      const promedioProyecto = this.result.map((apro: any) => apro.meta_alcanzar);
    
      const filteredLabels = labels.filter((label: any, index: any) => labels.indexOf(label) === index).slice(0, 15);
    
      this.chart = new Chart("MyChart", {
        type: 'bar',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: "Promedio mayor a 75",
              data: filteredLabels.map((label: string, index: number) => {
                const promedio = promedioProyecto[index];
                return promedio > 75 ? promedio : null;
              }),
              backgroundColor: 'green'
            },
            {
              label: "Promedio mayor a 50 y menor igual a 75",
              data: filteredLabels.map((label: string, index: number) => {
                const promedio = promedioProyecto[index];
                return promedio <= 75 && promedio > 50 ? promedio : null;
              }),
              backgroundColor: 'Yellow'
            },
            {
              label: "Promedio mayor a 25 menor a 50 ",
              data: filteredLabels.map((label: string, index: number) => {
                const promedio = promedioProyecto[index];
                return promedio > 25 && promedio <= 50 ? promedio : null;
              }),
              backgroundColor: 'orange'
            },
            {
              label: "Promedio menor a 25%",
              data: filteredLabels.map((label: string, index: number) => {
                const promedio = promedioProyecto[index];
                return promedio < 25 ? promedio : null;
              }),
              backgroundColor: 'red'
            }
          ]
        },
        options: {
          aspectRatio: 2.5,
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'end',
              color: 'black',
              font: {
                weight: 'bold'
              },
              formatter: function (value: any) {
                return value !== null ? value + '%' : ''; // Formatea el valor con un signo de porcentaje
              }
            }
          }
        }
      });
    }
    
    
    

  
}
