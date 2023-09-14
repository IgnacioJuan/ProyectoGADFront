import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EjeService} from "../../../../services/eje.service";
import {Eje} from "../../../../models/eje";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {LoadingServiceService} from "../../../../components/loading-spinner/LoadingService.service";


@Component({
  selector: 'app-ejes-lista',
  templateUrl: './ejes-lista.component.html',
  styleUrls: ['./ejes-lista.component.css']
})
export class EjesListaComponent implements OnInit{
  formComponentes: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Ejes por página';
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
  //
  public componentes = new Eje();
  listaComponentes: Eje[] = [];
  numeroObjetivos:number=0;


  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
//aqui esta llenandose el array de componentes
  dataSource = new MatTableDataSource<Eje>();

  columnasUsuario: string[] = ['id_componente', 'nombre','cantidadObjetivoPDOT', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private ejeServicio: EjeService,
    private loadingService: LoadingServiceService
  ) {
    this.formComponentes = fb.group({

      nombre: ['', Validators.required]

    });
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


  guardar() {
    this.loadingService.show();

    this.componentes = this.formComponentes.value;
    this.ejeServicio.crearejes(this.componentes)
      .subscribe(
        (response) => {
          console.log('Componente creado con éxito:', response);
          this.guardadoExitoso = true;
          this.loadingService.hide();
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear el Componente:', error);
          this.loadingService.hide();
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
  }


  eliminar(componente: any) {

    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {

      if (!result.isConfirmed) {
        this.loadingService.show();
        this.ejeServicio.eliminareje(componente).subscribe(
          (response) => {
            this.loadingService.hide();
            this.listar()
            Swal.fire('Eliminado!', '', 'success')
          }
        );
      }
    })

  }

  listar(): void {
    this.loadingService.show();

    this.ejeServicio.obtenerListaejes().subscribe(
      (data: any[]) => {
        this.listaComponentes = data;
        this.dataSource.data = this.listaComponentes;
        this.loadingService.hide();
      },
      (error: any) => {
        console.error('Error al listar los objetosods:', error);
        this.loadingService.hide();
      }
    );
  }
  /*listarObjetivos(idComponente: number): void {
    this.objetivoPDOTService.listarObjetivosPdotsPorIdComponente(idComponente).subscribe(
      (data: any) => {
        this.numeroObjetivos = data.length; // Asigna el número de registros obtenidos
      },
      (error: any) => {
        console.error('Error al listar los objetivos:', error);
      }
    );
  }*/
  editDatos(componente: Eje) {
    this.componentes = componente;
    this.formComponentes = new FormGroup({

      nombre: new FormControl(componente.nombre)


    });
  }

  limpiarFormulario() {
    this.formComponentes.reset();
    this.componentes = new Eje();
  }

  actualizar() {
    this.loadingService.show();
    this.componentes.nombre = this.formComponentes.value.nombre;

    this.ejeServicio.actualizareje(this.componentes.id_eje, this.componentes)
      .subscribe(response => {
        this.componentes = new Eje();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      },
        (error: any) => {
          console.error('Error al listar los ejes:', error);
          this.loadingService.hide();

        });
  }

  verDetalles(componente: any) {
    this.router.navigate(['/sup/ejes/objetivopnd'], { state: { data: componente } });
  }



  buscar() {
    // Filtra los componentes basados en el filtro
    this.filteredComponentes = this.listaComponentes.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );

    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource.data = this.filteredComponentes;

    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }
}
