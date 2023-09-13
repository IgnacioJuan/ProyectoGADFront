import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoacService } from 'src/app/services/poac.service';
import { ActualizarAprobPOA, AprobPoa } from 'src/app/models/AprobPoa';
import { ActividadService } from 'src/app/services/actividad.service';
import { ActividadesPoaDTO } from 'src/app/models/ActividadesAprobPoa ';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo_DTO } from 'src/app/interface/Periodo_DTO';
import { LoginService } from 'src/app/services/login.service';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { PeriodoTotalPOA_DTO } from 'src/app/interface/PeriodoTotalPOA_DTO';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';

@Component({
  selector: 'app-detalle-poa',
  templateUrl: './detalle-poa.component.html',
  styleUrls: ['./detalle-poa.component.css'],
})
export class DetallePoaComponent implements OnInit {
  //Usuario logueado
  user: any = null;
  isLoggedIn = false;

  //Formacion del correo
  correoEmi!: string; //Correo del Usuario que creo la aprobacion
  correoRecep: string[] = []; //Correo del Usuario que creo el poa
  subject: string = 'Estado de aprobacion del POA actualizado';
  message: string = 'El estado de su POA a sido ';
  detallePoa: string = 'Detalle del POA \n';

  //POA
  poaAprob!: AprobPoa;

  //Periodos por actividades
  periodosPoa!: Periodo_DTO[];

  //Totales del POA
  totalesPoa!: PeriodoTotalPOA_DTO;

  //Conteo de semestres
  nperiodo!: number;
  tipSeguimiento: string = '';

  //Total de recursos propios
  trpropios!: number;

  //Total de recursos externos
  trexternos!: number;

  //Total del periodo
  totalf: number=0;

  //valores periodo
  valores: number[]=[];

  //Porcentajes
  porcentajes: number[]=[];

  @ViewChild('evaluarPOAModal') evaluarPOAModal: any;

  //Evaluacion
  selectedUserId!: number;
  observacionControl = new FormControl('');
  idUsuario: any;

  //Actividades del POA
  listaDetalleActividades: ActividadesPoaDTO[] = [];

  //Variable para estado
  public estado = '';
  public observacion = '';

  constructor(
    private poacService: PoacService,
    private emailService: EmailServiceService,
    private actService: ActividadService,
    private route: ActivatedRoute,
    private router: Router,
    private periodoService: PeriodoService,
    public login: LoginService,
    private loadingService: LoadingServiceService
  ) {this.loadingService.show();}

  ngOnInit(): void {
    //Parametro enviado desde el componente aprobar poa
    const idParam = this.route.snapshot.paramMap.get('id_poa');
    //Cargar los datos del poa por el id
    this.cargarData(idParam);
    this.capturarDatosUsuarioLog();
    this.loadingService.hide();
    }

  // Nuevas propiedades para la nueva  tabla
  dataSource = new MatTableDataSource<ActividadesPoaDTO>();
  columnasActividades: string[] = [
    'nombre_actividad',
    'descripcion',
    'presupuesto_referencial',
    'recursos_propios',
    'recursos_externos',
  ];

  //Carga de datos
  cargarData(idPoa: any) {
    
    this.cargaDatosPoa(idPoa);
    this.cargarActividadesPoa(idPoa);
    this.cargarPeriodosTotales(idPoa);
    setTimeout(() => {}, 2000);
   
  }

  cargaDatosPoa(idParam: any) {
    if (idParam) {
      this.poacService.getPoaAprobById(idParam).subscribe(
        (data) => {
          this.poaAprob = data;
          console.log(this.poaAprob);
          this.tipSeguimiento=this.poaAprob.tipo_periodo;
          this.correoRecep.push(this.poaAprob.correo_responsable);
        },
        (error) => {
          console.error('Error al obtener datos:', error);
        }
      );
    } else {
      console.log('No hay parametro');
    }
    this.periodoService.getTotalesPoa(idParam).subscribe(
      (data) => {
        this.totalesPoa = data;
        console.log(this.totalesPoa);
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  
  cargarActividadesPoa(idParam: any) {
    this.actService
      .obtenerDetalleActividadesAprob(idParam)
      .subscribe((data) => {
        console.log('Actividades: ' + data);
        this.listaDetalleActividades = data;
        this.dataSource.data = this.listaDetalleActividades;

        // Utilizar reduce para calcular los totales
        const totals = this.listaDetalleActividades.reduce((acc, actividad) => {
          acc[0] += actividad.recursos_propios;
          acc[1] += actividad.recursos_externos;
          return acc;
        }, [0, 0]);

        this.valores[0] = totals[0];
        this.valores[1] = totals[1];
        this.totalf = this.valores[0] + this.valores[1];
        console.log(this.totalf);
        
        this.calcularPeriodos(this.totalf);

        console.log('Total recursos propios:', this.valores[0]);
        console.log('Total recursos externos:', this.valores[1]);
      });
}

  capturarDatosUsuarioLog() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
  }

  cargarPeriodosTotales(idParam: number) {
    this.periodoService
      .obtenerPeriodosByIdPoa(idParam)
      .subscribe((data) => {
        console.log(data);
        this.periodosPoa = data;
        this.calcularPeriodos(this.totalf); 
      });
}

  actualizarAprobacion() {
    // Verificar si el estado es "RECHAZADO" y la observación está vacía
    if (this.estado === 'RECHAZADO' && !this.observacion) {
      Swal.fire('Advertencia', 'La observación es obligatoria ', 'warning');
      return;
    } else {
      if (this.poaAprob) {
        const data: ActualizarAprobPOA = {
          estado: this.estado,
          observacion: this.observacion,
        };
        this.poacService
          .actualizarEstadoAprobacion(this.poaAprob.id_poa, data)
          .subscribe((response) => {
            console.log('Estado actualizado:', response);
            this.emailService
              .sendEmail(
                this.correoRecep,
                this.subject,
                this.message +
                  this.estado +
                  '\n' +
                  this.detallePoa +
                  'DENOMINACION DEL PROGRAMA PROYECTO: ' +
                  this.poaAprob.nombre_proyecto +
                  '\n' +
                  'DESCRIPCION DEL PROGRAMA PROYECTO: ' +
                  (this.poaAprob.descripcion_proyecto || 'No definido') +
                  '\n' +
                  'AREA: ' +
                  (this.poaAprob.area || 'No definido') +
                  '\n' +
                  'SUPERVISOR: ' +
                  this.user.persona.primer_nombre +
                  '  ' +
                  this.user.persona.primer_apellido +
                  '\n' +
                  'AÑO DE EJECUCIÓN DEL PROYECTO: ' +
                  this.poaAprob.fecha_inicio +
                  ' - ' +
                  this.poaAprob.fecha_fin +
                  '\n' +
                  '\nObservación:\n ' +
                  this.observacion
              )
              .subscribe((responseEmail) => {
                console.log('Email enviado:', responseEmail);
                console.log('Email enviado:', this.correoRecep);
              });
            // Muestra el SweetAlert
            this.showSuccessAlert();
          });
      }
    }
  }

  calcularPeriodos(totalf: number){
    if (!this.periodosPoa || this.periodosPoa.length < 3) {
        return; 
    }
    this.porcentajes = this.periodosPoa.slice(0, 3).map(periodo => totalf * (periodo.porcentaje / 100));
}
  /*calcularPeriodos(totalf: number){
    //Inicializar los porcentajes
    this.porcentajes[0]=0;
    this.porcentajes[1]=0;
    this.porcentajes[2]=0;

    if (this.periodosPoa && this.periodosPoa.length >= 3) {
        this.porcentajes[0]=totalf*(this.periodosPoa[0].porcentaje/100);
        this.porcentajes[1]=totalf*(this.periodosPoa[1].porcentaje/100);
        this.porcentajes[2]=totalf*(this.periodosPoa[2].porcentaje/100);     
    }
}
*/
  showSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Evaluación guardada correctamente',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      // Cierra el modal de ng-bootstrap cuando el SweetAlert se cierra
      if (result.isConfirmed) {
        setTimeout(() => {}, 1000);
        this.router.navigate(['/sup/aprobacion-poa/lista-aprobar-poa']);
      }
    });
  }

  verPoas() {
    this.router.navigate(['/sup/aprobacion-poa/lista-aprobar-poa']);
  }

  Limpiar() {
    this.estado = '';
    this.observacion = '';
  }

  Rechazar() {
    this.estado = 'RECHAZADO';
  }
  Aprobar() {
    this.estado = 'APROBADO';
  }

}
