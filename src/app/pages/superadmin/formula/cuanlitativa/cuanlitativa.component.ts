import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { Cualitativa } from 'src/app/models/Cualitativa';
import { Indicador } from 'src/app/models/Indicador';
import { FormulaService } from 'src/app/services/formula.service';

@Component({
  selector: 'app-cuanlitativa',
  templateUrl: './cuanlitativa.component.html',
  styleUrls: ['./cuanlitativa.component.css']
})
export class CuanlitativaComponent implements OnInit {
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
  public cuali = new Cualitativa();
  listaCualitativa: Cualitativa[] = [];
  listaIndicador: any[] = [];
  frmCualitativa: FormGroup;
  guardadoExitoso: boolean = true;
  guardadoExitoso2: boolean = false;

  filterPost = '';
  dataSource = new MatTableDataSource<Cualitativa>();
  columnasUsuario: string[] = ['id_cualitativa', 'valor','escala', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private service: FormulaService,private paginatorIntl: MatPaginatorIntl,
    private fb: FormBuilder,
    private router: Router
  ) {

    this.frmCualitativa = fb.group({
      valor: ['', Validators.required],
      escala: ['', [Validators.required, Validators.maxLength(250)]],
      //indicador: ['', Validators.required],
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
    this.listarCuali();
  }

  guardarCuali(cualiNu: Cualitativa) {
    this.cuali = this.frmCualitativa.value;
    console.log(cualiNu)
    this.service.crearCuali(cualiNu).
      subscribe(
        (reponse) => {
          console.log('Formula Cualitativa creado con éxito:', reponse);
          this.cuali = new Cualitativa();
          this.listarCuali();
          this.guardadoExitoso = true;
          this.guardadoExitoso2 = false;
        },
        (error) => {
          console.error('Error al crear el formula cuanti:', error);
        }
      )
  }

  eliminarCuali(cuali: Cualitativa) {

    this.service.eliminarCuali(cuali).
      subscribe((reponse) => {
        this.listarCuali();
      },
        (error: any) => {
          console.error('Error al listar los formulas cuali al eliminar:', error);
        })
  }
  listarCuali() {
    this.service.getCualitativa().
      subscribe(


        (data: any) => {
          this.listaCualitativa = data;
          this.dataSource.data= this.listaCualitativa
          console.log(this.listaCualitativa)
        },
        (error: any) => {
          console.error('Error al listar las formulas cualitativas', error);
        }
      )
  }

  editDatosCuali(cualiN: Cualitativa) {
    this.cuali = cualiN;
    this.guardadoExitoso = false;
    this.guardadoExitoso2 = true;

    this.frmCualitativa = new FormGroup({
      valor: new FormControl(cualiN.valor),
      escala: new FormControl(cualiN.escala),
      //indicador: new FormControl(cualiN.indicador)
    });
  }

  limpiarFormulario2() {
    this.frmCualitativa.reset();
    this.cuali = new Cualitativa;
  }

  actualizarCuali() {
    console.log(this.cuali);
    this.service.actualizarCuali(this.cuali)
      .subscribe(response => {
        this.cuali = new Cualitativa();
        this.listarCuali();
        this.guardadoExitoso = true;
        this.guardadoExitoso2 = false;
      });

    this.cuali.escala = "";
    this.cuali.valor = 0;
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.listaCualitativa;
    }
  }
}

