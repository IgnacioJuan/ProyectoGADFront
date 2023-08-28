import { Component, ViewChild, ElementRef } from '@angular/core';
import { Proyecto } from 'src/app/models/Proyecto';
import { ActivatedRoute, Router } from '@angular/router';
import { PoaService } from 'src/app/services/poa.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { Poa } from 'src/app/models/Poa';

@Component({
  selector: 'app-proyecto-poa',
  templateUrl: './proyecto-poa.component.html',
  styleUrls: ['./proyecto-poa.component.css']
})
export class ProyectoPoaComponent {
  //tabla
  itemsPerPageLabel = 'Poaes por página';
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

  poa: any[] = [];
  proyecto: Proyecto = new Proyecto();
  modelopoa: ModeloPoa = new ModeloPoa();


  filterPost = '';
  dataSource = new MatTableDataSource<Poa>();
  columnasUsuario: string[] = ['id_poa', 'meta_alcanzar', 'meta_fisica', 'fecha_inicio', 'fecha_fin', 'localizacion', 'actividades'
  // 'actions'

];

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(private poaervice: PoaService, private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {
    this.proyecto = history.state.proyecto;
    this.modelopoa = history.state.modelo;
    if (this.proyecto == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.listar()
  }

  listar(): void {
    this.poaervice.listarPoasdelProyecto(this.proyecto.id_proyecto, 'APROBADO').subscribe(
      (data: any[]) => {
        this.poa = data;
        this.dataSource.data = this.poa;
      },
      (error: any) => {
        console.error('Error al listar los poa:', error);
      }
    );
  }


  verActividades(poa: any) {
    this.router.navigate(['/sup/flujo-modelo/poa-actividad'], { state: { data: poa, modelopoa: this.modelopoa, proyecto: this.proyecto } });
  }
  verProyectos() {
    this.router.navigate(['/sup/flujo-modelo/modelo-proyecto'], { state: { data: this.modelopoa } });
  }
  verModelos() {
    this.router.navigate(['/sup/flujo-modelo/modelo']);
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.poa;;
    }
  }
}
