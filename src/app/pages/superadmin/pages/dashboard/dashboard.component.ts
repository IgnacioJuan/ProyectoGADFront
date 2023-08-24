import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';
import { Actividad } from 'src/app/models/Actividad';
import { AutoIndicador } from 'src/app/models/AutoridadIndicador';
import { Criterio } from 'src/app/models/Criterio';
import { Persona2 } from 'src/app/models/Persona2';
import { ActividadService } from 'src/app/services/actividad.service';
import { Actividades } from 'src/app/models/actividades';
import { CriteriosService } from 'src/app/services/criterios.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
//Funciones
import { CalendarOptions } from '@fullcalendar/core';;
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { Notificacion } from 'src/app/models/Notificacion';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ActividadesProjection } from 'src/app/interface/ActividadesProjection';
import { IndicadorProjection } from 'src/app/interface/IndicadorProjection';
import { ActivAprobadaProjection } from 'src/app/interface/ActivAprobadaProjection';
// Color aleatorio
function cambiarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = "#" + ((hash & 0x00FFFFFF) | 0x99000000).toString(16).slice(1);
  return color;
}
//Color calendario
function colorCalendario(): string {
  const letras = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letras[Math.floor(Math.random() * 16)];
  }
  // Convertimos el color a un valor hexadecimal numérico
  const colorNumerico = parseInt(color.substring(1), 16);
  const maxColorNumerico = 13421772; 
  if (colorNumerico > maxColorNumerico) {
    color = colorCalendario(); 
  }

  return color;
}


@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
})
export class DashboardComponent2 implements OnInit {
  displayedColumns: string[] = ['actividad', 'inicio', 'fin', 'encargado', 'enlace'];
  dataSource : ActivAprobadaProjection[] = [];
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  noti = new Notificacion();
  notificaciones: Notificacion[] = [];
  numNotificacionesSinLeer: number = 0;
  selectedColor: string="";
  abrir: boolean = false;
  itemsPerPageLabel = 'Actividades por página';
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
  titulo= 'Avance de los Criterios';
  titulo2= 'Avance de las Actividades';
  titulo3= 'Responsables';
  @Input() color: ThemePalette= "primary";

displayedColumns1: string[] = ['actividad', 'inicio', 'fin', 'encargado', 'enlace'];
spanningColumns = ['actividad', 'inicio', 'fin', 'encargado'];
spans: any[] = [];
spans2: any[] = [];
dataSource1: ActivAprobadaProjection[] = [];
  labesCriterios: any[] = [];
  datosPOrceCriter: number[] = [];
  criteri: any;
  valores: number[] = [10,0];
  listaCriterios: any[] = [];
  modeloMaximo:any;
  listaIndicadores: IndicadorProjection[] = [];
  persona:Persona2 = new Persona2();
  suma: { [nombre: string]: number } = {};
  //prueba
colorScheme: any;
datos: any[]=[];
width = 600;
height = 400;
showXAxis = true;
showYAxis = true;
gradient = false;
//prueba
view: [number, number] = [700, 400]; // Tamaño del gráfico (ancho x alto)
Utilidad!: number;
items: any[] = [];
eventos: any[] = [];
crite: any[] = [];
avances: any[] = [];
  //FIN DE VISTA
  public actividad = new Actividades();
  Actividades: Actividad[] = [];
  listact: ActividadesProjection[] = [];
  listind:IndicadorProjection[] = [];
  numac: Actividades[] = [];
  Evidencias: any[] = [];
  totalAct: number = 0;
  actApro: number = 0;
  porc:number=0;
  datosUsuarios: any[] = [];
    @ViewChild('chart') chart: any;
//
constructor(private services: ActividadService,private paginatorIntl: MatPaginatorIntl,
  private eviden: EvidenciaService,private router: Router, private servper:PersonaService,
  public login: LoginService, private notificationService: NotificacionService,
  private httpCriterios: CriteriosService) {
    this.colorScheme = {
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    };
    this.services.getActividadrechazada().subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource1 = data;
      console.log("rechazadai", JSON.stringify(this.dataSource1))
      this.cacheSpan('actividad', (d) => d.actividades);
      this.cacheSpan('inicio', (d) => d.actividades + d.inicio);
      this.cacheSpan('fin', (d) => d.actividades + d.inicio + d.fin);
      this.cacheSpan('encargado', (d) => d.actividades + d.inicio + d.fin + d.encargado);
    });

    this.services.getActividadaprobada().subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource = data;
      this.cacheSpan2('actividad', (y) => y.actividades);
      this.cacheSpan2('inicio', (y) => y.actividades + y.inicio);
      this.cacheSpan2('fin', (y) => y.actividades + y.inicio + y.fin);
      this.cacheSpan2('encargado', (y) => y.actividades + y.inicio + y.fin + y.encargado);
    });
    this.rol = this.login.getUserRole();
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
   }

   abrirOpcn() {
    this.abrir = !this.abrir;
  }
   onSelect(event: any) {
    console.log(event);
  }


  ngOnInit(): void {
    this.listarActividad();
    this.modeloMax();
    this.services.get().subscribe((data: Actividades[]) => {
      // Envio los datos
      this.eventos = data.map(evento => ({
        title: evento.nombre,
        start: new Date(evento.fecha_inicio),
        end: new Date(evento.fecha_fin),
        color: colorCalendario()
      }));
      this.calendarOptions.events = this.eventos;
    });
  this.httpCriterios.getCriterios().subscribe(data => {
      this.listaCriterios = data;
      this.cargarDatos();
    });
    //Notificaciones
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );
    
    this.listarnot(this.user.id);
    //cambiar color
    const storedColor = localStorage.getItem('selectedColor');
    if (storedColor) {
      this.selectedColor = storedColor;
      this.aplicarColorFondo(storedColor);
    }
    this.obtenerActividades();
  }
  //
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource1.length;) {
      let currentValue = accessor(this.dataSource1[i]);
      let count = 1;

      for (let j = i + 1; j < this.dataSource1.length; j++) {
        if (currentValue !== accessor(this.dataSource1[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
  
      this.spans[i][key] = count;
      i += count;
    }
  }
  
  
  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }

  cacheSpan2(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource.length;) {
      let currentValue = accessor(this.dataSource[i]);
      let count = 1;

      for (let j = i + 1; j < this.dataSource.length; j++) {
        console.log('Comparing:', currentValue, accessor(this.dataSource[j]));
  
        if (currentValue !== accessor(this.dataSource[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans2[i]) {
        this.spans2[i] = {};
      }
  
      this.spans2[i][key] = count;
      i += count;
    }
  }
  
  
  getRowSpan2(col: any, index: any) {
    return this.spans2[index] && this.spans2[index][col];
  }
  
 //listar archivos
 obtenerNombreArchivo(url: string): string {
  if (url) {
    const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
  return nombreArchivo;
  } else {
    return '';
  }
}

obtenerNombreArchivo2(url: string): string {
  if (url) {
    const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
  return nombreArchivo;
  } else {
    return '';
  }
}
obtenerActividades() {
  this.services.getAc().subscribe(
    (actividades: ActividadesProjection[]) => {
      this.listact = actividades;
      console.log("Avances de base:", JSON.stringify(this.listact, null, 2));
      this.avances = this.listact.map(item => ({
        name: item.nombres,
        value: item.avance
      }));

      console.log("Avances:", JSON.stringify(this.avances, null, 2));
    },
    (error) => {
      console.error('Error al obtener las actividades:', error);
    }
  );
}

 //
  cambiar() {
    localStorage.setItem('selectedColor', this.selectedColor);
    this.aplicarColorFondo(this.selectedColor);
  }

  aplicarColorFondo(color: string) {
    // Aplicar el color seleccionado al fondo
    const body = document.getElementById("body");
    const enc = document.getElementById("enc");
    const let1 = document.getElementById("letra");
    const let2 = document.getElementById("letra2");
    const cal = document.getElementById("cal");
    const fig = document.getElementById("fig");
    const fig5 = document.getElementById("fig5");
    const menu = document.getElementById("menu");
    const notif = document.getElementById("notif");
    const txt = document.getElementById("txt");
    const graf = document.getElementById("graf");
    if (body) {
      body.style.backgroundColor = color;
    }
    //color
    if(color==="white"){
    if (enc) {
      enc.style.backgroundColor = "#eeeee4";
      enc.style.background = "#eeeee4";
    }
    if (let1) {
      let1.style.color = "black";
      let1.style.backgroundColor="#eeeee4";
      let1.style.boxShadow = "";
    }
    if (let2) {
      let2.style.color = "black";
    }
    if(fig){
      fig.style.backgroundColor = "white";
    }
    if (notif) {
      notif.style.backgroundColor = "white";
      notif.style.color = "black";
    }
    if(txt){
      txt.style.backgroundColor = "white";
      txt.style.color = "black";
    }
    if(fig5){
      fig5.style.backgroundColor = "white";
    }
    if(menu){
      menu.style.backgroundColor = "#b0bec5";
    }

    if(graf){
      graf.style.color = "black";
    }
    // Tema 2
  } else if (color === "#151a30") {
    if (enc) {
      enc.style.backgroundColor = "#222b45";
      enc.style.background = "#222b45";
    }
    if (let1) {
      let1.style.color = "white";
      let1.style.backgroundColor="#222b45";
      let1.style.boxShadow = "";
    }
    if (let2) {
      let2.style.color = "white";
    }
    if (notif) {
      notif.style.backgroundColor = "#151a30";
      notif.style.color = "white";
    }
    if(txt){
      txt.style.backgroundColor = "#0d47a1";
      txt.style.color = "white";
    }
    if(menu){
      menu.style.backgroundColor = "#BEC8DC80";
    }
    if(fig){
      fig.style.backgroundColor = "#BEC8DC80";
    }
    if(fig5){
      fig5.style.backgroundColor = "#BEC8DC80";
    }
    if(cal){
      cal.style.color = "white";
    }

    if(graf){
      graf.style.color = "black";
    }
    // Tema 3
  } else  if(color==="#131a22"){
    if (enc) {
      enc.style.background = "radial-gradient(circle, #6e14c4, #00b2d6)";
    }
    if (let1) {
      let1.style.color = "white";
      let1.style.backgroundColor="rgba(2, 27, 32, 0.25)";
      let1.style.boxShadow = "0 0 10px #00b2d6, 0 0 20px #00b2d6, 0 0 40px #00b2d6, 0 0 80px #00b2d6";
    }
    if (let2) {
      let2.style.color = "white";
    }
    if (notif) {
      notif.style.backgroundColor = "";
      notif.style.color = "white";
    }
    if(txt){
      txt.style.backgroundColor = "rgba(254,30,241,0.25)";
      txt.style.color = "white";
    }
    if(fig){
      fig.style.backgroundColor = "rgb(0,247,255, 0.5) ";
    }
    if(fig5){
      fig5.style.backgroundColor = "rgb(0,247,255, 0.25)";
    }
    if(menu){
      menu.style.backgroundColor = "radial-gradient(circle, #013b3f, ##01060a)";
    }
    if(graf){
      graf.style.color = "black";
    }
  }
  }

  listarnot(id: any) {
    if (this.rol == "ADMIN" || this.rol == "SUPERADMIN") {
      // Cargar notificaciones del rol ADMIN
      this.notificationService.allnotificacion(this.rol).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
          // Cargar notificaciones propias por id
          this.notificationService.getNotificaciones(id).subscribe(
            (dataPropias: Notificacion[]) => {
              this.notificaciones = this.notificaciones.concat(dataPropias);
              this.numNotificacionesSinLeer += dataPropias.filter(n => !n.visto).length;
            },
            (errorPropias: any) => {
              console.error('No se pudieron listar las notificaciones propias');
            }
          );
        },
        (error: any) => {
          console.error('No se pudieron listar las notificaciones');
        }
      );
    } else {
      this.notificationService.getNotificaciones(id).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
        },
        (error: any) => {
          console.error('No se pudieron listar las notificaciones');
        }
      );
    }
  }
  //Mi codigo calendario
 
 irmodelo() {
    this.router.navigate(['/sup/modelo/modelo']);
  }

  detalle() {
    this.router.navigate(['/sup/modelo/detallemodelo']);
  }

calendarOptions: CalendarOptions = {

    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: this.eventos,
    eventContent: this.personalizarEvent.bind(this),
    locale: esLocale
};

personalizarEvent(info:  any) {
  const fechafin = new Date(info.event.end).toLocaleDateString('es', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const fechai = new Date(info.event.start).toLocaleDateString('es', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  return { html: `<b>${info.event.title}</b><br>Inicio: ${fechai} - Fin: ${fechafin}` };
}

getColor(item: any): string {
    return cambiarColor(item.nombre);
  }
  //
  modeloMax(){
    this.httpCriterios.getModeMaximo().subscribe(data =>{
      this.modeloMaximo = data;
    })
  }

  listarActividad() {
    this.httpCriterios.getActividadAtrasada().subscribe(data => {
      this.Actividades = data;
    })
  }

  listarEvidencias() {
    this.eviden.getEvidencias().subscribe(data => {
      this.Evidencias = data;
    })
  }


  //LISTAR Y MOSTRAR LOS GRAFICOS
  cargarDatos(): void {
    this.httpCriterios.getIndicador().subscribe(
        (data: IndicadorProjection[]) => {
          this.listaIndicadores = data;
          this.datos = this.listaIndicadores.map(item => ({
            name: item.nombre,
            value: item.total
          }));
//ordenar valores
          this.listaIndicadores.sort((a, b) => b.total - a.total);
          this.crite = this.listaIndicadores.map(item => ({
          name: item.nombre,
        value: item.total
        }));
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
  }

  //valor porcentaje
  
  //color de barra
  getColorp(value: number): string {
    if (value >= 0.75) {
      //verde
      return '#4caf50';
    } else if (value >= 0.4) {
      //amarillo
      return '#ffc107';
    } else {
      //rojo
      return '#f44336';
    }
  }

 
  //para traer los datos del responsable
getPersonaActividad(objeto:Actividad){
  console.log(objeto.usuario.id)
  this.httpCriterios.getObtenerPersonaId(objeto.usuario.id).subscribe(
    data => {
      this.persona=data;
      console.log(this.persona);
    }
  )
}

}
