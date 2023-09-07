import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PoaService } from 'src/app/services/poa.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { Proyecto } from 'src/app/models/Proyecto';
import { AprovacionPoa } from 'src/app/models/aprovacion-poa';
import { AprobacionPoaService } from 'src/app/services/aprobacion-poa.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IndicadorService } from 'src/app/services/indicador.service';
import { Indicadores } from 'src/app/models/Indicadores';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Componentes } from 'src/app/models/Componentes';
import { ComponentesService } from 'src/app/services/componentes.service';
import { ObjetivoPdotService } from 'src/app/services/objetivo-pdot.service';
import Swal from 'sweetalert2';
import { Poa } from 'src/app/models/Poa';


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
  proyect: Proyecto [] = [];
  result :any;
  indiPro:any;
  metaindi:any;
  prome:any;
  poa: Poa[] = [];


   

    /////////////Para la tabla html  //////////////
    formPoas: FormGroup;
    guardadoExitoso: boolean = false;
    miPoa!: ElementRef;
    //tabla
    itemsPerPageLabel = 'Componentes por página';
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
    //
    public componentes = new Componentes();
    listaComponentes: Componentes[] = [];
    numeroObjetivos:number=0;
  
  
    //Buscar
    filterPost: string = "";
    filteredComponentes: any[] = [];
    resultadosEncontrados: boolean = true;
  
    dataSource = new MatTableDataSource<Poa>();
  
    columnasUsuario: string[] = ['id_poa', 'barrio', 'cobertura', 'comunidad', 'estado','localizacion','valorTotal','meta_alcanzar'];
  
    @ViewChild('datosModalRef') datosModalRef: any;
    @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectoService,
    private poaService: PoaService,
    private aproPoaService: AprobacionPoaService,
    private indicadoresService:IndicadorService,
    private paginatorIntl: MatPaginatorIntl,
    private fb: FormBuilder,
    private router:Router
  ) {
    this.formPoas= fb.group({
      id_poa: ['', Validators.required],
      valorTotal:['', Validators.required],
      barrio: ['', Validators.required],
      cobertura: ['', Validators.required],
      comunidad: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      localizacion: ['', [Validators.required]],
      meta_alcanzar: ['', [Validators.required]]
    
    });
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }

  ngOnInit(): void {
    this.recibePoa();
    //this.listindicadores();
    this.listarProyectos();
  }

  recibePoa() {
    this.route.paramMap.subscribe(params => {
      this.id_proyec= params.get('id');
      console.log('ID de POA seleccionado:', this.id_proyec);
      this.listarAprovacionPoa();
      this.indiacdorPorProyecto();
      
    });
  }

  // Listar Asignación deL poa
  listarAprovacionPoa() {
    this.aproPoaService.getAprobacionPoa().subscribe(data => {
      this.aprovacionPoa = data;
      console.log(this.aprovacionPoa, "lista aprobación poa");
      this.buscarPoasRelacionados();
    });
  }

  listindicadores(){
    this.indicadoresService.listar().subscribe(data=>{
      this.result=data;
     

    });

  };
  listarProyectos() {
    this.proyectoService.getProyectos().subscribe(data => {
      this.proyect = data;
      console.log(this.proyect, "listaaa Proyectos");
     
      this.indiacdorPorProyecto();
    });
  }



indiacdorPorProyecto() {
  const idsProyectos: number[] = this.proyect.map((proyecto: any) => proyecto.id_proyecto);
//listar los indicdores que pertenecen al proyecto del poa selecionado
  this.indicadoresService.listarIndicadoresPorProyectos(idsProyectos)
    .subscribe(data => {
      this.indiPro = data;
      
      // Obtener las metas asociadas a los indicadores
      var metasPDOT:any = this.indiPro.map((indicador: any) => indicador.metapdot);
     
      
      console.log('Indicadores por proyectos:', this.indiPro);
      console.log('Metas asociadas a los indicadores:', metasPDOT);
      

     
      
    }, error => {
      console.error('Error al obtener los indicadores por proyectos:', error);
    });
}

  

  buscarPoasRelacionados(): void {
    // Filtra la lista de aprobaciónPoa para encontrar los elementos que coinciden con el ID del POA
    const poaId = parseInt(this.id_proyec); // Convierte el ID de POA a número si es necesario
    const poasRelacionados:any = this.aprovacionPoa
      .filter(ap => ap.proyecto?.id_proyecto === poaId)
      .map(ap => ap.poa?.id_poa);

    if (poasRelacionados.length > 0) {
      // Utiliza los IDs de proyecto para obtener los proyectos relacionados
      this.poaService.buscarPoasPorIds(poasRelacionados).subscribe(
        (data: any[]) => {
          this.result = data;
          //this.dataSource.data = this.result;

          
          console.log('Poas relacionados:', this.result);
          this.indiacdorPorProyecto();
          this.promedioPoa(poasRelacionados);
         // this.buscar();
          this.createChart();
          
;
        },
        error => {
          console.error('Error al obtener los poas', error);
        }
      );
    } else {
      console.error('No se encontraron elementos de AprobaciónPoa para el ID de POA:', poaId);
    }
  }
  promedioPoa(poasRelacionados: any[]): void { // Añade el parámetro poasRelacionados
    this.poaService.listarPoasPromedio().subscribe(
      (data) => {
        this.poa = data;
  
        // Filtra los elementos que tienen un ID de POA presente en la lista poasRelacionados
        this.poa = this.poa.filter((item) => poasRelacionados.includes(item.id_poa));
       this.dataSource.data = this.poa;
       this.prome=this.poa;
       
        this.createChart();
  
        console.log('Datos de la vista:', this.prome);
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
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
      const labels = this.prome.map((apro: any) => apro.id_poa);
      const promedioProyecto = this.prome.map((apro: any) => parseFloat(apro.valorTotal.toFixed(2)));

    
      const filteredLabels = labels.filter((label: any, index: any) => labels.indexOf(label) === index).slice(0, 15);
    
      this.chart = new Chart("MyChart", {
        type: 'bar',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: "Promedio mayor a 85 ",
              data: filteredLabels.map((label: string, index: number) => {
                const promedio = promedioProyecto[index];
                return promedio > 84 ? promedio : null;
              }),
              backgroundColor: 'green'
            },
            {
              label: "Promedio mayor igual a 70 y menor igual a 84.9",
              data: filteredLabels.map((label: string, index: number) => {
                const promedio = promedioProyecto[index];
                return promedio <= 84.9 && promedio > 69 ? promedio : null;
              }),
              backgroundColor: 'Yellow'
            },
          
            {
              label: "Promedio menor igual a 69.9%",
              data: filteredLabels.map((label: string, index: number) => {
                const promedio = promedioProyecto[index];
                return promedio <= 69.9? promedio : null;
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
    
   
    
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator || null;
  
    }
   

  
 
  
   
    
  
    // buscar() {
    //   // Filtra los componentes basados en el filtro
    //   this.filteredComponentes = this.result.filter((poa:any) =>
    //    poa.id_poa.toLowerCase().includes(this.filterPost.toLowerCase())
    //   );
    
    //   // Actualiza los datos del dataSource con los resultados filtrados
    //   this.dataSource.data = this.filteredComponentes;
    
    //   // Verifica si se encontraron resultados
    //   this.resultadosEncontrados = this.filteredComponentes.length > 0;
    // }
    regresarAProyectos(){
  
        this.router.navigate(['sup/reportePoa']);
     

    }
    

  
}
