import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudActividadPrepuesto } from 'src/app/models/SolicitudActividadPresupuesto';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudPresupuestoService } from 'src/app/services/solicitud-presupuesto.service';
import { EmailServiceService } from 'src/app/services/email-service.service';
import Swal from 'sweetalert2';
import { AprobacionSolicitudService } from 'src/app/services/aprobacion-solicitud.service';
import { AprobacionSolicitud } from 'src/app/models/AprobacionSolicitud';
import { catchError, forkJoin, of, switchMap, throwError } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { format } from 'date-fns';
import { Style, Table } from 'pdfmake/interfaces';
import { Margins } from 'pdfmake/interfaces';
import { Usuario2 } from 'src/app/models/Usuario2';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { ReformaTraspasoI } from 'src/app/models/ReformaTraspasoI';
import { ReformaTraspasoD } from 'src/app/models/ReformaTraspasoD';
import { ReformaTraspasoIService } from 'src/app/services/reformatraspaso-i.service';
import { ReformaTraspasoDService } from 'src/app/services/reformatraspaso-d.service';



@Component({
  selector: 'app-listado-solicitudes',
  templateUrl: './listado-solicitudes.component.html',
  styleUrls: ['./listado-solicitudes.component.css']
})
export class ListadoSolicitudesComponent implements OnInit {
  //Buscar
  filterPost: string = '';
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  dataSource = new MatTableDataSource<SolicitudActividadPrepuesto>();
  columnasSolicitud: string[] = [
    'responsable',
    'actividad_nombre',
    'codificado',
    'monto_actual',
    'estado',
    'fecha_solicitud',
    'evaluar'  ];
  listaSolicitudes: SolicitudActividadPrepuesto[] = [];
  //Usuario logueado
  user: any = null;

  //tabla
  itemsPerPageLabel = 'Solicitudes por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  rango: any = (page: number, pageSize: number, length: number) => {
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

  //Variable para estado
  public correo = '';
  public estado = '';
  public observacion = '';
  nombre!: string;
  fechaActual: Date;
  poa: any = null;

  public aprobarSolicitud = new AprobacionSolicitud();
  public solicitudSeleted = new SolicitudActividadPrepuesto();
  reformaI: ReformaTraspasoI = new ReformaTraspasoI();
  reformaD: ReformaTraspasoD = new ReformaTraspasoD();

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    public login: LoginService,
    private router: Router,
    private solicitudPresupuestoService: SolicitudPresupuestoService,
    private emaservices: EmailServiceService,
    private aprobacionSolicitudService: AprobacionSolicitudService,
    private actividadServi: ActividadespoaService,
    private reformaIService: ReformaTraspasoIService,
    private reformaDService: ReformaTraspasoDService,

    //importar el spinner como servicio
    private loadingService: LoadingServiceService
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.fechaActual = new Date();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }
  ngOnInit(): void {
    //Capturar usuario logueado
    this.user = this.login.getUser();
      //Obtener id del poa
      const data = history.state.data;
      this.poa = data;
      console.log(this.poa)
      this.listarSolicitudes(this.user.id, this.poa.id_poa);
      

  }


listarSolicitudes(idAdmin: number, idPoa: number): void {
  this.loadingService.show();
  this.solicitudPresupuestoService
    .listarSolicitudesPoa(idAdmin, idPoa)
    .subscribe(
      (data: any[]) => {
        this.listaSolicitudes = data;
        console.log( this.listaSolicitudes )
        this.dataSource.data = this.listaSolicitudes;
        this.loadingService.hide();
      },
      (error: any) => {
        console.error('Error al listar los poas:', error);
        this.loadingService.hide();
      }
    );
}



getRowCount(elemento: any): number {
  const nombreResponsable = `${elemento.responsable?.persona?.primer_nombre} ${elemento.responsable?.persona?.primer_apellido}`;
  let rowCount = 0;

  for (const solicitud of this.listaSolicitudes) {
    const nombreSolicitud = `${solicitud.responsable?.persona?.primer_nombre} ${solicitud.responsable?.persona?.primer_apellido}`;
    
    if (nombreSolicitud === nombreResponsable) {
      rowCount++;
    }
  }

  return rowCount;
}


  tipo: boolean = false;

  seleccionar(soli: SolicitudActividadPrepuesto) {
    this.solicitudSeleted = soli;
    this.estado = this.solicitudSeleted.estado;
    if (this.solicitudSeleted.actividadSolicitud !== null) {
      this.actividadSelecciona = this.solicitudSeleted.actividadSolicitud;
    } 
    if (this.solicitudSeleted.responsable?.id !== undefined) {
      this.correo = this.solicitudSeleted.responsable?.persona.correo;
      this.nombre = this.solicitudSeleted.responsable?.persona.primer_nombre + ' ' + this.solicitudSeleted.responsable?.persona.primer_apellido;
      console.log("this.correo")
      console.log(this.correo)
      console.log("this.nombre")
      console.log(this.nombre)
    } 
    if (
      this.solicitudSeleted.monto_total > this.solicitudSeleted.monto_actual
    ) {
      this.tipo = true;
      this.reformaI.actividad = this.actividadSelecciona;
      this.reformaI.valor = this.solicitudSeleted.monto_total;
      this.reformaI.fecha = this.fechaActual;
    } else {
      this.reformaD.actividad = this.actividadSelecciona;
      this.reformaD.valor = this.solicitudSeleted.monto_total;
      this.reformaD.fecha = this.fechaActual;
    }
  }

  buscar() {
    this.filteredComponentes = this.listaSolicitudes.filter((componente) =>
      componente.actividadSolicitud?.nombre
        .toLowerCase()
        .includes(this.filterPost.toLowerCase())
    );
    this.dataSource.data = this.filteredComponentes;
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }

  Limpiar() {
    this.estado = '';
    this.observacion = '';
  }
  //Metodo para Rechazar y Aprobar
  Rechazar() {
    this.estado = 'RECHAZADO';
  }
  Aprobar() {
    this.estado = 'APROBADO';
  }

  /// envio de correo john
  sendEmail() {
    const toUser = [this.correo];
    const subject = this.estado;
    const message = this.observacion;

    this.emaservices.sendEmail(toUser, subject, message).subscribe(
      (response) => {
        console.log('Correo electrónico enviado con éxito:', response);
      },
      (error) => {
        console.error('Error al enviar el correo electrónico:', error);
      }
    );
  }
  get isAprobado() {
    return this.estado === 'APROBADO';
  }

  get isRechazado() {
    return this.estado === 'RECHAZADO';
  }
 

  usuariosdit: Usuario2 = new Usuario2();
  solic: SolicitudActividadPrepuesto = new SolicitudActividadPrepuesto();
  usuariosdit2: Usuario2 = new Usuario2();
  actividadSelecciona: ActividadesPoa = new ActividadesPoa();
  usuariosditDest: Usuario2 = new Usuario2();
  Resposable: Usuario2 = new Usuario2();

  guardar() {
    this.loadingService.show();
    const codificado = this.solicitudSeleted.monto_total;
    // Verificar si estado y observación no están vacíos
    if (!this.estado || !this.observacion) {
      this.loadingService.hide();
      Swal.fire('Advertencia', 'Existen campos vacios', 'warning');
      return;

    }

    this.usuariosdit.id = this.user.id;
    this.solic.id_solicitud_presupuesto =
    this.solicitudSeleted.id_solicitud_presupuesto;
    this.usuariosdit2.id = this.actividadSelecciona.usuario.id;
    this.usuariosditDest.id = this.solic.destinatario?.id || 0; // 0 es un valor predeterminado si es undefined
    this.Resposable.id = this.solic.responsable?.id || 0;
    this.aprobarSolicitud.estado = this.estado;
    this.aprobarSolicitud.observacion = this.observacion;
    this.aprobarSolicitud.solicitud = this.solic;
    this.aprobarSolicitud.usuario = this.usuariosdit;
    this.solic.estado = this.estado;
    this.solic.motivo = this.solicitudSeleted.motivo;
    this.solic.fecha_solicitud = this.solicitudSeleted.fecha_solicitud;
    this.solic.monto_actual = this.solicitudSeleted.monto_actual;
    this.solic.monto_total = this.solicitudSeleted.monto_total;
    this.solic.reforma = this.solicitudSeleted.reforma;
    this.aprobarSolicitud.fecha_aprobacion = this.fechaActual;
    console.log('datosss');
    console.log(this.actividadSelecciona);
    this.actividadSelecciona.usuario = this.usuariosdit2;
    this.actividadSelecciona.codificado = codificado;





    
    if (this.estado === 'APROBADO') {
      // Verificar el tipo
      if (this.tipo) {
        // Realizar la operación de Reforma I
        this.reformaIService.crear(this.reformaI).subscribe(
          () => {
            console.log('Se creó Reforma I');
            this.actualizarActividad();
          },
          (error: any) => {
            console.error('Error al crear Reforma I:', error);
            this.loadingService.hide();
          }
        );
      } else {
        // Realizar la operación de Reforma D
        this.reformaDService.crear(this.reformaD).subscribe(
          () => {
            console.log('Se creó Reforma D');
            this.actualizarActividad();
            this.loadingService.hide();

          },
          (error: any) => {
            console.error('Error al crear Reforma D:', error);
            this.loadingService.hide();
          }
        );
      }
    } else if (this.estado === 'RECHAZADO') {
      // Solo realizar operaciones de aprobación y actualización de solicitud
      this.realizarOperacionesAprobacionSolicitud();
    }
  }

  private actualizarActividad() {
    this.actividadServi
      .actualizar(
        this.actividadSelecciona.id_actividad,
        this.actividadSelecciona
      )
      .subscribe(
        () => {
          console.log('Se editó la actividad');
          this.realizarOperacionesAprobacionSolicitud();
          this.loadingService.hide();

        },
        (error: any) => {
          console.error('Error al editar la actividad:', error);
          this.loadingService.hide();
        }
      );
  }

  private realizarOperacionesAprobacionSolicitud() {
    forkJoin([
      this.aprobacionSolicitudService.crear(this.aprobarSolicitud),
      this.solicitudPresupuestoService.actualizar(
        this.solicitudSeleted.id_solicitud_presupuesto,
        this.solic
      ),
    ]).subscribe(
      ([aprobarResponse, archivoResponse]) => {
        this.sendEmail();
        this.Limpiar();
        this.loadingService.hide();
        this.listarSolicitudes(this.user.id, this.poa.id_poa);
        Swal.fire(
          'Exitoso',
          'Se ha completado el registro con éxito',
          'success'
        );
      },
      (error) => {
        console.error('Error al realizar alguna de las operaciones:', error);
        this.loadingService.hide();
        Swal.fire(
          'Error',
          'Ha ocurrido un error en una o ambas operaciones',
          'warning'
        );
      }
    );
  }












  
  GenerarPdf(Elemento: any) {
    this.solicitudSeleted = Elemento;

    const fechaSolicitud = format(
      new Date(this.solicitudSeleted.fecha_solicitud),
      'dd MMM yyyy'
    );

    const contenido = [
      { text: 'Santa Isabel, ' + fechaSolicitud, style: 'encabezado' },
      '\n\n',
      {
        text:
          (this.solicitudSeleted.destinatario?.persona.primer_nombre || '') +
          ' ' +
          (this.solicitudSeleted.destinatario?.persona.primer_apellido || ''),
        style: 'destinatario',
      },
      {
        text: this.solicitudSeleted.destinatario?.persona.cargo || '',
        style: 'destinatario',
      },
      { text: 'Su despacho. -  ', style: 'destinatario' },
      { text: 'De mi consideración.', style: 'destinatario' },
      '\n\n',
      '\n\n',
      {
        text: 'Reciba un cordial y efusivo saludo, no sin antes desearle éxito en sus funciones diarias.',
        style: 'cuerpo',
      },
      '\n\n',
      { text: this.solicitudSeleted.motivo, style: 'cuerpo' },
      '\n\n',
      '\n\n',
      '\n\n',
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'ACTIVIDAD', style: 'tablaHeader' },
              { text: 'MONTO ACTUAL', style: 'tablaHeader' },
              { text: 'REFORMA', style: 'tablaHeader' },
              { text: 'MONTO TOTAL', style: 'tablaHeader' },
            ],
            [
              '' + this.solicitudSeleted.actividadSolicitud?.nombre,
              this.solicitudSeleted.monto_actual,
              this.solicitudSeleted.reforma,
              this.solicitudSeleted.monto_total,
            ],
          ],
          alignment: 'center',
        },
        style: 'tabla',
      },
      '\n\n',
      { text: 'Atentamente,', absolutePosition: { x: 40, y: 650 } },
      '\n\n',
      {
        text:
          (this.solicitudSeleted.responsable?.persona.primer_nombre || '') +
          ' ' +
          (this.solicitudSeleted.responsable?.persona.primer_apellido || ''),
        style: 'firma',
        absolutePosition: { x: 40, y: 700 },
      },
      {
        text: this.solicitudSeleted.responsable?.persona.cargo || '',
        style: 'firma',
        absolutePosition: { x: 40, y: 715 },
      },
      {
        text: 'GAD MUNICIPAL SANTA ISABEL.',
        style: 'firma',
        absolutePosition: { x: 40, y: 730 },
      },
      {
        text: 'Calle 3 de Noviembre y 24 de Mayo | 072270412 | info@santaisabel.gob.ec',
        style: 'info',
        absolutePosition: { x: 2, y: 780 },
      },
    ];

    const estilos: { [key: string]: Style } = {
      encabezado: { fontSize: 12, bold: true, alignment: 'right' },
      destinatario: { fontSize: 12 },
      cuerpo: { fontSize: 12 },
      firma: { fontSize: 12, bold: true },
      info: { fontSize: 9, margin: [20, 0, 40, 0] },

      tabla: {
        margin: [20, 0, 40, 0] as Margins,
        fontSize: 15,
        fillColor: '#EFEFEF',
      },
      tablaHeader: {
        bold: true,
        fontSize: 15,
        color: 'black',
        fillColor: '#CCCCCC',
      },
    };

    const opcionesPdf = {
      pageMargins: [0, 0, 0, 0],
      pageOrientation: 'portrait',
    };

    const documentoPdf = {
      watermark: {
        text: 'SANTA ISABEL',
        color: 'green',
        opacity: 0.1,
        bold: false,
        italics: false,
      },
      content: contenido,
      styles: estilos,
      opcionesPdf,
    };

    pdfMake.createPdf(documentoPdf).open();
    ///const fileName = `Oficio_${moment().format('YYYY-MM-DD')}.pdf`;

    //const pdf = pdfMake.createPdf(pdfDefinition);
    //const pdf = pdfMake.createPdf(documentoPdf).download(fileName);
  }


    //Ir a poas
    verPoas() {
      this.router.navigate(['/adm/poas-solicitudes/listarPoasSoli']);
    }
}
