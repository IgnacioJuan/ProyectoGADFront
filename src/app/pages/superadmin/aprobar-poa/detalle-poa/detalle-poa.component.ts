import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoacService } from 'src/app/services/poac.service';
import { ActualizarAprobPOA, AprobPoa } from 'src/app/models/AprobPoa';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioAprobPOA } from 'src/app/models/Usuario';
import { ActividadService } from 'src/app/services/actividad.service';
import { DatePipe } from '@angular/common';
import { ActividadesPoaDTO } from 'src/app/models/ActividadesAprobPoa ';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-poa',
  templateUrl: './detalle-poa.component.html',
  styleUrls: ['./detalle-poa.component.css'],
})
export class DetallePoaComponent implements OnInit {
  @ViewChild('miModal') miModal: ElementRef | undefined;
  poa: AprobPoa | null = null;
  usuarios: UsuarioAprobPOA[] | null = null;
  estadoAprobacion: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE' = 'PENDIENTE';
  selectedUserId: number | null = null;
  observacionControl = new FormControl('');
  listaDetalleActividades: ActividadesPoaDTO[] = [];
  idUsuario: any;

  //Manejar estado css de los botones
  isBtnSuccessActive: boolean = false;
  isBtnDangerActive: boolean = false;

  // Definimos los FormControl aquí, pero los inicializamos más tarde
  responsable!: FormControl;
  denominacionprogproyecto!: FormControl;
  supervisionproyecto!: FormControl;
  fechaInicio!: FormControl;
  fechaFinal!: FormControl;
  nombredelproyecto!: FormControl;
  ods!: FormControl;
  objetivopnd!: FormControl;
  objetivopdot!: FormControl;
  objetivoprogproyecto!: FormControl;
  indicardemeta!: FormControl;
  metadelprogproyecto!: FormControl;
  lineabase!: FormControl;
  cobertura!: FormControl;
  localizacion!: FormControl;
  barrio!: FormControl;
  comunidad!: FormControl;
  tipoperiodo!: FormControl;

  constructor(
    private poacService: PoacService,
    private usuarioService: UsuarioService,
    private actService: ActividadService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Parametro enviado desde el componente aprobar poa
    const idParam = this.route.snapshot.paramMap.get('id_poa');
    //Cargar los datos del poa por el id
    this.cargarData(idParam);

    this.usuarioService.getUsuariosAprobPOA().subscribe((data) => {
      this.usuarios = data;
      this.usuarios.map((data) => (this.idUsuario = data.id_persona));
    });
  
  }

  // Nuevas propiedades para la nueva tabla
  dataSource = new MatTableDataSource<ActividadesPoaDTO>();
  columnasActividades: string[] = [
    'nombre_actividad',
    'descripcion',
    'presupuesto_referencial',
    'recursos_propios',
    'recursos_externos',
    'estado',
  ];

  cargarData(idPoa: any){
    this.cargaDatosPoa(idPoa);
    this.cargarActividadesPoa(idPoa);
  }

  cargaDatosPoa(idParam: any) {
    if (idParam) {
      const id_poa = +idParam;
      this.poacService.getPoaAprobById(id_poa).subscribe((data) => {
        this.poa = data;
        // Inicializamos los FormControl con los datos de 'poa'
        this.responsable = new FormControl(this.poa?.responsable || '');
        this.denominacionprogproyecto = new FormControl(
          this.poa?.nombre_proyecto || ''
        );
        this.supervisionproyecto = new FormControl(this.poa?.responsable || '');
        this.fechaInicio = new FormControl(
          this.datePipe.transform(this.poa?.fecha_inicio, 'dd/MM/yyyy') || ''
        );
        this.fechaFinal = new FormControl(
          this.datePipe.transform(this.poa?.fecha_fin, 'dd/MM/yyyy') || ''
        );
        this.ods = new FormControl(this.poa?.nombre_ods || '');
        this.objetivopnd = new FormControl(this.poa?.nombre_pnd || '');
        this.objetivopdot = new FormControl(this.poa?.nombre_pdot || '');
        this.objetivoprogproyecto = new FormControl(
          this.poa?.objetivo_proyecto || ''
        );
        this.indicardemeta = new FormControl(this.poa?.nombre_indicador || '');
        this.metadelprogproyecto = new FormControl(
          this.poa?.meta_proyecto || ''
        );
        this.lineabase = new FormControl(this.poa?.linea_base || '');
        this.cobertura = new FormControl(this.poa?.cobertura || '');
        this.localizacion = new FormControl(this.poa?.localizacion || '');
        this.barrio = new FormControl(this.poa?.barrio || '');
        this.comunidad = new FormControl(this.poa?.comunidad || '');
        this.tipoperiodo = new FormControl(this.poa?.tipo_periodo || '');
      });
    }
  }

  cargarActividadesPoa(idParam: any) {
    this.actService
      .obtenerDetalleActividadesAprob(idParam)
      .subscribe((data) => {
        console.log(data);
        this.listaDetalleActividades = data;
        this.dataSource.data = this.listaDetalleActividades;
      });
  }

  handleAprobacion(estado: 'APROBADO' | 'RECHAZADO') {
    this.estadoAprobacion = estado;
  }

  actualizarAprobacion() {
    console.log('Actualizando aprobación...');
    if (this.poa) {
      const data: ActualizarAprobPOA = {
        estado: this.estadoAprobacion,
        observacion: this.observacionControl.value || '', // Usa directamente this.observacion aquí
      };
      this.poacService
        .actualizarEstadoAprobacion(this.poa.id_poa, data)
        .subscribe((response) => {
          console.log('Estado actualizado:', response);
          // Muestra el SweetAlert
          this.showSuccessAlert();
        });
    }
  }

  handleUserChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedUserId = Number(selectElement.value);
  }

  toggleBtnSuccess() {
    this.isBtnSuccessActive = true;
    this.isBtnDangerActive = false;
    this.estadoAprobacion = 'APROBADO';
  }

  toggleBtnDanger() {
    this.isBtnSuccessActive = false;
    this.isBtnDangerActive = true;
    this.estadoAprobacion = 'RECHAZADO';
    this.observacionControl.setValue(''); // Vacía el textarea cuando se selecciona "Rechazar"
  }

  showSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Evaluación guardada correctamente',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      // Cierra el modal de ng-bootstrap cuando el SweetAlert se cierra
      if (result.isConfirmed) {
        this.cerrarModal();
        setTimeout(() => {

        }, 1000);
        this.router.navigate(['/sup/aprobacion-poa/lista-aprobar-poa']);
      }
    });
  }
  
  abrirModal(content: any) {
    this.modalService.open(content);
  }

  cerrarModal() {
    this.modalService.dismissAll();
  }
}
