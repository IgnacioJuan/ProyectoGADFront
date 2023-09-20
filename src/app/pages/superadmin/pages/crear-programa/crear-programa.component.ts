import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProgramaService } from 'src/app/services/programa.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Programa } from 'src/app/models/Programa';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';

@Component({
  selector: 'app-crear-programa',
  templateUrl: './crear-programa.component.html',
  styleUrls: ['./crear-programa.component.css']
})
export class CrearComponent implements OnInit {
  frmCriterio: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Programas por página';
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


  public progra = new Programa();
  programas: Programa[] = [];
  

  filterPost = '';
  dataSource = new MatTableDataSource<Programa>();
  columnasUsuario: string[] = ['id_programa', 'nombre', 'descripcion', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private programaservice: ProgramaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    private loadingService: LoadingServiceService

  ) {
    this.frmCriterio = fb.group({
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

    this.progra = this.frmCriterio.value;
    this.programaservice.crear(this.progra)
      .subscribe(
        (response) => {
          console.log('Programa creado con éxito:', response);
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
          console.error('Error al crear el programa:', error);
          this.loadingService.hide();

          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
    eliminar(id: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.programaservice.eliminarLogic(id).subscribe(
          (response) => {
            this.listar()
            Swal.fire('Eliminado!', '', 'success')

          }
        );
      }
    })

  }

  listar(): void {
    this.loadingService.show();

    this.programaservice.listar().subscribe(
      (data: any[]) => {
        this.programas = data;
        this.dataSource.data = this.programas;
        this.loadingService.hide();

      },
      (error: any) => {
        console.error('Error al listar los programas:', error);
        this.loadingService.hide();

      }
    );
  }

  editDatos(pro: Programa) {
    this.progra = pro;
    this.frmCriterio = new FormGroup({
      nombre: new FormControl(pro.nombre),
      descripcion: new FormControl(pro.descripcion)

    });
  }

  limpiarFormulario() {
    this.frmCriterio.reset();
    this.progra = new Programa;
  }

  actualizar() {
    this.loadingService.show();

    this.progra.nombre = this.frmCriterio.value.nombre;
    this.progra.descripcion = this.frmCriterio.value.descripcion;
    this.programaservice.actualizar(this.progra.id_programa, this.progra)
      .subscribe(response => {
        this.progra = new Programa();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      },
      (error: any) => {
        console.error('Error al listar los programas:', error);
        this.loadingService.hide();

      });

  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.programas;;
    }
  }  

} 

