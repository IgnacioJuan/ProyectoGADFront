import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { ModeloPoaService } from 'src/app/services/modelo_poa.service';

@Component({
  selector: 'app-reporte-especifico-poa',
  templateUrl: './reporte-especifico-poa.component.html',
  styleUrls: ['./reporte-especifico-poa.component.css']
})
export class ReporteEspecificoPoaComponent implements OnInit{
  
  @ViewChild("chart")
  chart: any;
  model: ModeloPoa= new ModeloPoa();
  dataSource: any;
  asignacion: any;
  // indicadorClase: Indicador = new Indicador();
  title = 'ng-chart';
  porcentaje!: number;
  indicador: any;
  // ponderacionClase: Ponderacion = new Ponderacion();
  ponderacion: any;
  guardarponde: any;
  ponderacionv: any;
  //Variable para ponderacion
  fecha!: Date;
  peso: number = 0;
  porc_obtenido: number = 0;
  porc_utilida_obtenida: number = 0;
  valor_obtenido: number = 0;
  // indicador1!: Indicador;
  // modelo1!: Modelo;
  i: any;
  fechaSeleccionada: any;
  conf: number = 0;


  @ViewChild('miTabla', { static: true }) miTabla!: ElementRef;

  constructor(
    // private indicadorservice: IndicadoresService,
    private router: Router, private fb: FormBuilder,
    public modeloService: ModeloPoaService,
    // public asignacionIndicadorService: AsignacionIndicadorService,
    // private servicePonderacion: PonderacionService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute


  ) {
  }



  ocultarBoton: boolean = false;
  // En tu componente


  ngOnInit(): void {
    this.conf = 0;
    this.activatedRoute.queryParams.subscribe(params => {
      this.fechaSeleccionada = params['fecha']; // Obtener la fecha actual
      this.conf = params['conf'];
      if (this.conf == 1) {
        this.ocultarBoton = true;
      } else {
        this.ocultarBoton = false;
      }
      console.log(this.fechaSeleccionada, this.conf, "fecah selecionada");
      // Aquí puedes realizar cualquier otra lógica con la fecha seleccionada en el nuevo formato
    });

    console.log('Fecha seleccionada:', this.fechaSeleccionada);
    //this.recibeIndicador();
    // this.listPonderacion();






  }



  // recibeIndicador() {


  //   let idModelo = localStorage.getItem("id");


  //   this.modeloService.getModeloPoaById(Number(idModelo)).subscribe(dataModelo => {
  //     this.model = dataModelo;
  //     // Capturar el ID del indicador del modelo

  //     this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(idModelo)).subscribe(info => {

  //       this.indicadorservice.getIndicadors().subscribe(result => {
  //         this.dataSource = [];
  //         this.asignacion = info;

  //         console.log(this.conf);
  //         if (this.conf == 1) {
  //           this.dataSource = result.filter((indicador: any) => {
  //             return info.some((asignacion: any) => {
  //               return indicador.id_indicador === asignacion.indicador.id_indicador;

  //             });

  //           });
  //           let valores = this.dataSource
  //           // this.coloresTabla();

  //           // this.getRowCountCriterio1(this.dataSource.subcriterio.criterio.nombre,this.i);
  //           // this.getRowCountSubcriterio1(this.dataSource.subcriterio.nombre,this.i);
  //           this.servicePonderacion.listarPonderacionPorFecha(this.fechaSeleccionada).subscribe(data => {
  //             console.log("informacion", data);
  //             valores.forEach((indicador: any) => {
  //               const ponderacion = data.find((p: any) => indicador.id_indicador === p.indicador.id_indicador);
  //               if (ponderacion) {
  //                 indicador.peso = ponderacion.peso;
  //                 indicador.porc_obtenido = ponderacion.porc_obtenido;
  //                 indicador.porc_utilida_obtenida = ponderacion.porc_utilida_obtenida;
  //                 indicador.valor_obtenido = ponderacion.valor_obtenido;
  //               }
  //             });
  //             this.dataSource = valores;
  //             console.log(this.dataSource);
  //             // this.coloresTabla();
  //             this.createChart();
  //             //this.pieChart();
  //             this.GraficaPastel();
  //             this.calculatePromedioPorCriterio();

  //             this.calcularTSumaPesos();
  //             this.calcularUtilidad();
  //             this.coloresTabla();
  //           });



  //         } else {
  //           this.dataSource = result.filter((indicador: any) => {
  //             return info.some((asignacion: any) => {
  //               return indicador.id_indicador === asignacion.indicador.id_indicador;
  //             });
  //           });
  //           this.createChart();
  //           //this.pieChart();
  //           this.GraficaPastel();
  //           this.calculatePromedioPorCriterio();

  //           this.calcularTSumaPesos();
  //           this.calcularUtilidad();
  //           this.coloresTabla();
  //         }


  //       });
  //     });
  //   });
  // }


  



  // //enviamos modelo
  // enviarModelo(modelo: Modelo): void {
  //   localStorage.setItem("id", modelo.id_modelo.toString());
  //   this.model = modelo;
  //   //this.router.navigate(['/detallemodelo']);
  // }

  // //Calculamos el promedio de cada criterio
  // calculatePromedioPorCriterio() {
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
  // }





  // ///Grafica del pastel
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

  // //Grafica de barras

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



  // //colores de la celda de la tabla
  // coloresTabla() {
  //   this.dataSource.forEach((indicador: any) => {

  //     if (indicador.porc_obtenido > 75 && indicador.porc_obtenido <= 100) {
  //       indicador.color = 'verde'; // Indicador con porcentaje mayor a 50% será de color verde
  //     }
  //     else if (indicador.porc_obtenido > 50 && indicador.porc_obtenido <= 75) {
  //       indicador.color = 'amarillo'; // Indicador con porcentaje mayor a 50% será de color verde
  //     }
  //     else if (indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50) {
  //       indicador.color = 'naranja'; // Indicador con porcentaje mayor a 50% será de color verde
  //     } else if (indicador.porc_obtenido <= 25) {
  //       indicador.color = 'rojo'; // Indicador con porcentaje menor a 30% será de color rojo
  //     } else {
  //       indicador.color = ''; // No se asigna ningún color a los indicadores que no cumplen las condiciones anteriores
  //     }
  //   });
  // }

  // //regreso al modelo
  // verCriterios() {
  //   this.router.navigate(['/detallemodelo']);
  // }

  // //lista de ponderacion 

  // listPonderacion() {
  //   this.servicePonderacion.listarPonderacion().subscribe(data => {
  //     this.dataSource = data;

  //   });
  //   console.log(this.dataSource + 'listaaaaaaaaa');

  // }


  // //crear ponderacion
  // crearPonderacion(ponderacionClase: Ponderacion) {


  //   this.servicePonderacion.guardarPonderacion(ponderacionClase)
  //     .subscribe(
  //       (data: any) => {
  //         console.log('Ponderacion creada con éxito:', data);
  //         Swal.fire(
  //           'Ponderacion Registrada!',
  //           'success'
  //         );
  //         this.listarPonderacion();
  //       },
  //       (error: any) => {
  //         console.error('Error al crear el subcriterio:', error);
  //       }
  //     );
  //   //this.router.navigate(['/ponderacion']);


  // }

  // listarPonderacion() {
  //   this.servicePonderacion.listarPonderacion().subscribe(data => {
  //     this.dataSource = data;
  //   });
  // }

  // //Para las tablas html no tocar ********************************************************************************
  // // ...

  // getRowCountCriterio(criterio: string, index: number): number {
  //   this.metodoordenar();
  //   let count = 1;
  //   for (let i = index + 1; i < this.dataSource.length; i++) {
  //     if (this.dataSource[i].subcriterio.criterio.nombre === criterio) {
  //       count++;
  //     } else {
  //       break;
  //     }
  //   }
  //   return count;
  // }

  // getRowCountSubcriterio(subcriterio: string, index: number): number {
  //   this.metodoordenar();
  //   let count = 1;
  //   for (let i = index + 1; i < this.dataSource.length; i++) {
  //     if (this.dataSource[i].subcriterio.nombre === subcriterio) {
  //       count++;
  //     } else {
  //       break;
  //     }
  //   }
  //   return count;
  // }

  // getRowCountCriterio1(criterio: string, index: number): number {
  //   this.metodoordenar();
  //   let count = 1;
  //   for (let i = index + 1; i < this.dataSource.length; i++) {
  //     if (this.dataSource[i].subcriterio.criterio.nombre === criterio) {
  //       count++;
  //     } else {
  //       break;
  //     }
  //   }
  //   return count;
  // }


  // getRowCountSubcriterio1(subcriterio: string, index: number): number {
  //   this.metodoordenar();
  //   let count = 1;
  //   for (let i = index + 1; i < this.dataSource.length; i++) {
  //     if (this.dataSource[i].subcriterio.nombre === subcriterio) {
  //       count++;
  //     } else {
  //       break;
  //     }
  //   }
  //   return count;
  // }

  // //para ordenar la tabla y no se repita
  // metodoordenar() {
  //   // Ordenar dataSource por subcriterio.criterio.nombre y subcriterio.nombre
  //   this.dataSource.sort((a: any, b: any) => {
  //     if (a.subcriterio.criterio.nombre < b.subcriterio.criterio.nombre) {
  //       return -1;
  //     }
  //     if (a.subcriterio.criterio.nombre > b.subcriterio.criterio.nombre) {
  //       return 1;
  //     }
  //     if (a.subcriterio.nombre < b.subcriterio.nombre) {
  //       return -1;
  //     }
  //     if (a.subcriterio.nombre > b.subcriterio.nombre) {
  //       return 1;
  //     }
  //     return 0;
  //   });

  // }


  // //Suma de todos los pesos

  // sumaTotalPesos: number = 0;

  // calcularTSumaPesos(): void {
  //   this.sumaTotalPesos = this.dataSource.reduce((suma: any, indicador: any) => suma + indicador.peso, 0);
  //   console.log(this.sumaTotalPesos + ' : el total es')
  // }

  // //Calcular las uttilidades
  // sumaUtilidad: number = 0;

  // calcularUtilidad(): void {
  //   this.sumaUtilidad = this.dataSource.reduce((suma: any, indicador: any) => suma + indicador.porc_utilida_obtenida, 0);
  //   console.log(this.sumaUtilidad + ' : el total es')
  // }


}
