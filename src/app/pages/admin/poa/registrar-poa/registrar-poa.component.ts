import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListarProyectosComponent } from '../listar-proyectos/listar-proyectos/listar-proyectos.component';
import { ProjectSelectService } from 'src/app/services/poa/project-select.service';
import { Convert, ProjectByIDDto } from 'src/app/interface/ProjectByIdDto';
import { AddActiviesComponent } from '../add-activies/add-activies.component';





@Component({
  selector: 'app-registrar-poa',
  templateUrl: './registrar-poa.component.html',
  styleUrls: ['./registrar-poa.component.css']
})
export class RegistrarPoaComponent implements OnInit {
  currentDate: Date = new Date();
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'eliminar'];
  dataSource = [];
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
  proyecto = 0;
  constructor(public dialog: MatDialog, private projectSelectSetvice: ProjectSelectService) { }
  ngOnInit(): void {
    this.getProject(0);
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

  openDialogActivities(): void {
    const dialogRef = this.dialog.open(AddActiviesComponent, {
      data: {}
    })

  }

  getProject(idProyecto: number) {
    this.projectSelectSetvice.getProject(idProyecto).subscribe((data: any) => {
      if (data.length > 0) {
        this.projectSelect = data[0];
      }
      console.log(this.projectSelect);
    })
  }
}
