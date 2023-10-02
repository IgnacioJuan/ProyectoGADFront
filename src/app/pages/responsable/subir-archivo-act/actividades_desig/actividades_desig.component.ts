import { Component, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { Actividad_arch } from 'src/app/services/actividad_arch';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
//import { ModeloService } from 'src/app/services/modelo.service';
import { Archivo } from 'src/app/models/Archivo';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { Poa_proyec_dto } from 'src/app/interface/poa_proyec_dto';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { PresupuestoExterno } from 'src/app/models/PresupuestoExterno';
import { ReformaSuplemento } from 'src/app/models/ReformaSuplemento';
import { ReformaTraspasoI } from 'src/app/models/ReformaTraspasoI';
import { ReformaTraspasoD } from 'src/app/models/ReformaTraspasoD';
import { PresupuestoExternoService } from 'src/app/services/presupuestoexterno.service';
import { ReformaTraspasoIService } from 'src/app/services/reformatraspaso-i.service';
import { ReformaSuplementoService } from 'src/app/services/reformasuplemento.service';
import { ReformaTraspasoDService } from 'src/app/services/reformatraspaso-d.service';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { actividad_archi_projection } from 'src/app/models/actividad_archi_projection';

@Component({
  selector: 'app-actividades_desig',
  templateUrl: './actividades_desig.component.html',
  styleUrls: ['./actividades_desig.component.css'],
})
export class Actividades_desigComponent implements OnInit {
  act!: actividad_archi_projection[];
  acti: Actividad_arch[] = [];
  actix!: Actividad_arch[];
 
  isLoggedIn: boolean;
  user: any;
  botonDeshabilitado: boolean | undefined;
  dataSource = new MatTableDataSource<actividad_archi_projection>(this.act);
  displayedColumns: string[] = [
    'id_actividad',
    'nombre',
    'descripcion',
    'codifcado',
    'devengado',
    'presupuesto_referencial',
    'recursos_propios',
    'Subir archivo',
  ];
  ocultar=false;
  constructor(
    private login: LoginService,
    //private modeloService: ModeloService,
    private router: Router,
    private serviactiv: ActividadService,
    //importar el spinner como servicio
    private actividadservice: ActividadespoaService,
    private loadingService: LoadingServiceService,
    private pexternoservice: PresupuestoExternoService, 
    private rsuplementoservice: ReformaSuplementoService,
    private rtincrementoservice: ReformaTraspasoIService, 
    private rtdecrementoservice: ReformaTraspasoDService
  ) {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
  }

  ngAfterViewInit() {
    console.log('Paginator:', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
poaacti: Poa_proyec_dto = new Poa_proyec_dto();
  ngOnInit() {
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    const data = history.state.data;
    this.poaacti = data;
    if (this.poaacti == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    console.log("poa ="+this.poaacti.id_poa);
    this.getPoaActividades(this.user.id,this.poaacti.id_poa);

    //
    this.actividadservice.obtenerActividades2().subscribe((data: Actividad_arch[]) => {
      this.actix = data;
    });
  }
  
  getPoaActividades(idres: number, idpoa: number): void {
    this.loadingService.show();

    this.serviactiv.getPoaActividades(idres, idpoa).subscribe(
      data => {
        this.loadingService.hide();

        this.dataSource.data = data;
      },
      error => {
        this.loadingService.hide();

        console.error('Error fetching data:', error);
      }
    );
  }
  archivo: Archivo = new Archivo();

  verDetalles(archivos: any) {
    this.router.navigate(['/res/activ/subir_archiivo'], {
      state: { data: archivos },
    });
  }
  verModeloPoas() {
    this.router.navigate(['/res/activ/poa_proyectos']);
  }

  //PROCESO  PARA PRESUPUESTOS
  public actividad = new Actividad_arch();
  public presupuestoexterno = new PresupuestoExterno();
  listaPEActividades: PresupuestoExterno[] = [];
  public reformasuplemento = new ReformaSuplemento();
  listaRSActividades: ReformaSuplemento[] = [];
  public rtincremento = new ReformaTraspasoI();
  listaRTIActividades: ReformaTraspasoI[] = [];
  public rtdecremento = new ReformaTraspasoD();
  listaRTDActividades: ReformaTraspasoD[] = [];

  //LISTAR LOS 4 TIPOS DE PRESUPUESTOS
 // dataSourcePE = new MatTableDataSource<PresupuestoExterno>();
 columnasPE: string[] = ['id_presupuesto_externo', 'nombre_institucion', 'valor', 'fecha','observacion'];
 //dataSourceRS = new MatTableDataSource<ReformaSuplemento>();
 columnasRS: string[] = ['id_ref_suplemento', 'valor', 'fecha'];
//dataSourceRTI = new MatTableDataSource<ReformaTraspasoI>();
 columnasRTI: string[] = ['id_reftras_i', 'valor', 'fecha'];
// dataSourceRTD = new MatTableDataSource<ReformaTraspasoD>();
 columnasRTD: string[] = ['id_reftras_d', 'valor', 'fecha'];

  nombreActividad: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  searchTerm3: string = '';
  searchTerm4: string = '';
  listaPE!: PresupuestoExterno[];
  listaRS!: ReformaSuplemento[];
  listaRTI!: ReformaTraspasoI[];
  listaRTD!: ReformaTraspasoD[];
  spans: any[] = [];
  spans2: any[] = [];
  spans3: any[] = [];
  spans4: any[] = [];


  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }
  getRowSpan2(col: any, index: any) {
    return this.spans2[index] && this.spans2[index][col];
  }
  getRowSpan3(col: any, index: any) {
    return this.spans3[index] && this.spans3[index][col];
  }
  getRowSpan4(col: any, index: any) {
    return this.spans4[index] && this.spans4[index][col];
  }
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaPE.length;) {
      let currentValue = accessor(this.listaPE[i]);
      let count = 1;

      for (let j = i + 1; j < this.listaPE.length; j++) {
        if (currentValue !== accessor(this.listaPE[j])) {
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
  cacheSpan2(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaRS.length;) {
      let currentValue = accessor(this.listaRS[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.listaRS.length; j++) {
        if (currentValue !== accessor(this.listaRS[j])) {
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
  cacheSpan3(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaRTI.length;) {
      let currentValue = accessor(this.listaRTI[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.listaRTI.length; j++) {
        if (currentValue !== accessor(this.listaRTI[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans3[i]) {
        this.spans3[i] = {};
      }
  
      this.spans3[i][key] = count;
      i += count;
    }
  }
  cacheSpan4(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.listaRTD.length;) {
      let currentValue = accessor(this.listaRTD[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.listaRTD.length; j++) {
        if (currentValue !== accessor(this.listaRTD[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans4[i]) {
        this.spans4[i] = {};
      }
  
      this.spans4[i][key] = count;
      i += count;
    }
  }

  clicEnActividad(actividad: Actividad_arch) {
    this.actividad = actividad; 
    this.cargarTabla(actividad.id_actividad);
  }

  cargarTabla(actividadId: number) {
    console.log(this.actividad);
    this.nombreActividad= this.act.find(m => m.id_actividad === actividadId)?.nombre || '';
    console.log('Cargando tabla para el id_actividad', actividadId);
    this.pexternoservice.listarPEActividades(actividadId).subscribe((data:PresupuestoExterno[])=>{
      this.listaPE=data;
      console.log("PRESUPUESTOS EXTERNOS ", JSON.stringify(this.listaPE))
      this.cacheSpan('id_presupuesto_externo', (d) => d.id_presupuesto_externo);
      this.cacheSpan('nombre_institucion', (d) => d.id_presupuesto_externo + d.nombre_institucion);
      this.cacheSpan('valor', (d) => d.id_presupuesto_externo + d.nombre_institucion + d.valor);
      this.cacheSpan('fecha', (d) => d.id_presupuesto_externo + d.nombre_institucion + d.valor + d.fecha);
      this.cacheSpan('observacion', (d) => d.id_presupuesto_externo + d.nombre_institucion + d.valor + d.fecha + d.observacion);
    });
    this.rsuplementoservice.listarRSActividades(actividadId).subscribe((data:ReformaSuplemento[])=>{
      this.listaRS=data;
      console.log("REFORMAS SUPLEMENTOS ", JSON.stringify(this.listaRS))
      this.cacheSpan2('id_ref_suplemento', (d) => d.id_ref_suplemento);
      this.cacheSpan2('valor', (d) => d.id_ref_suplemento + d.valor);
      this.cacheSpan2('fecha', (d) => d.id_ref_suplemento + d.valor + d.fecha);
    });
    this.rtincrementoservice.listarRTIActividades(actividadId).subscribe((data:ReformaTraspasoI[])=>{
      this.listaRTI=data;
      console.log("RTINCREMENTOS ", JSON.stringify(this.listaRTI))
      this.cacheSpan3('id_reftras_i', (d) => d.id_reftras_i);
      this.cacheSpan3('valor', (d) => d.id_reftras_i + d.valor);
      this.cacheSpan3('fecha', (d) => d.id_reftras_i + d.valor + d.fecha);
    });
    this.rtdecrementoservice.listarRTDActividades(actividadId).subscribe((data:ReformaTraspasoD[])=>{
      this.listaRTD=data;
      console.log("RTDECREMENTOS ", JSON.stringify(this.listaRTD))
      this.cacheSpan4('id_reftras_d', (d) => d.id_reftras_d);
      this.cacheSpan4('valor', (d) => d.id_reftras_d + d.valor);
      this.cacheSpan4('fecha', (d) => d.id_reftras_d + d.valor + d.fecha);
    });
  }
}
