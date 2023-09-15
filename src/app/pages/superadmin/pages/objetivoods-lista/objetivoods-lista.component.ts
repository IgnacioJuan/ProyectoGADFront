import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ObjetivoodsService} from "../../../../services/objetivoods.service";

import {Objetivoods} from "../../../../models/objetivoods";
import {Componentes} from "../../../../models/Componentes";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {ComponentesService} from "../../../../services/componentes.service";
import {ObjetivoPdotService} from "../../../../services/objetivo-pdot.service";
import Swal from "sweetalert2";
import {LoadingServiceService} from "../../../../components/loading-spinner/LoadingService.service";

@Component({
  selector: 'app-objetivoods-lista',
  templateUrl: './objetivoods-lista.component.html',
  styleUrls: ['./objetivoods-lista.component.css']
})
export class ObjetivoodsListaComponent implements OnInit {
  formComponentes: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Objetivos por página';
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
  public componentes = new Objetivoods();
  listaComponentes: Objetivoods[] = [];
  numeroObjetivos:number=0;


  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
//aqui esta llenandose el array de componentes
  dataSource = new MatTableDataSource<Objetivoods>();

  columnasUsuario: string[] = ['id_componente', 'nombre', 'descripcion', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private componentesService: ComponentesService,
    private objetivoodsServicio: ObjetivoodsService,
    private loadingService: LoadingServiceService

  ) {
    this.formComponentes = fb.group({

      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]]
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
    this.objetivoodsServicio.crearobjetivoods(this.componentes)
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
    this.loadingService.show();
    Swal.fire({
      title: '¿Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.objetivoodsServicio.eliminarobjetivoods(componente).subscribe(
          (response) => {
            this.loadingService.hide();


            Swal.fire('Eliminado!', '', 'success')
            this.listar();
          }
        );
      }
    })

  }

  listar(): void {
    this.loadingService.show();

    this.objetivoodsServicio.obtenerListaobjetivoods().subscribe(
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

  editDatos(componente: Objetivoods) {
    this.componentes = componente;
    this.formComponentes = new FormGroup({

      nombre: new FormControl(componente.nombre),
      descripcion: new FormControl(componente.descripcion)

    });
  }

  limpiarFormulario() {
    this.formComponentes.reset();
    this.componentes = new Objetivoods();
  }

  actualizar() {
    this.loadingService.show();
    this.componentes.nombre = this.formComponentes.value.nombre;
    this.componentes.descripcion = this.formComponentes.value.descripcion;
    this.componentesService.actualizar(this.componentes.id_objetivo_ods, this.componentes)
      .subscribe(response => {
        this.componentes = new Objetivoods();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      },
        (error: any) => {
          console.error('Error al listar los modeloPoas:', error);
          this.loadingService.hide();

        });
  }

  verDetalles(componente: any) {
    this.router.navigate(['/sup/flujo_Componentes/componente_objetivoPDOT'], { state: { data: componente } });
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
