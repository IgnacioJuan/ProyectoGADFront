import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioActividadDTO } from 'src/app/models/UsuarioActividadDTO';
import { ActividadService } from 'src/app/services/actividad.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {


  usuarioActividad: any[] = [];
  filterPost = '';
  // Propiedades para la tabla
  dataSource = new MatTableDataSource<UsuarioActividadDTO>();
  columnasUsuario: string[] = ['nombre_responsable', 'cargo_responsable', 'numero_de_actividades', 'actividades'];
  constructor(
    private router: Router,
    private actService: ActividadService,
    private loadingService: LoadingServiceService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loadingService.show();
    this.actService.obtenerUsuariosConActividades().subscribe(
      (data: UsuarioActividadDTO[]) => {
        this.dataSource.data = data;
        this.loadingService.hide();
      },
      error => {
        console.error("Error al cargar los datos: ", error);
        this.loadingService.hide();
      }
    );
  }

  // acceder a la data de las actividades de los usuarios 
  redirectToDetails(usuarioAct: UsuarioActividadDTO) {
    console.log("Pasando usuarioAct:", usuarioAct);
    this.router.navigate(['/sup/usuario-actividades/visualizar', usuarioAct.id_usuario], {
      state: { usuario: usuarioAct }
    });
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      // Restaurar los datos originales si no hay filtro aplicado
      this.cargarDatos();
    }
  }

}
