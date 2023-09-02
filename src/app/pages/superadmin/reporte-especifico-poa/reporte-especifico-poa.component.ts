import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoaService } from 'src/app/services/poa.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { Proyecto } from 'src/app/models/Proyecto';
import { AprovacionPoa } from 'src/app/models/aprovacion-poa';
import { AprobacionPoaService } from 'src/app/services/aprobacion-poa.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reporte-especifico-poa',
  templateUrl: './reporte-especifico-poa.component.html',
  styleUrls: ['./reporte-especifico-poa.component.css']
})
export class ReporteEspecificoPoaComponent implements OnInit {
  @ViewChild("chart")
  chart: any;
  id_poa: any; // Declarar una variable para almacenar el id_poa
  proyectoDelPoa: Proyecto | null = null;
  aprovacionPoa: AprovacionPoa[] = [];

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectoService,
    private poaService: PoaService,
    private aproPoaService: AprobacionPoaService
  ) {}

  ngOnInit(): void {
    this.recibePoa();
  }

  recibePoa() {
    this.route.paramMap.subscribe(params => {
      this.id_poa = params.get('id');
      console.log('ID de POA seleccionado:', this.id_poa);
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

  buscarProyectosRelacionados(): void {
    // Filtra la lista de aprobaciónPoa para encontrar los elementos que coinciden con el ID del POA
    const poaId = parseInt(this.id_poa); // Convierte el ID de POA a número si es necesario
    const proyectosRelacionados:any = this.aprovacionPoa
      .filter(ap => ap.poa?.id_poa === poaId)
      .map(ap => ap.proyecto?.id_proyecto);

    if (proyectosRelacionados.length > 0) {
      // Utiliza los IDs de proyecto para obtener los proyectos relacionados
      this.proyectoService.buscarProyectosPorIds(proyectosRelacionados).subscribe(
        proyectos => {
          // Ahora, tienes la lista de proyectos relacionados con el POA seleccionado
          console.log('Proyectos relacionados:', proyectos);
        },
        error => {
          console.error('Error al obtener los proyectos:', error);
        }
      );
    } else {
      console.error('No se encontraron elementos de AprobaciónPoa para el ID de POA:', poaId);
    }
  }

  
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

  // createChart() {

  //   const promediosPorCriterio: { [criterio: string]: number } = {};
  //   const conteoIndicadoresPorCriterio: { [criterio: string]: number } = {};

  //   this.dataSource.forEach((indicador: any) => {
  //     const criterioNombre = indicador.subcriterio.criterio?.nombre;
  //     if (criterioNombre) {
  //       if (promediosPorCriterio[criterioNombre]) {
  //         promediosPorCriterio[criterioNombre] += indicador.porc_obtenido;
  //         conteoIndicadoresPorCriterio[criterioNombre] += 1;
  //       } else {
  //         promediosPorCriterio[criterioNombre] = indicador.porc_obtenido;
  //         conteoIndicadoresPorCriterio[criterioNombre] = 1;
  //       }
  //     }
  //   });

  //   Object.keys(promediosPorCriterio).forEach((criterio: string) => {
  //     const indicadoresCount = conteoIndicadoresPorCriterio[criterio];
  //     const promedioCriterio = promediosPorCriterio[criterio] / indicadoresCount;
  //     promediosPorCriterio[criterio] = promedioCriterio;
  //   });
  //   console.log(promediosPorCriterio);

  //   console.log(conteoIndicadoresPorCriterio);
  //   const labels = this.dataSource.map((indicador: any) => indicador.subcriterio.criterio?.nombre);

  //   const filteredLabels = labels.filter((label: any, index: any) => labels.indexOf(label) === index).slice(0, 15);
  //   console.log(filteredLabels + 'filtro criterios');
  //   const salesData = ['467', '576', '572', '79', '92', '574', '573', '576'];
  //   const profitData = ['542', '542', '536', '327', '17', '0.00', '538', '541'];

  //   this.chart = new Chart("MyChart", {
  //     type: 'bar',
  //     data: {
  //       labels: filteredLabels,
  //       datasets: [
  //         {
  //           label: "Promedio mayor a 75",
  //           data: filteredLabels.map((label: string) => {
  //             const promedio = promediosPorCriterio[label];
  //             return promedio > 75 ? promedio : null;
  //           }),
  //           backgroundColor: 'green'
  //         },
  //         {
  //           label: "Promedio mayoa 50 y menor igual a 75",
  //           data: filteredLabels.map((label: string) => {
  //             const promedio = promediosPorCriterio[label];
  //             return promedio <= 75 && promedio > 50 ? promedio : null;
  //           }),
  //           backgroundColor: 'Yellow'
  //         },
  //         {
  //           label: "Promedio mayor a 25 menor a 50 ",
  //           data: filteredLabels.map((label: string) => {
  //             const promedio = promediosPorCriterio[label];
  //             return promedio > 25 && promedio <= 50 ? promedio : null;
  //           }),
  //           backgroundColor: 'orange'
  //         },
  //         {
  //           label: "Promedio menor a 25%",
  //           data: filteredLabels.map((label: string) => {
  //             const promedio = promediosPorCriterio[label];
  //             return promedio < 25 ? promedio : null;
  //           }),
  //           backgroundColor: 'red'
  //         }

  //       ]
  //     },
  //     options: {
  //       aspectRatio: 2.5,
  //       plugins: {
  //         datalabels: {
  //           anchor: 'end',
  //           align: 'end',
  //           color: 'black',
  //           formatter: function (value: any, context: any) {
  //             const promedio = context.dataset.data[context.dataIndex];
  //             return promedio !== null ? promedio + '%' : '';
  //           }
  //         }
  //       }
  //     }

  //   });

  // }
  
  
}
