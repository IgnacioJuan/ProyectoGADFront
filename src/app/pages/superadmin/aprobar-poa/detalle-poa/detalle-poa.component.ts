import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PoacService } from 'src/app/services/poac.service';
import { ActualizarAprobPOA, AprobPoa } from 'src/app/models/AprobPoa';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioAprobPOA } from 'src/app/models/Usuario';

export interface DataDetallePoa {
  nombre: string;
  objetivo: string;
  meta: string;
  ver: string;
  acciones: string;
}

const ELEMENT_DATA: DataDetallePoa[] = [
  { nombre: "Determinar porcentaje anual de reciclaje", objetivo: 'Objetivo 6 Agua Limpia y Saneamiento', meta: '6 nuevos reservorios', ver: 'Ver', acciones: 'Acciones', },
];

@Component({
  selector: 'app-detalle-poa',
  templateUrl: './detalle-poa.component.html',
  styleUrls: ['./detalle-poa.component.css']
})
export class DetallePoaComponent implements OnInit {

  poa: AprobPoa | null = null;
  usuarios: UsuarioAprobPOA[] | null = null;
  estadoAprobacion: 'APROBADO' | 'RECHAZADO' = 'RECHAZADO';
  selectedUserId: number | null = null;
  observacionControl = new FormControl('');

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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_poa');
    if (idParam) {
      const id_poa = +idParam;
      this.poacService.getPoaAprobById(id_poa).subscribe(data => {
        this.poa = data;

        // Inicializamos los FormControl con los datos de 'poa'
        this.responsable = new FormControl(this.poa?.responsable || '');
        this.denominacionprogproyecto = new FormControl(this.poa?.nombre_proyecto || '');
        this.supervisionproyecto = new FormControl(this.poa?.responsable || '');
        this.fechaInicio = new FormControl(this.poa?.fecha_inicio || '');
        this.fechaFinal = new FormControl(this.poa?.fecha_fin || '');
        this.ods = new FormControl(this.poa?.nombre_ods || '');
        this.objetivopnd = new FormControl(this.poa?.nombre_pnd || '');
        this.objetivopdot = new FormControl(this.poa?.nombre_pdot || '');
        this.objetivoprogproyecto = new FormControl(this.poa?.objetivo_proyecto || '');
        this.indicardemeta = new FormControl(this.poa?.nombre_indicador || '');
        this.metadelprogproyecto = new FormControl(this.poa?.meta_proyecto || '');
        this.lineabase = new FormControl(this.poa?.linea_base || '');
        this.cobertura = new FormControl(this.poa?.cobertura || '');
        this.localizacion = new FormControl(this.poa?.localizacion || '');
        this.barrio = new FormControl(this.poa?.barrio || '');
        this.comunidad = new FormControl(this.poa?.comunidad || '');
        this.tipoperiodo = new FormControl(this.poa?.tipo_periodo || '');

      });
    }
    this.usuarioService.getUsuariosAprobPOA().subscribe(data => {
      this.usuarios = data;
    })
  }
  handleAprobacion(estado: 'APROBADO' | 'RECHAZADO') {
    this.estadoAprobacion = estado;
  }

  actualizarAprobacion() {
    
    console.log("Actualizando aprobación...")
    if (this.poa) {
      const data: ActualizarAprobPOA = {
        estado: this.estadoAprobacion,
        observacion: this.observacionControl.value || '' // Usa directamente this.observacion aquí
      };
      this.poacService.actualizarEstadoAprobacion(this.poa.id_poa, data).subscribe(response => {
        console.log('Estado actualizado:', response);
      });
    }
  }

  handleUserChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedUserId = Number(selectElement.value);
  }
  // Nuevas propiedades para la nueva tabla
  columnasActividades: string[] = ['id_actividad', 'nombre_actividad', 'descripcion', 'devengado', 'estado', 'codificado', 'presupuesto_referencial', 'recursos_propios','ver'];
  dataSource = ELEMENT_DATA;  // Puedes modificar ELEMENT_DATA para que contenga las propiedades 'objetivo', 'meta', 'ver', 'acciones', y 'actividades'.

}

