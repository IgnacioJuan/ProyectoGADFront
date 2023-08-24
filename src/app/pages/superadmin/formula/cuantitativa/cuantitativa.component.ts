import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cuantitativa } from 'src/app/models/Cuantitativa';
import { FormulaService } from 'src/app/services/formula.service';

@Component({
  selector: 'app-cuantitativa',
  templateUrl: './cuantitativa.component.html',
  styleUrls: ['./cuantitativa.component.css']
})
export class CuantitativaComponent {
  itemsPerPageLabel = 'Fórmulas por página';
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

  miModal!: ElementRef;
  public cuanti = new Cuantitativa();
  listaCuantitativa: Cuantitativa[] = [];
  frmCuantitativa: FormGroup;
  guardadoExitoso: boolean = false;

  filterPost = '';
  dataSource = new MatTableDataSource<Cuantitativa>();
  columnasUsuario: string[] = ['id_cuantitativa', 'descripcion','abreviatura', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private service: FormulaService, private paginatorIntl: MatPaginatorIntl,
    private fb: FormBuilder,
    private router:Router
    ) {

    this.frmCuantitativa = fb.group({
      descripcion:['', Validators.required],
      abreviatura: ['', [Validators.required, Validators.maxLength(250)]]
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
    this.listarCaunti();
  }

  guardarCuanti() {
    this.cuanti = this.frmCuantitativa.value;
    console.log(this.cuanti)
    this.service.crearCuanti(this.cuanti).
      subscribe(
        (reponse) => {
          console.log('Formula Cauntitativa creado con éxito:', reponse);
          this.guardadoExitoso = true;
          this.listarCaunti();
          
        },
        (error) => {
          console.error('Error al crear el formula cuanti:', error);
        }
      )
  }

  eliminarCuanti(cuanti: any) {

    this.service.eliminarCuanti(cuanti).
    subscribe((reponse) =>{
      this.listarCaunti();
    },
    (error: any) => {
      console.error('Error al listar los formulas cuanti al eliminar:', error);
    })
  }


  listarCaunti(): void {
    this.service.getCuantitativa().
      subscribe(
        (data:any) => {
          this.listaCuantitativa = data;
          this.dataSource.data=this.listaCuantitativa
        },
        (error: any) => {
        console.error('Error al listar las formulas cuantitativas',error);
        }
      )
  }

  editDatosCuanti(cuantiN: Cuantitativa) {
    this.cuanti = cuantiN;
    this.frmCuantitativa = new FormGroup({
      descripcion: new FormControl(cuantiN.descripcion),
      abreviatura: new FormControl(cuantiN.abreviatura)
    });
  }

  limpiarFormulario2() {
    this.frmCuantitativa.reset();
    this.cuanti = new Cuantitativa;
  }

  actualizarCuanti() {
    this.cuanti.descripcion = this.frmCuantitativa.value.descripcion;
    this.cuanti.abreviatura = this.frmCuantitativa.value.abreviatura;
    this.service.actualizarCuanti(this.cuanti.id_cuantitativa, this.cuanti)
      .subscribe(response => {
        this.cuanti = new Cuantitativa();
        this.listarCaunti();
      });
  }
  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.listaCuantitativa;;
    }
  }
}
