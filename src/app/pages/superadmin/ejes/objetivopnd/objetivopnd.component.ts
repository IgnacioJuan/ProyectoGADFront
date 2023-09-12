import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {Router} from "@angular/router";


import Swal from "sweetalert2";
import {Objetivopnd} from "../../../../models/objetivopnd";
import {ObjetivopndService} from "../../../../services/objetivopnd.service";
import {Componentes} from "../../../../models/Componentes";
import {Eje} from "../../../../models/eje";

@Component({
  selector: 'app-objetivopnd',
  templateUrl: './objetivopnd.component.html',
  styleUrls: ['./objetivopnd.component.css']
})
export class ObjetivopndComponent  implements OnInit {
  formComponentes: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Objetivos pnd por página';
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
  public componentes = new Objetivopnd();
  componentex: Eje = new Eje();

  listaComponentes: Objetivopnd[] = [];
  numeroObjetivos:number=0;


  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
//aqui esta llenandose el array de componentes
  dataSource = new MatTableDataSource<Objetivopnd>();

  columnasUsuario: string[] = ['id_componente', 'nombre', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private objetivopndServicio: ObjetivopndService
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


    const data = history.state.data;
    this.componentex = data;

    console.log(this.componentex);


    if (this.componentex == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    //metodo pa listar segun id
    this.listar(this.componentex)

  }


  guardar() {
    this.componentes = this.formComponentes.value;
    this.componentes.eje=this.componentex;
    this.objetivopndServicio.crearobjetivopnd(this.componentes)
      .subscribe(
        (response) => {
          console.log('Componente creado con éxito:', response);
          this.guardadoExitoso = true;
          this.listar(this.componentex);
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear el Componente:', error);
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
        this.objetivopndServicio.eliminarobjetivopnd(componente).subscribe(
          (response) => {
            this.listar(this.componentex)
            Swal.fire('Eliminado!', '', 'success')
          }
        );
      }
    })

  }

  listar(eje: any): void {
    this.objetivopndServicio.listarObjetivosPorEje(eje).subscribe(
      (data: any[]) => {
        this.listaComponentes = data;
        this.dataSource.data = this.listaComponentes;
      },
      (error: any) => {
        console.error('Error al listar los objetosods:', error);
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
  editDatos(componente: Objetivopnd) {
    this.componentes = componente;
    this.formComponentes = new FormGroup({

      nombre: new FormControl(componente.nombre)


    });
  }

  limpiarFormulario() {
    this.formComponentes.reset();
    this.componentes = new Objetivopnd();
  }

  actualizar() {

    this.componentes.nombre = this.formComponentes.value.nombre;

    this.objetivopndServicio.actualizarobjetivopnd(this.componentes.id_objetivo_pnd, this.componentes)
      .subscribe(response => {
        this.componentes = new Objetivopnd();
        this.listar(this.componentex);
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }

  //verDetalles(componente: any) {
  //  this.router.navigate(['/sup/flujo_Componentes/componente_objetivoPDOT'], { state: { data: componente } });
  //}
  AnteriorPagina() {
    this.router.navigate(['/sup/ejes/ejestabla']);
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
