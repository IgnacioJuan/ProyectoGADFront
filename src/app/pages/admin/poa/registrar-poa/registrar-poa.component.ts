import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListarProyectosComponent } from '../listar-proyectos/listar-proyectos/listar-proyectos.component';
import { ProjectSelectService } from 'src/app/services/poa/project-select.service';
import { ProjectByIDDto } from 'src/app/interface/ProjectByIdDto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PoaInsertService } from 'src/app/services/poa/poa-insert.service';
import { Poa } from 'src/app/models/Poa';
import { AprobPoa } from 'src/app/models/AprobPoa';
import { SolicitudPoa, SolicitudPoaActividad } from 'src/app/models/SolicitudPoa';



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



  constructor(private cdRef: ChangeDetectorRef, fb: FormBuilder, public dialog: MatDialog, private projectSelectSetvice: ProjectSelectService, private poaInsertService: PoaInsertService) {
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
  ngOnInit(): void {
    this.getProject(0);
    this.dataSource = [];
  }

  openDialogProjects(): void {
    const dialogRef = this.dialog.open(ListarProyectosComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getProject(result.id_proyecto);
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
  periodo: Periodo[] = [
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
  }

  guardar() {
    this.componentes = this.formComponentes.value;


    //validar componentes values
    if (this.componentes.valor_uno == null || this.componentes.valor_uno == undefined || this.componentes.valor_uno == 0) {
      this.componentes.valor_uno = 0;
    }
    if (this.componentes.valor_dos == null || this.componentes.valor_dos == undefined || this.componentes.valor_dos == 0) {
      this.componentes.valor_dos = 0;
    }
    if (this.componentes.valor_tres == null || this.componentes.valor_tres == undefined || this.componentes.valor_tres == 0) {
      this.componentes.valor_tres = 0;
    }
    if (this.componentes.valor_cuatro == null || this.componentes.valor_cuatro == undefined || this.componentes.valor_cuatro == 0) {
      this.componentes.valor_cuatro = 0;
    }
    const valorUno = this.componentes.valor_uno.toString();
    const valorDos = this.componentes.valor_dos.toString();
    const valorTres = this.componentes.valor_tres.toString();
    const valorCuatro = this.componentes.valor_cuatro.toString();
    this.componentes.valor_uno = Number(valorUno);
    this.componentes.valor_dos = Number(valorDos);
    this.componentes.valor_tres = Number(valorTres);
    this.componentes.valor_cuatro = Number(valorCuatro);

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
    this.i = index;
  }

  actualizar(index: number) {
    //actualizar datasource con los valores del componente editado
    //elimiar el componente en el datasource segun el index y agregar el componente editado


    this.componentes = this.formComponentes.value;


    //validar componentes values
    if (this.componentes.valor_uno == null || this.componentes.valor_uno == undefined || this.componentes.valor_uno == 0) {
      this.componentes.valor_uno = 0;
    }
    if (this.componentes.valor_dos == null || this.componentes.valor_dos == undefined || this.componentes.valor_dos == 0) {
      this.componentes.valor_dos = 0;
    }
    if (this.componentes.valor_tres == null || this.componentes.valor_tres == undefined || this.componentes.valor_tres == 0) {
      this.componentes.valor_tres = 0;
    }
    if (this.componentes.valor_cuatro == null || this.componentes.valor_cuatro == undefined || this.componentes.valor_cuatro == 0) {
      this.componentes.valor_cuatro = 0;
    }
    const valorUno = this.componentes.valor_uno.toString();
    const valorDos = this.componentes.valor_dos.toString();
    const valorTres = this.componentes.valor_tres.toString();
    const valorCuatro = this.componentes.valor_cuatro.toString();
    this.componentes.valor_uno = Number(valorUno);
    this.componentes.valor_dos = Number(valorDos);
    this.componentes.valor_tres = Number(valorTres);
    this.componentes.valor_cuatro = Number(valorCuatro);

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
  metaPlanificada: number = 10;
  enviar_solictud: boolean = true;
  solicitudPoa: SolicitudPoa = new SolicitudPoa();
  solicitudPoaActividad: SolicitudPoaActividad = new SolicitudPoaActividad();
  //obten el id del usaurio logueado del storage session
  solicitud() {
    this.validaciones();
    if (this.enviar_solictud) {
      this.solicitudPoa.id_proyecto = this.proyecto;
      this.solicitudPoa.meta_planificada = this.metaPlanificada;
      this.solicitudPoa.coberura = this.cobertura;
      this.solicitudPoa.barrio = this.barrio;
      this.solicitudPoa.comunidad = this.comunidad;
      this.solicitudPoa.localizacion = this.localizacion;
      this.solicitudPoa.tipo_periodo = this.selectedPeriod;
      this.poaInsertService.crear(this.solicitudPoa).subscribe((data: any) => {
        if (data) {
          this.poaInsertService.solicitarAprobacion(data.id_poa, this.id_super_admin, this.proyecto).subscribe((aprobPoa: any) => {
            console.log("aprobacion poa", aprobPoa);
            if (aprobPoa) {

              this.dataSource.forEach(element => {
                console.log(element);
                this.poaInsertService.crearActividad(element.nombre, element.observacion, element.recursos_propios, element.presupuesto_referencial).subscribe((actividad: any) => {
                  if (actividad) {
                    this.poaInsertService.solicitarAprobacionActividad(this.id_super_admin, actividad.id_actividad, data.id_poa).subscribe((aprobActividad: any) => {
                      if (aprobActividad) {
                        console.log(aprobActividad);
                        if (element.recursos_externos > 0) {
                          this.poaInsertService.crearPresupuestoExterno(element.recursos_externos, actividad.id_actividad, element.institucion_beneficiaria, "").subscribe((presupuestoExterno: any) => {
                            if (presupuestoExterno) {
                              console.log(presupuestoExterno);
                            }
                          });
                        }
                        this.poaInsertService.crearPeriodo(element.valor_uno, actividad.id_actividad, 1).subscribe((periodo: any) => {
                          if (periodo) {
                            console.log(periodo);
                          }
                        });
                        this.poaInsertService.crearPeriodo(element.valor_dos, actividad.id_actividad, 2).subscribe((periodo: any) => {
                          if (periodo) {
                            console.log(periodo);
                          }
                        });
                        this.poaInsertService.crearPeriodo(element.valor_tres, actividad.id_actividad, 3).subscribe((periodo: any) => {
                          if (periodo) {
                            console.log(periodo);
                          }
                        });
                        this.poaInsertService.crearPeriodo(element.valor_cuatro, actividad.id_actividad, 4).subscribe((periodo: any) => {
                          if (periodo) {
                            console.log(periodo);
                            //recargar la pagina forzadamente
                          }
                        });
                      }
                    });
                  }
                });
              });
            }
          });

          Swal.fire({
            icon: 'success',
            title: 'Solicitud enviada correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          // this.enviar_solictud = true;
          // this.solicitudPoa = new SolicitudPoa();
          // this.dataSource = [];
          // this.refrescar();
          // this.getProject(0);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al enviar la solicitud',
          });
        }
      });
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
    }
    //comprobar que dataSource no sea null
    if (this.dataSource.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe ingresar al menos una actividad',
      });
      this.enviar_solictud = false;
    }
    // //comprobar que cobertura, barrio, comunidad, localizacion y metaPlanificada no sean null o undefined o ""
    // if (this.cobertura == null || this.cobertura == undefined || this.cobertura == "") {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Debe ingresar una cobertura',
    //   });
    //   this.enviar_solictud = false;
    // }
    // if (this.barrio == null || this.barrio == undefined || this.barrio == "") {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Debe ingresar un barrio',
    //   });
    //   this.enviar_solictud = false;
    // }
    // if (this.comunidad == null || this.comunidad == undefined || this.comunidad == "") {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Debe ingresar una comunidad',
    //   });
    //   this.enviar_solictud = false;
    // }
    // if (this.localizacion == null || this.localizacion == undefined || this.localizacion == "") {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Debe ingresar una localizacion',
    //   });
    //   this.enviar_solictud = false;
    // }
    // if (this.metaPlanificada == null || this.metaPlanificada == undefined || this.metaPlanificada == 0) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Debe ingresar una meta planificada',
    //   });
    //   this.enviar_solictud = false;
    // }
  }
}

