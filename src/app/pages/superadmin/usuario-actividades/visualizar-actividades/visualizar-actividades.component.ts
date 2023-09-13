import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleActividadDTO } from 'src/app/models/DetalleActividadDTO';
import { ActividadService } from 'src/app/services/actividad.service';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioActividadDTO } from 'src/app/models/UsuarioActividadDTO';
@Component({
  selector: 'app-visualizar-actividades',
  templateUrl: './visualizar-actividades.component.html',
  styleUrls: ['./visualizar-actividades.component.css']
})
export class VisualizarActividadesComponent {

  listaDetalleActividades: DetalleActividadDTO[] = [];
  nombre_responsable: string = '';

  filterPost = '';
  actividades: any[] = [];
  // Nuevas propiedades para la nueva tabla
  dataSource = new MatTableDataSource<DetalleActividadDTO>();
  columnasActividades: string[] = ['nombre_actividad', 'descripcion', 'estado', 'devengado', 'codificado', 'presupuesto_referencial', 'recursos_propios', 'presupuesto_externo'];
  constructor(
    private router: ActivatedRoute,
    private rout: Router,
    private actService: ActividadService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  /*  ngOnInit() {
    const navigation = this.rout.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.usuarioAct.nombre_responsable = navigation.extras.state['nombre_responsable'];
    }
    this.cargarDatos();
  }*/

  cargarDatos() {
    const idParam = this.router.snapshot.paramMap.get('id_usuario');
    if (idParam) {
      const id_usuario = +idParam;
      this.actService.obtenerDetalleActividades(id_usuario).subscribe(data => {
        this.listaDetalleActividades = data;
        this.dataSource.data = this.listaDetalleActividades;
        if (this.listaDetalleActividades.length > 0) {
          this.nombre_responsable = this.listaDetalleActividades[0].nombre_responsable;
        }
      });

    }

  }

  verActividades() {
    this.rout.navigate(['/sup/usuario-actividades/listar-actividades']);
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.cargarDatos();
    }
  }

}
