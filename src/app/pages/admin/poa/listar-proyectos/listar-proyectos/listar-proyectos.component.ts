import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { ProjectsActives } from 'src/app/models/ProjectsActives';
import { LoginService } from 'src/app/services/login.service';
import { ProjectsActivesService } from 'src/app/services/poa/projects-actives.service';
import { RegistrarPoaComponent } from '../../registrar-poa/registrar-poa.component';


@Component({
  selector: 'app-listar-proyectos',
  templateUrl: './listar-proyectos.component.html',
  styleUrls: ['./listar-proyectos.component.css']
})
export class ListarProyectosComponent implements OnInit {

  //tabla
  itemsPerPageLabel = 'Proyectos por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  rango: any = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };

  searchText = '';
  filterPost = '';
  user: any = null;
  dataSource = new MatTableDataSource<ProjectsActives>();
  columnasUsuario: string[] = ['codigo', 'nombre', 'meta', 'action'];
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  projectsActives: any[] = [];
  frmProjects: FormGroup;
  guardadoExitoso: boolean = false;

  constructor(public dialogRef: MatDialogRef<RegistrarPoaComponent>,
    private projectsActivesService: ProjectsActivesService,
    private fb: FormBuilder,
    public login: LoginService,
    private loadingService: LoadingServiceService) {
    this.frmProjects = fb.group({
      codigo: ['', Validators.required],
      nombre: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.listarProjectsActives();
  }


  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.projectsActives;;
    }
  }

  //listar projectos activos 
  public listarProjectsActives(): void {
    this.loadingService.show();
    console.log(this.user);
    this.projectsActivesService.getProjectsActives(this.user.id).subscribe(
      (response: ProjectsActives[]) => {
        this.dataSource.data = response;
        this.projectsActives = response;
        this.loadingService.hide();
      },
      (error: any) => {
        console.log(error);
        this.loadingService.hide();
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }

  //method to select project in the table
  public selectProject(project: ProjectsActives): void {
    this.dialogRef.close(project);
  }
}
