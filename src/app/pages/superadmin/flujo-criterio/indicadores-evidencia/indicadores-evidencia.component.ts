import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Evidencia } from 'src/app/models/Evidencia';
import { ActivatedRoute, Router } from '@angular/router';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { Indicador } from 'src/app/models/Indicador';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { Criterio } from 'src/app/models/Criterio';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-indicadores-evidencia',
  templateUrl: './indicadores-evidencia.component.html',
  styleUrls: ['./indicadores-evidencia.component.css']
})
export class IndicadoresEvidenciaComponent{
  frmEvidencia: FormGroup;
  guardadoExitoso: boolean = false;
  estado = 'pendiente';
 
  subcriterio: Subcriterio = new Subcriterio();
  criterio: Criterio = new Criterio();
  indicador: Indicador = new Indicador();
  evidencias: any[] = [];

  miModal!: ElementRef;
  public evid = new Evidencia();
  
  
  filterPost = '';
  dataSource = new MatTableDataSource<Evidencia>();
  columnasUsuario: string[] = ['id_evidencia', 'descripcion', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(private evidenciaservice: EvidenciaService,
    private router: Router, private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.frmEvidencia = fb.group({
      descripcion: ['', [Validators.required]],
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {
    this.subcriterio = history.state.subcriterio;
    this.criterio= history.state.criterio;
    this.indicador = history.state.data;
    this.listar()
  }
  
  

  guardar() {
    this.evid = this.frmEvidencia.value;
    this.evid.indicador = this.indicador;
    this.evid.estado=this.estado
    this.evidenciaservice.crear(this.evid)
      .subscribe(
        (response: any) => {
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
          this.guardadoExitoso = true;
          this.listar();
        },
        (error: any) => {
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
  eliminar(evidencia: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.evidenciaservice.eliminarEvidencia( evidencia).subscribe(
          (response: any) => {
            this.listar()
            Swal.fire('Eliminado!', '', 'success')
          }
        );
      }
    })
    
  }

  listar(): void {
    this.evidenciaservice.getEvidenciaPorIndicador(this.indicador.id_indicador).subscribe(
      (data: Evidencia[]) => {
        this.evidencias = data;
        this.dataSource.data = this.evidencias;
      },
      (error: any) => {
        console.error('Error al listar los evidencias:', error);
      }
    );
  }

  editDatos(evidencia: Evidencia) {
    this.evid = evidencia;
    this.frmEvidencia = new FormGroup({
      descripcion: new FormControl(evidencia.descripcion)
    });
  }

  limpiarFormulario() {
    this.frmEvidencia.reset();
    this.evid = new Evidencia;
  }

  actualizar() {
    this.evid.descripcion = this.frmEvidencia.value.descripcion;

    this.evidenciaservice.actualizar(this.evid.id_evidencia, this.evid)
      .subscribe((response: any) => {
        this.evid = new Evidencia();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }
  verIndicadores() {
    this.router.navigate(['/sup/flujo-criterio/subcriterios-indicador'], { state: { data: this.subcriterio, criterio: this.criterio }});
  }
  verSubcriterios() {
    this.router.navigate(['/sup/flujo-criterio/criterios-subcriterio'], { state: { data: this.criterio } });
  }
  verCriterios() {
    this.router.navigate(['/sup/flujo-criterio/criterioSuper']);
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.evidencias;;
    }
  }
}
