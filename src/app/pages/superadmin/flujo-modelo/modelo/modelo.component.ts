import { usuario } from './../../../../models/Usuario';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModeloPoaService } from 'src/app/services/modelo_poa.service';
import Swal from 'sweetalert2';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { LoginService } from 'src/app/services/login.service';
import { Usuario2 } from 'src/app/models/Usuario2';
@Component({
  selector: 'app-modelo',
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.css']
})
export class ModeloComponent {
  frmModeloPoa: FormGroup;
  guardadoExitoso: boolean = false;
  miModal!: ElementRef;
  //tabla
  itemsPerPageLabel = 'Modelos por página';
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
  public crite = new ModeloPoa();
  modeloPoas: ModeloPoa[] = [];
  

  filterPost = '';
  dataSource = new MatTableDataSource<ModeloPoa>();
  columnasUsuario: string[] = ['id_modelo_poa', 'nombre', 'descripcion', 'fecha_inicial', 'fecha_final', 'usuario','proyecto', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  fechaMinima: string = "";
  fechaMax: string = "";
  user: any = null;
  constructor(
    private modeloPoaservice: ModeloPoaService,private paginatorIntl: MatPaginatorIntl,
    private router: Router, private fb: FormBuilder,
    public login: LoginService,
  ) {
    this.frmModeloPoa = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
      fecha_inicial: ['', [Validators.required]],
      fecha_final: ['', [Validators.required]]
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
    this.user = this.login.getUser();
    this.listar();
  }
  
  validarFechas(): void {
    const fechaInicio = this.frmModeloPoa.get('fecha_inicial')?.value as string;
    const fechaFin = this.frmModeloPoa.get('fecha_final')?.value as string;

    if (fechaInicio && fechaFin) {
      const dateInicio = new Date(fechaInicio);
      const dateFin = new Date(fechaFin);

      if (dateFin < dateInicio) {
        this.frmModeloPoa.setErrors({ fechasInvalidas: true });
      } else {
        this.frmModeloPoa.setErrors(null);
      }
    }
  }
  usuariosdit: Usuario2 = new Usuario2;

  guardar() {

    this.crite = this.frmModeloPoa.value;
    this.usuariosdit.id = this.user.id;
    this.crite.usuario= this.usuariosdit;
    this.modeloPoaservice.crear(this.crite)
      .subscribe(
        (response) => {
          console.log('ModeloPoa creado con éxito:', response);
          this.guardadoExitoso = true;
          this.listar();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear el modelo_poa:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );

  }
  eliminar(modelo_poa: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.modeloPoaservice.eliminar(modelo_poa).subscribe(
          (response) => {
            this.listar()
            Swal.fire('Eliminado!', '', 'success')

          }
        );
      }
    })

  }

  listar(): void {
    this.modeloPoaservice.getModeloPoas().subscribe(
      (data: any[]) => {
        this.modeloPoas = data;
        this.dataSource.data = this.modeloPoas;
      },
      (error: any) => {
        console.error('Error al listar los modeloPoas:', error);
      }
    );
  }

  editDatos(modelo_poa: ModeloPoa) {
    this.crite = modelo_poa;
    this.frmModeloPoa = new FormGroup({
      nombre: new FormControl(modelo_poa.nombre),
      descripcion: new FormControl(modelo_poa.descripcion),
      fecha_inicial: new FormControl(modelo_poa.fecha_inicial),
      fecha_final: new FormControl(modelo_poa.fecha_final)
    });
  }

  limpiarFormulario() {
    this.frmModeloPoa.reset();
    this.crite = new ModeloPoa;
  }

  actualizar() {
    this.crite.nombre = this.frmModeloPoa.value.nombre;
    this.crite.descripcion = this.frmModeloPoa.value.descripcion;
    this.modeloPoaservice.actualizar(this.crite.id_modelo_poa, this.crite)
      .subscribe(response => {
        this.crite = new ModeloPoa();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }

  verDetalles(modelo_poa: any) {
    modelo_poa.usuario=null;
    this.router.navigate(['/sup/flujo-modelo/modelo-proyecto'], { state: { data: modelo_poa } });
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.modeloPoas;;
    }
  }

}
