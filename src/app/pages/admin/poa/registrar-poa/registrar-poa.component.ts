import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { ProjectByIDDto } from 'src/app/interface/ProjectByIdDto';
import { SolicitudPoa, SolicitudPoaActividad } from 'src/app/models/SolicitudPoa';
import { LoginService } from 'src/app/services/login.service';
import { PoaInsertService } from 'src/app/services/poa/poa-insert.service';
import { ProjectSelectService } from 'src/app/services/poa/project-select.service';
import Swal from 'sweetalert2';
import { ListarProyectosComponent } from '../listar-proyectos/listar-proyectos/listar-proyectos.component';



export class Act {
  nombre!: string;
  observacion!: string;
  recursos_propios!: number;
  recursos_externos!: number;
  institucion_beneficiaria!: string;
  presupuesto_referencial!: number;
  valor_uno!: number;
  valor_dos!: number;
  valor_tres!: number;
  valor_cuatro!: number;
}

interface Periodo {
  value: string;
}


@Component({
  selector: 'app-registrar-poa',
  templateUrl: './registrar-poa.component.html',
  styleUrls: ['./registrar-poa.component.css']
})
export class RegistrarPoaComponent implements OnInit {
  currentDate: Date = new Date();
  displayedColumns: string[] = ['nombre', 'presupuesto_referencial', 'inversion', 'eliminar'];
  dataSource: Act[] = [];
  projectSelect: ProjectByIDDto = {
    id_proyecto: 0,
    area: '',
    cargo: '',
    nombre: '',
    codigo: '',
    nombre_componente: '',
    nombre_objetivo_ods: '',
    nombre_objetivo_pnd: '',
    nombre_objetivo_pdot: '',
    objetivo_proyecto: '',
    nombre_indicador: '',
    nombre_meta_pdot: '',
    nombre_programa: '',
    nombre_completo_persona: '',
    rango_fechas: ''
  };

  totalActividades: number = 0;
  recursosPropios: number = 0;
  recursosExternos: number = 0;



  constructor(private cdRef: ChangeDetectorRef, fb: FormBuilder, public dialog: MatDialog, private projectSelectSetvice: ProjectSelectService, private poaInsertService: PoaInsertService, public login: LoginService, private loadingService: LoadingServiceService) {
    this.formComponentes = fb.group({

      nombre: ['', Validators.required],
      observacion: [''],
      recursos_propios: [''],
      recursos_externos: [''],
      institucion_beneficiaria: [''],
      valor_uno: [''],
      valor_dos: [''],
      valor_tres: [''],
      valor_cuatro: [''],



    });
  }

  user: any = null;
  persona: any = null;
  ngOnInit(): void {
    this.user = this.login.getUser();
    this.persona = this.user.persona;
    this.getProject(0);
    this.dataSource = [];
  }

  openDialogProjects(): void {

    this.loadingService.show();
    const dialogRef = this.dialog.open(ListarProyectosComponent, {
      data: {},
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.id_proyecto == 0 || result.id_proyecto == undefined || result.id_proyecto == null) {
        this.loadingService.hide();
        return;
      }
      this.getProject(result.id_proyecto);
      this.loadingService.hide();
    });
  }

  proyecto: number = 0;
  id_super_admin: number = 0;
  getProject(idProyecto: number) {
    this.projectSelectSetvice.getProject(idProyecto).subscribe((data: any) => {
      if (data.length > 0) {
        this.projectSelect = data[0];
        this.proyecto = data[0].id_proyecto;
        this.id_super_admin = data[0].id_super_admin;
      }
    })
  }

  getActivities() {
    // Suponiendo que this.componentes y this.dataSource son arreglos de objetos
    // Agregar los elementos de this.componentes a this.dataSource
    this.dataSource = [...this.dataSource, this.componentes];
    this.cdRef.detectChanges();
    console.log(this.dataSource);

    this.refrescar();

  }

  //SELECT
  periodo: any = [
    { value: 'TRIMESTRE' },
    { value: 'CUATRIMESTRE' },
  ];
  selectedPeriod = this.periodo[1].value;



  //MODAL

  validEdit: boolean = false;

  public componentes = new Act();
  listaComponentes: Act[] = [];
  formComponentes: FormGroup;

  valueUno: number = 0;
  valueDos: number = 0;
  valueTres: number = 0;
  valueCuatro: number = 0;

  limpiarFormulario() {
    this.formComponentes.reset();
    this.componentes = new Act();
    this.allComplete = false;
    this.task = {
      valor: 0,
      completed: false,
      position: 0,
      subtasks: [
        { valor: 0, completed: false, position: 1, },
        { valor: 0, completed: false, position: 2, },
        { valor: 0, completed: false, position: 3, },
        { valor: 0, completed: false, position: 4, }
      ],
    };
  }

  guardar() {
    this.componentes = this.formComponentes.value;
    let count = 0;
    if (this.selectedPeriod === 'CUATRIMESTRE') {
      this.task.subtasks?.splice(3, 1);
      this.componentes.valor_cuatro = 0;
    };
    this.task.subtasks?.forEach(element => {
      if (element.completed) {
        count++;
      }
    });
    if (count == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar al menos un ' + this.selectedPeriod.toLowerCase() + '',
      })
      return;
    } else {
      this.task.subtasks?.forEach(element => {
        if (element.completed) {
          element.valor = 100 / count;
        }
        if (element.position == 1) {
          this.componentes.valor_uno = element.valor;
        }
        if (element.position == 2) {
          this.componentes.valor_dos = element.valor;
        }
        if (element.position == 3) {
          this.componentes.valor_tres = element.valor;
        }
        if (element.position == 4) {
          this.componentes.valor_cuatro = element.valor;
        }
      });

      console.log(this.componentes);

      //sumar values
      const valueTotal = this.componentes.valor_uno + this.componentes.valor_dos + this.componentes.valor_tres + this.componentes.valor_cuatro;

      if (this.componentes.recursos_propios == null || this.componentes.recursos_propios == undefined || this.componentes.recursos_propios == 0) {
        this.componentes.recursos_propios = 0;
      }
      if (this.componentes.recursos_externos == null || this.componentes.recursos_externos == undefined || this.componentes.recursos_externos == 0) {
        this.componentes.recursos_externos = 0;
      }
      const recursoPropio = this.componentes.recursos_propios.toString();
      const recursoExterno = this.componentes.recursos_externos.toString();
      this.componentes.recursos_propios = Number(recursoPropio);
      this.componentes.recursos_externos = Number(recursoExterno);
      this.componentes.presupuesto_referencial = this.componentes.recursos_propios + this.componentes.recursos_externos;

      if (this.componentes.presupuesto_referencial == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Debe ingresar un valor en recursos propios o externos',
        })
      } else {
        if (this.componentes.recursos_externos > 0 && (this.componentes.institucion_beneficiaria == null || this.componentes.institucion_beneficiaria == undefined || this.componentes.institucion_beneficiaria == "")) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe ingresar una institucion beneficiaria',
          });
        } else {
          if (valueTotal != 100) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'La suma de los ' + this.selectedPeriod.toLowerCase() + 's debe ser 100%',
            })
          } else {
            this.getActivities();
            this.limpiarFormulario();
          }
        }
      }
    }
  }

  i: number = 0;
  editarInformacion(index: number) {
    console.log(index);
    this.componentes = this.dataSource[index];
    this.formComponentes = new FormGroup({
      nombre: new FormControl(this.componentes.nombre),
      observacion: new FormControl(this.componentes.observacion),
      recursos_propios: new FormControl(this.componentes.recursos_propios),
      recursos_externos: new FormControl(this.componentes.recursos_externos),
      institucion_beneficiaria: new FormControl(this.componentes.institucion_beneficiaria),
      presupuesto_referencial: new FormControl(this.componentes.presupuesto_referencial),
      valor_uno: new FormControl(this.componentes.valor_uno),
      valor_dos: new FormControl(this.componentes.valor_dos),
      valor_tres: new FormControl(this.componentes.valor_tres),
      valor_cuatro: new FormControl(this.componentes.valor_cuatro),
    });
    this.task.subtasks?.forEach(element => {
      if (element.position == 1) {
        if (this.componentes.valor_uno > 0) {
          element.completed = true;
        } else {
          element.completed = false;
        }
      }
      if (element.position == 2) {
        if (this.componentes.valor_dos > 0) {
          element.completed = true;
        } else {
          element.completed = false;
        }
      }
      if (element.position == 3) {
        if (this.componentes.valor_tres > 0) {
          element.completed = true;
        } else {
          element.completed = false;
        }
      }
      if (element.position == 4) {
        if (this.componentes.valor_cuatro > 0) {
          element.completed = true;
        } else {
          element.completed = false;
        }
      }
    });
    this.i = index;
  }

  actualizar(index: number) {
    this.componentes = this.formComponentes.value;
    let count = 0;
    this.task.subtasks?.forEach(element => {
      if (element.completed) {
        count++;
      }
    });
    if (count == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar al menos un ' + this.selectedPeriod.toLowerCase() + '',
      })
      return;
    } else {
      this.task.subtasks?.forEach(element => {
        if (element.completed) {
          element.valor = 100 / count;
        }
        if (element.position == 1) {
          this.componentes.valor_uno = element.valor;
        }
        if (element.position == 2) {
          this.componentes.valor_dos = element.valor;
        }
        if (element.position == 3) {
          this.componentes.valor_tres = element.valor;
        }
        if (element.position == 4) {
          this.componentes.valor_cuatro = element.valor;
        }
      });
    }

    console.log(this.componentes);

    //sumar values
    const valueTotal = this.componentes.valor_uno + this.componentes.valor_dos + this.componentes.valor_tres + this.componentes.valor_cuatro;

    if (this.componentes.recursos_propios == null || this.componentes.recursos_propios == undefined || this.componentes.recursos_propios == 0) {
      this.componentes.recursos_propios = 0;
    }
    if (this.componentes.recursos_externos == null || this.componentes.recursos_externos == undefined || this.componentes.recursos_externos == 0) {
      this.componentes.recursos_externos = 0;
    }
    const recursoPropio = this.componentes.recursos_propios.toString();
    const recursoExterno = this.componentes.recursos_externos.toString();
    this.componentes.recursos_propios = Number(recursoPropio);
    this.componentes.recursos_externos = Number(recursoExterno);
    this.componentes.presupuesto_referencial = this.componentes.recursos_propios + this.componentes.recursos_externos;

    if (this.componentes.presupuesto_referencial == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe ingresar un valor en recursos propios o externos',
      })
    } else {
      if (this.componentes.recursos_externos > 0 && (this.componentes.institucion_beneficiaria == null || this.componentes.institucion_beneficiaria == undefined || this.componentes.institucion_beneficiaria == "")) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Debe ingresar una institucion beneficiaria',
        });
      } else {
        if (valueTotal != 100) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La suma de los ' + this.selectedPeriod.toLowerCase() + 's debe ser 100%',
          })
        } else {
          this.dataSource.splice(index, 1);
          console.log(this.dataSource);
          this.getActivities();
          this.limpiarFormulario();
        }
      }
    }
  }

  eliminar(index: number) {
    this.listaComponentes = this.dataSource;
    this.dataSource = [];
    this.cdRef.detectChanges();
    console.log(this.dataSource);
    this.listaComponentes.splice(index, 1);
    this.dataSource = this.listaComponentes;
    this.cdRef.detectChanges();
    this.refrescar();
  }

  refrescar() {
    // Inicializar el total de actividades en 0
    this.totalActividades = 0;
    this.valueUno = 0;
    this.valueDos = 0;
    this.valueTres = 0;
    this.valueCuatro = 0;
    this.recursosPropios = 0;
    this.recursosExternos = 0;

    // Calcular el total sumando la propiedad presupuesto_referencial de cada elemento en this.dataSource
    this.dataSource.forEach(element => {
      if (typeof element.presupuesto_referencial === 'number') {
        this.totalActividades += element.presupuesto_referencial;
        this.valueUno += (element.valor_uno / 100) * element.presupuesto_referencial;
        this.valueDos += (element.valor_dos / 100) * element.presupuesto_referencial;
        this.valueTres += (element.valor_tres / 100) * element.presupuesto_referencial;
        this.valueCuatro += (element.valor_cuatro / 100) * element.presupuesto_referencial;
        this.recursosPropios += element.recursos_propios;
        this.recursosExternos += element.recursos_externos;
      }
    });
  }

  //proceso de solicitud verificacion 

  cobertura: string = "";
  barrio: string = "";
  comunidad: string = "";
  localizacion: string = "";
  metaPlanificada: number = 0;
  enviar_solictud: boolean = true;
  solicitudPoa: SolicitudPoa = new SolicitudPoa();
  solicitudPoaActividad: SolicitudPoaActividad = new SolicitudPoaActividad();
  //obten el id del usaurio logueado del storage session
  async solicitud() {


    if (this.projectSelect.id_proyecto == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar un proyecto',
      });
    } else {
      this.solicitudPoa.id_proyecto = this.proyecto;
      this.solicitudPoa.meta_planificada = this.metaPlanificada;
      this.solicitudPoa.cobertura = this.cobertura;
      this.solicitudPoa.barrio = this.barrio;
      this.solicitudPoa.comunidad = this.comunidad;
      this.solicitudPoa.localizacion = this.localizacion;
      this.solicitudPoa.tipo_periodo = this.selectedPeriod;
      this.loadingService.show();
      this.poaInsertService.crear(this.solicitudPoa, this.user.id, this.id_super_admin).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.dataSource.forEach(element => {
            this.poaInsertService.crearActividad(
              element.nombre,
              element.institucion_beneficiaria,
              element.recursos_externos,
              element.valor_uno,
              element.valor_dos,
              element.valor_tres,
              element.valor_cuatro,
              element.observacion,
              data.id_poa,
              this.id_super_admin,
              element.recursos_propios,
              element.presupuesto_referencial
            ).subscribe((actividad: any) => {
              console.log(actividad);
            });
          })
          this.loadingService.hide();
          Swal.fire({
            icon: 'success',
            title: 'Solicitud enviada',
            text: 'Su solicitud ha sido enviada con exito',
            //despues de apretar el boton de ok redirecciona a la pagina de inicio
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/use/user-dashboard";
            }
          });
        }
      })
    }
  }

  validaciones() {
    //comprobar que projectSelect no sea null
    if (this.projectSelect.id_proyecto == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar un proyecto',
      });
      this.enviar_solictud = false;
      if (this.dataSource.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Debe ingresar al menos una actividad',
        });
        this.enviar_solictud = false;
      } else {
        this.enviar_solictud = true;
      }
    }

  }


  //section
  task: Task = {
    valor: 0,
    completed: false,
    position: 0,
    subtasks: [
      { valor: 0, completed: false, position: 1, },
      { valor: 0, completed: false, position: 2, },
      { valor: 0, completed: false, position: 3, },
      { valor: 0, completed: false, position: 4, }
    ],
  };



  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  getSubtasks() {
    if (this.selectedPeriod === 'CUATRIMESTRE') {

      if (this.task.subtasks === undefined) {
        return this.task.subtasks;

      } else {
        return this.task.subtasks.slice(0, 3);
      }

    } else {
      return this.task.subtasks;
    }
  }


}

export interface Task {
  valor: number;
  completed: boolean;
  position: number;
  subtasks?: Task[];
}