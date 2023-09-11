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
import { forkJoin } from 'rxjs';
import { Persona2 } from 'src/app/models/Persona2';
import { PersonaService } from 'src/app/services/persona.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { format } from 'date-fns';
import { Style, Table } from 'pdfmake/interfaces';
import { Margins } from 'pdfmake/interfaces';

@Component({
  selector: 'app-list-solicitudes-presupuesto-superadmin',
  templateUrl: './list-solicitudes-presupuesto-superadmin.component.html',
  styleUrls: ['./list-solicitudes-presupuesto-superadmin.component.css'],
})
export class ListSolicitudesPresupuestoSuperadminComponent implements OnInit {
  //Buscar
  filterPost: string = '';
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  dataSource = new MatTableDataSource<SolicitudActividadPrepuesto>();
  columnasSolicitud: string[] = [
    'responsable',
    'actividad_nombre',
    'estado',
    'fecha_solicitud',
    'evaluar',
    'actions',
  ];
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

  public aprobarSolicitud = new AprobacionSolicitud();
  public solicitudSeleted = new SolicitudActividadPrepuesto();

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    public login: LoginService,
    private router: Router,
    private solicitudPresupuestoService: SolicitudPresupuestoService,
    private emaservices: EmailServiceService,
    private aprobacionSolicitudService: AprobacionSolicitudService,
    private serviper: PersonaService
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
    this.listarSolicitudes(this.user.id);
  }

  //Metodo para listar
  listarSolicitudes(idSuper: number): void {
    this.solicitudPresupuestoService
      .listarSolicitudesSuperAdmin(idSuper)
      .subscribe(
        (data: any[]) => {
          this.listaSolicitudes = data;
          console.log('Dataa');
          console.log(this.listaSolicitudes);
          this.dataSource.data = this.listaSolicitudes;
        },
        (error: any) => {
          console.error('Error al listar los poas:', error);
        }
      );
  }

  seleccionar(soli: SolicitudActividadPrepuesto) {
    this.solicitudSeleted = soli;
    this.estado = this.solicitudSeleted.estado;
    const idResponsable = this.solicitudSeleted.responsable?.id;

    if (idResponsable !== undefined) {
      console.log('this datos');
      console.log(idResponsable);

      // Luego, puedes continuar con el resto de tu lógica aquí
      this.serviper.getcorreo(idResponsable).subscribe(
        (data: Persona2) => {
          console.log('datossssssssss');
          this.correo = data.correo;
          this.nombre = data.primer_nombre + ' ' + data.primer_apellido;

          console.log('correo =' + this.correo);
        },
        (error: any) => {
          console.error('Error al listar los componentes:', error);
        }
      );
    } else {
      console.log('idResponsable es undefined');
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

  guardar() {
    // Verificar si estado y observación no están vacíos
    if (!this.estado || !this.observacion) {
      Swal.fire('Advertencia', 'Existen campos vacios', 'warning');
      return;
    }

    this.aprobarSolicitud.estado = this.estado;
    this.aprobarSolicitud.observacion = this.observacion;

    //Quitar el usuario destinatario, responsable, actividad
    this.solicitudSeleted.actividadSolicitud = null;
    this.solicitudSeleted.destinatario = null;
    this.solicitudSeleted.responsable = null;
    this.aprobarSolicitud.solicitud = this.solicitudSeleted;
    this.aprobarSolicitud.usuario = this.user.id;
    this.solicitudSeleted.estado = this.estado;
    this.aprobarSolicitud.fecha_aprobacion = this.fechaActual;
    // Guardamos la aprobación y actualizamos el estado del archivo en paralelo

    forkJoin([
      this.aprobacionSolicitudService.crear(this.aprobarSolicitud),
      this.solicitudPresupuestoService.actualizar(
        this.solicitudSeleted.id_solicitud_presupuesto,
        this.solicitudSeleted
      ),
    ]).subscribe(
      ([aprobarResponse, archivoResponse]) => {
        this.sendEmail();
        this.Limpiar();
        this.listarSolicitudes(this.user.id);
        Swal.fire(
          'Exitoso',
          'Se ha completado el registro con éxito',
          'success'
        );
      },
      (error) => {
        console.error('Error al realizar alguna de las operaciones:', error);
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
      { text: 'Atentamente,', style: 'firma' },
      '\n\n',
      {
        text:
          (this.solicitudSeleted.responsable?.persona.primer_nombre || '') +
          ' ' +
          (this.solicitudSeleted.responsable?.persona.primer_apellido || ''),
        style: 'firma',
      },
      {
        text: this.solicitudSeleted.responsable?.persona.cargo || '',
        style: 'firma',
      },
      { text: 'GAD MUNICIPAL SANTA ISABEL.', style: 'firma' },
    ];

    const estilos: { [key: string]: Style } = {
      encabezado: { fontSize: 12, bold: true, alignment: 'right' },
      destinatario: { fontSize: 12 },
      cuerpo: { fontSize: 12 },
      firma: { fontSize: 12, bold: true },
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

    const documentoPdf = {
      content: contenido,
      styles: estilos,
    };

    pdfMake.createPdf(documentoPdf).open();
  }



}
