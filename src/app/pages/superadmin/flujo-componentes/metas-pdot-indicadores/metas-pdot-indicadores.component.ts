import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { Componentes } from 'src/app/models/Componentes';
import { Indicadores } from 'src/app/models/Indicadores';
import { MetasPDOT } from 'src/app/models/MetasPDOT';
import { ObjetivoPDOT } from 'src/app/models/ObjetivoPDOT';
import { IndicadorService } from 'src/app/services/indicador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metas-pdot-indicadores',
  templateUrl: './metas-pdot-indicadores.component.html',
  styleUrls: ['./metas-pdot-indicadores.component.css']
})
export class MetasPdotIndicadoresComponent implements OnInit  {
formIndicador: FormGroup;
guardadoExitoso: boolean = false;
//tabla
itemsPerPageLabel = 'Indicadores por página';
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


///////
public objPDOT: ObjetivoPDOT = new ObjetivoPDOT();
public componente: Componentes = new Componentes();
public metaPDOT: MetasPDOT = new MetasPDOT();

listadoIndicadores: Indicadores[] = [];
public indicad = new Indicadores();
miModal!: ElementRef;
selectedTipo: string="";

//Buscar
filterPost = '';
filteredComponentes: any[] = [];
resultadosEncontrados: boolean = true;


dataSource = new MatTableDataSource<Indicadores>();
columnasUsuario: string[] = ['id_indicador', 'nombre', 'descripcion','tipo_evaluacion',  'actions'];

@ViewChild('datosModalRef') datosModalRef: any;
@ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

constructor(private indicadorservice: IndicadorService,private paginatorIntl: MatPaginatorIntl,
  private router: Router, private fb: FormBuilder,
  private route: ActivatedRoute,
  private indicadorService: IndicadorService,
    //importar el spinner como servicio
    private loadingService: LoadingServiceService

) {
  this.formIndicador = fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    tipo_evaluacion: ['', [Validators.required]]
  });
  this.paginatorIntl.nextPageLabel = this.nextPageLabel;
  this.paginatorIntl.lastPageLabel = this.lastPageLabel;
  this.paginatorIntl.firstPageLabel=this.firstPageLabel;
  this.paginatorIntl.previousPageLabel=this.previousPageLabel;
  this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
  this.paginatorIntl.getRangeLabel=this.rango;
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator || null;}


ngOnInit() {
  this.metaPDOT= history.state.data;
  this.componente = history.state.componente;
  this.objPDOT = history.state.objPDOT;
  console.log(this.metaPDOT);
  console.log(this.componente);
  console.log(this.objPDOT);
  this.listar(this.metaPDOT.id_meta_pdot)
}


guardar() {
  this.indicad = this.formIndicador.value;
  this.indicad.metapdot = this.metaPDOT;
  this.indicadorService.crear(this.indicad)
    .subscribe(
      (response: any) => {
        console.log('Indicador creado con éxito:', response);
        this.guardadoExitoso = true;
        this.listar(this.metaPDOT.id_meta_pdot);
        Swal.fire(
          'Exitoso',
          'Se ha completado el registro con exito',
          'success'
        )
      },
      (error: any) => {
        console.error('Error al crear el Indicador :', error);
        Swal.fire(
          'Error',
          'Ha ocurrido un error',
          'warning'
        )
      }
    );}

eliminar(indicador: any) {
  this.loadingService.show();

  Swal.fire({
    title: 'Estas seguro de eliminar el registro?',
    showDenyButton: true,
    confirmButtonText: 'Cacelar',
    denyButtonText: `Eliminar`,
  }).then((result) => {
    if (!result.isConfirmed) {
      this.indicadorService.eliminar(indicador.id_indicador, indicador).subscribe(
        (response: any) => {
          this.listar(this.metaPDOT.id_meta_pdot)
          Swal.fire('Eliminado!', '', 'success')  } ); }})
}

listar(idMeta: number): void {
  this.loadingService.show();

  this.indicadorService.listarmetasPdotsPorIdObjetivo(idMeta).subscribe(
    (data: any[]) => {
      this.listadoIndicadores= data;
      this.dataSource.data = this.listadoIndicadores;
      this.loadingService.hide();

    },
    (error: any) => {
      console.error('Error al listar los objetivos:', error);
      this.loadingService.hide();

    }
  );
}


editDatos(indicador: Indicadores) {
  this.indicad = indicador;
  console.log(this.indicad)
  this.formIndicador = new FormGroup({
    nombre: new FormControl(indicador.nombre),
    descripcion: new FormControl(indicador.descripcion),
    tipo_evaluacion: new FormControl(indicador.tipo_evaluacion)
  });
}

limpiarFormulario() {
  this.formIndicador.reset();
  this.indicad = new Indicadores;
}

actualizar() {
  this.loadingService.show();

  this.indicad.nombre = this.formIndicador.value.nombre;
  this.indicad.descripcion = this.formIndicador.value.descripcion;
  this.indicad.tipo_evaluacion = this.formIndicador.value.tipo_evaluacion;
  this.indicad.visible = true
  this.indicad.metapdot = this.metaPDOT;
  this.indicadorservice.actualizar(this.indicad.id_indicador, this.indicad)
    .subscribe((response: any) => {
      this.indicad = new Indicadores();
      this.listar(this.metaPDOT.id_meta_pdot);
      Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')

    }, (error: any) => {
      console.error('Error al listar los modeloPoas:', error);
      this.loadingService.hide();

    });
}

verMetas() {
  this.router.navigate(['/sup/flujo_Componentes/objetivoPDOT_metasPDOT'], { state: { data: this.objPDOT, componente: this.componente }});}
verObjetivosPDOT() {
  this.router.navigate(['/sup/flujo_Componentes/componente_objetivoPDOT'], { state: { data: this.componente } });}
verComponentes() {
  this.router.navigate(['/sup/flujo_Componentes/componentesSuper']);
}

buscar() {
  // Filtra los componentes basados en el filtro
  this.filteredComponentes = this.listadoIndicadores.filter((indicador) =>
    indicador.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
  );
  // Actualiza los datos del dataSource con los resultados filtrados
  this.dataSource.data = this.filteredComponentes;
  // Verifica si se encontraron resultados
  this.resultadosEncontrados = this.filteredComponentes.length > 0;}
}
