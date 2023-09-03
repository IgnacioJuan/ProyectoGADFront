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
  usuarioAct: UsuarioActividadDTO = new UsuarioActividadDTO();
  filterPost = '';
  actividades: any[] = [];
  // Nuevas propiedades para la nueva tabla
  dataSource = new MatTableDataSource<DetalleActividadDTO>();
  columnasActividades: string[] = ['id_actividad', 'nombre_actividad', 'descripcion', 'devengado', 'estado', 'codificado', 'presupuesto_referencial', 'recursos_propios'];
  constructor(
    private router: ActivatedRoute,
    private rout: Router,
    private actService: ActividadService
  ) { }

  ngOnInit() {
    const data = history.state.data;
    this.usuarioAct = data;
    if (this.usuarioAct == undefined) {
      this.rout.navigate(['listar-actividades']);
    }
    this.cargarDatos();
  }

  cargarDatos() {
    const idParam = this.router.snapshot.paramMap.get('id_usuario');
    if (idParam) {
      const id_usuario = +idParam;
      this.actService.obtenerDetalleActividades(id_usuario).subscribe(data => {
        this.listaDetalleActividades = data;
        this.dataSource.data = this.listaDetalleActividades;
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
