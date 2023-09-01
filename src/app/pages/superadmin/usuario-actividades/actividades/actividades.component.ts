import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario2 } from 'src/app/models/Usuario2';
import { UsuarioActividadDTO } from 'src/app/models/UsuarioActividadDTO';
import { ActividadService } from 'src/app/services/actividad.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {

  constructor(
    private router: Router,
    private actService: ActividadService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.actService.obtenerUsuariosConActividades().subscribe(
      (data: UsuarioActividadDTO[]) => {
        this.dataSource.data = data;
      },
      error => {
        console.error("Error al cargar los datos: ", error);
      }
    );
  }

  verDetalles() {
    this.router.navigate(['/sup/usuario-actividades/visualizar']);
  }

  // Propiedades para la tabla
  dataSource = new MatTableDataSource<UsuarioActividadDTO>();
  columnasUsuario: string[] = ['nombre_responsable', 'cargo_responsable', 'numero_de_actividades', 'actividades'];
}
