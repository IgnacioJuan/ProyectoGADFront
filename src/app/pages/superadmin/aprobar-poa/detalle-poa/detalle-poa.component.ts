import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoacService } from 'src/app/services/poac.service';
import { ActualizarAprobPOA, AprobPoa } from 'src/app/models/AprobPoa';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioAprobPOA } from 'src/app/models/Usuario';
import { ActividadService } from 'src/app/services/actividad.service';
import { ActividadesPoaDTO } from 'src/app/models/ActividadesAprobPoa ';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalle-poa',
  templateUrl: './detalle-poa.component.html',
  styleUrls: ['./detalle-poa.component.css'],
})
export class DetallePoaComponent implements OnInit {

  //POA
  poaAprob: AprobPoa | undefined;

  @ViewChild('miModal') miModal: ElementRef | undefined;
  //Usuario que evalua
  usuarios: UsuarioAprobPOA[] | null = null;
  
  //Evaluacion
  estadoAprobacion: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE' = 'PENDIENTE';
  selectedUserId: number | null = null;
  observacionControl = new FormControl('');
  idUsuario: any;

  //Actividades del POA
  listaDetalleActividades: ActividadesPoaDTO[] = [];

  //Manejar estado css de los botones
  isBtnSuccessActive: boolean = false;
  isBtnDangerActive: boolean = false;

  constructor(
    private poacService: PoacService,
    private usuarioService: UsuarioService,
    private actService: ActividadService,
    private route: ActivatedRoute,
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

  //Carga de datos
  cargarData(idPoa: any){
    this.cargaDatosPoa(idPoa);
    this.cargarActividadesPoa(idPoa);
  }

  cargaDatosPoa(idParam: any) {
    if (idParam) {
      this.poacService.getPoaAprobById(idParam).subscribe(data => {
        this.poaAprob = data;
      });
    } else {
      console.log("No hay parametro");
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
    if (this.poaAprob) {
      const data: ActualizarAprobPOA = {
        estado: this.estadoAprobacion,
        observacion: this.observacionControl.value || '', // Usa directamente this.observacion aquí
      };
      this.poacService
        .actualizarEstadoAprobacion(this.poaAprob.id_poa, data)
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

  verPoas(){
    this.router.navigate(['/sup/aprobacion-poa/lista-aprobar-poa']);
  }
}
