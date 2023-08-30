import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PoaActividadProjection } from 'src/app/interface/PoaActividadProjection';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { PoaService } from 'src/app/services/poa.service';

@Component({
  selector: 'app-poa-actividad',
  templateUrl: './poa-actividad.component.html',
  styleUrls: ['./poa-actividad.component.css']
})
export class PoaActividadComponent implements OnInit{
  itemsPerPageLabel = 'Poas por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  rango:any= (page: number, pageSize: number, length: number) => {
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

  //public poa = new Poa();
  poas: PoaActividadProjection[] = [];
  public activ = new ActividadesPoa();

  filterPost = '';
  filteredPoas: any[] = [];
  resultadosEncontrados: boolean = true;
  dataSource = new MatTableDataSource<PoaActividadProjection>();
  columnasPoa: string[] = ['id_poa','fecha_inicio','fecha_fin','localizacion','cobertura','barrio','comunidad','nombre_funcionario','cargo','linea_base','tipo_periodo','cantidadActividades'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private poaservice: PoaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.poaservice.obtenerDatosPoas().subscribe(
      (data: any[]) => {
        this.poas = data;
        this.dataSource.data = this.poas;
      },
      (error: any) => {
        console.error('Error al listar poas:', error);
      }
    );
  }

  verActividades(poa: any) {
    this.router.navigate(['/adm/asignacion-actividades/actividades'], { state: { data: poa } });
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.poas;;
    }
  }

}
