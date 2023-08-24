import { EvaluarCuantitativaService } from './../../../../services/evaluar-cuantitativa.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cuantitativa } from 'src/app/models/Cuantitativa';
import { Encabezado_Evaluar } from 'src/app/models/Encabezado-Evaluar';
import { Evaluar_Cuantitativa } from 'src/app/models/Evaluar-Cuantitativa';
import { Indicador } from 'src/app/models/Indicador';
import { EncabezadoEvaluarService } from 'src/app/services/encabezado-evaluar.service';
import { FormulaService } from 'src/app/services/formula.service';
import * as math from 'mathjs';
import { Formulas } from 'src/app/models/Formulas';
import { FormulaEvaluarService } from 'src/app/services/formula/formulaevaluar.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { Criterio } from 'src/app/models/Criterio';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-evaluacion-cuantitativa',
  templateUrl: './evaluacion-cuantitativa.component.html',
  styleUrls: ['./evaluacion-cuantitativa.component.css']
})
export class EvaluacionCuantitativaComponent implements OnInit {



  miModal!: ElementRef;
  public encabezado_evaluar = new Encabezado_Evaluar();
  public evaluarcuantitativa = new Evaluar_Cuantitativa();
  public formulaobject = new Formulas();

  
  listaEvaluarCuant: Evaluar_Cuantitativa[] = [];
  listaCuantitativa: Cuantitativa[] = [];
  encabezadoslist: Encabezado_Evaluar[] = [];
  formula: string = '';
  descripcion: string = '';
  

  valores: any[] = [{ valor: 'asdf', escala: 'asdf' }];
  indicador: Indicador = new Indicador();
  subcriterio: Subcriterio = new Subcriterio();
  criterio: Criterio = new Criterio();

  filterPost = '';
  dataSource = new MatTableDataSource<Evaluar_Cuantitativa>();
  columnasUsuario: string[] = ['abreviatura', 'descripcion', 'actions'];

  filterPostmodal = '';
  dataSourcemodal = new MatTableDataSource<Cuantitativa>();
  columnasmodal: string[] = ['id_cuantitativa','abreviatura', 'descripcion', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild('paginator', { static: false }) paginator?: MatPaginator;
  @ViewChild('paginatormodal', { static: false }) paginatormodal?: MatPaginator;

  constructor(
    private service: FormulaService,
    private evacuantitativaservice: EvaluarCuantitativaService,
    private encabezadoservice: EncabezadoEvaluarService,
    private formulaevaluar: FormulaEvaluarService,
    private router: Router
  ) {
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      

      this.dataSource.paginator = this.paginator || null;
    }
  
    if (this.dataSourcemodal) {
      this.dataSourcemodal.paginator = this.paginatormodal || null;
    }
  }
  ngOnInit() {
    this.indicador = history.state.data;
    this.subcriterio = history.state.subcriterio;
    this.criterio = history.state.criterio;
    if (this.indicador == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.findEncabezado();

  }
  agregarOperador(operador: string) {
    const ultimoCaracter = this.formula.slice(-1);
    const regex = /[\d\w\)]/; // Expresión regular para buscar números, letras o el paréntesis de cierre
    if (ultimoCaracter && regex.test(ultimoCaracter)) {
      this.formula += operador;
    }
  }

  private numParentesis = 0;
  private pilaParentesis: string[] = [];
  agregarParentesis(operador: string) {
    if (operador === ')' && this.numParentesis === 0) {
      return; // No agregar el paréntesis de cierre
    }

    if (operador === '(') {
      const ultimoCaracter = this.formula.slice(-1);
      if (ultimoCaracter !== '*' && ultimoCaracter !== '+' && ultimoCaracter !== '-' && ultimoCaracter !== '/' && ultimoCaracter !== '(' && ultimoCaracter !== '') {
        this.formula += '*';
      }
    }
    this.formula += operador;
    if (operador === '(') {
      this.numParentesis++;
      this.pilaParentesis.push('(');
    } else if (operador === ')') {
      this.numParentesis--;
      this.pilaParentesis.pop();
    }
  }
  agregarValor(valor: any) {
    if (this.formula && !/[\+\-\*\(\)\/]$/.test(this.formula)) {

    } else {
      this.formula += valor.cuantitativa.abreviatura;
    }

  }
  agregarDescripcion(descripcion: string) {
    if (this.formula && !/[\+\-\*\(\)\/]$/.test(this.formula)) {

    } else {
      this.formula += descripcion;
    }

  }
  borrarUltimoCaracter() {
    const ultimoCaracter = this.formula.slice(-1);
    if (ultimoCaracter === '(') {
      this.numParentesis--;
      this.pilaParentesis.pop();
    } else if (ultimoCaracter === ')') {
      this.numParentesis++;
      this.pilaParentesis.push(')');
    }
    const regex = /\b\w+\b$/; // Expresión regular para buscar la última palabra
    const match = this.formula.match(regex);
    if (match) { // Si se encontró una palabra, borrarla completa
      this.formula = this.formula.slice(0, -match[0].length);
    } else { // Si no se encontró una palabra, borrar solo el último carácter
      this.formula = this.formula.slice(0, -1);
    }
  }
  guardarFormula(): void {
    this.formulaobject.formula = this.formula
    this.formulaobject.descripcion = this.descripcion
    if (this.encabezado_evaluar.formula?.id_formula == null) {
      //Creo la formula si no existe
      this.service.crear(this.formulaobject).subscribe(
        (response: any) => {
          console.log('formula creado con éxito:', response);

          this.formulaobject = response;
          this.encabezado_evaluar.formula = response;
          this.encabezadoservice.actualizar(this.encabezado_evaluar).subscribe(response => {
            this.findEncabezado();
            Swal.fire(
              'Exitoso',
              'Se ha completado el registro con exito',
              'success'
            )
          });
        },
        (error: any) => {
          console.error('Error al crear el formula:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
    } else {
      //Actualizo la formula 
      this.service.actualizar(this.encabezado_evaluar.formula?.id_formula, this.formulaobject).subscribe(
        (response: any) => {
          console.log('formula actualizada con éxito:', response);
          this.formulaobject = response;
          this.encabezado_evaluar.formula = response;
          this.encabezadoservice.actualizar(this.encabezado_evaluar).subscribe(response => {
            this.findEncabezado();
            Swal.fire(
              'Exitoso',
              'Se ha actualizado el registro con exito',
              'success'
            )
          });
        },
        (error: any) => {
          console.error('Error al actualizada el formula:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
    }
  }

  findEncabezado(): void {

    this.encabezadoservice.getEncabezado_Evaluar().subscribe(
      (data: any) => {
        this.encabezadoslist = data.filter((encabezado: Encabezado_Evaluar) => encabezado.indicador?.id_indicador === this.indicador.id_indicador);
        if (this.encabezadoslist.length == 0) {
          this.encabezado_evaluar.indicador = this.indicador;
          this.encabezadoservice.crear(this.encabezado_evaluar).subscribe(
            (response: any) => {
              Swal.fire(
                'Exitoso',
                'Se ha creado un nuevo proceso de evaluacion cuantitativa',
                'success'
              )
              console.log('Encabezado creado con éxito:', response);
              this.encabezado_evaluar = response;
              this.listarEvaCuant();
            },
            (error: any) => {
              console.error('Error al crear el Encabezado:', error);
            }
          );
        } else {

          this.encabezado_evaluar = this.encabezadoslist[0];
          console.log(this.encabezado_evaluar)
          this.listarEvaCuant();
          if (this.encabezado_evaluar.formula != undefined) {
            this.formula = this.encabezado_evaluar.formula?.formula + "";
            this.descripcion = this.encabezado_evaluar.formula?.descripcion + "";
          }


        }
      },
      (error: any) => {
        console.error('Error al listar los encabezados:', error);
      }
    );

  }

  agregarVariable(cuanti: any) {
    this.evaluarcuantitativa.cuantitativa = cuanti;
    this.evaluarcuantitativa.encabezado_evaluar = this.encabezado_evaluar;
    this.evacuantitativaservice.crear(this.evaluarcuantitativa).
      subscribe(
        (reponse) => {
          console.log('Formula Cauntitativa creado con éxito:', reponse);
          this.listarEvaCuant();
          Swal.fire(
            'Exitoso',
            'Se ha agregado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear el formula cuanti:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      )
  }
  eliminarevacuant(cuanti: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el registro?',
      text: "Eliminar este registro puede alterar a tu formula!",
      showDenyButton: true,
      confirmButtonText: 'Cacelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        if (this.formula.includes(cuanti.cuantitativa.abreviatura)) {
          // La abreviatura está presente en la fórmula, no se puede eliminar
          Swal.fire(
            'Error',
            `No se puede eliminar el valor ${cuanti.cuantitativa.abreviatura}, está presente en la fórmula`,
            'warning'
          )
        } else {
          // La abreviatura no está en la fórmula, se puede eliminar
          this.evacuantitativaservice.eliminar(cuanti)
            .subscribe((reponse) => {
              this.listarEvaCuant();
              Swal.fire('Eliminado!', '', 'success')
            },
              (error: any) => {
                console.error('Error al listar los formulas cuanti al eliminar:', error);
                Swal.fire(
                  'Error',
                  'Ha ocurrido un error',
                  'warning'
                )
              });
        }
      }
    })
  }
  listarCaunti(): void {
    this.service.getCuantitativa().subscribe(
      (data: any) => {
        this.listaCuantitativa = data.filter((cuantitativa: any) => {
          return !this.listaEvaluarCuant.some((evaluacion_cuantitativa: any) => {
            return evaluacion_cuantitativa.cuantitativa?.id_cuantitativa === cuantitativa.id_cuantitativa;
          });
        });
        this.dataSourcemodal.data=this.listaCuantitativa;
      },
      (error: any) => {
        console.error('Error al listar las formulas cuantitativas', error);
      }
    )
  }
  listarEvaCuant(): void {
    this.evacuantitativaservice.getEvaluar_Cuantitativas().
      subscribe(
        (data: any) => {
          this.listaEvaluarCuant = data.filter((evaluacion_cuantitativa: Evaluar_Cuantitativa) => evaluacion_cuantitativa.encabezado_evaluar?.id_encabezado_evaluar === this.encabezado_evaluar.id_encabezado_evaluar);
          this.dataSource.data=this.listaEvaluarCuant;
        },
        (error: any) => {
          console.error('Error al listar las formulas cuantitativas', error);
        }
      )
  }

  evaluateEquation(equation: string, letterValues: Record<string, number>): any {
    const substitutedEquation = equation.replace(/([A-Z]+)/g, (match, letter) => {
      const value = letterValues[letter];
      if (value === undefined) {
        throw new Error(`Unknown letter ${letter} in equation`);
      }
      return value.toString();
    });
    return math.evaluate(substitutedEquation);
  }


  test(): void {
    console.log(this.formula);
    console.log(this.listaEvaluarCuant);
    const letterValues: Record<string, number> = {};

    // Asignar valores aleatorios a cada abreviatura
    for (const cuantitativa of this.listaEvaluarCuant) {
      const value = Math.random() * 10;
      letterValues[cuantitativa.cuantitativa?.abreviatura as keyof typeof letterValues] = value;
      console.log(cuantitativa.cuantitativa?.abreviatura, value);
    }
    const substitutedEquation = this.formula.replace(/([a-zA-Z]+)/g, (match, letter) => {
      const value = letterValues[letter];
      if (value === undefined) {
        throw new Error(`Unknown letter ${letter} in equation`);
      }
      return value.toString();
    });
    let result;
    try {
      result = math.evaluate(substitutedEquation).toFixed(2);
      if (!isFinite(result)) {
        throw new Error('Infinity or NaN');
      }
    } catch (error) {
      result = 'Error';
    }
    console.log(result);

    // Mostrar alerta con los valores utilizados y el resultado
    const abreviaturas = Object.keys(letterValues).map(abreviatura => `${abreviatura}: ${letterValues[abreviatura].toFixed(2)}`);
    const contenidoAlerta = `Valores utilizados:<br>${abreviaturas.join('<br>')}` +
      `<br><br>Resultado: ${result}`;
    const icon = result === 'Error' ? 'error' : 'info';
    const title = result === 'Error' ? 'Error en la evaluación' : 'Resultado de la evaluación';
    Swal.fire({
      icon: icon,
      title: title,
      html: contenidoAlerta,
      confirmButtonText: 'Ok'
    });
  }
  info(): void {
    Swal.fire({
      title: 'Info',
      icon: 'info',
      html:
        '<button class="btn btn-primary"><i class="fa fa-file"></i></button> <br/> Guarda o modifica la formula y la descripcion que se encuentren en sus respectivos campos de texto. <br/>' +
        '<br/><button class="btn btn-danger"><i class="fa fa-eraser"></i></button> <br/> Elimina los elementos de la formula de derecha a izquierda.<br/>' +
        '<br/><button class="btn btn-info"> <i class="fas fa-cog" style="font-size: 1.5em"></i> </button> <br/> <small>Realiza un test de la formula con valores aleatorios. <br/> Es posible que el testeo no detecte completamente posibles errores futuros</small>',

      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Genial!',
      confirmButtonAriaLabel: 'Thumbs up, great!'
    })
  }
  infooperadores(): void {
    Swal.fire({
      title: 'Info',
      icon: 'info',
      html:
        'Puede agregar los operadores a la formula presionando en los botones que corresponden al operador. <br/><br/>' +
        '<button class="btn btn-primary" > Agregar </button> <br/>' +
        'Ademas puede agregar valores numericos, solo debe ingresar el valor y presionar en el boton agregar ',

      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Genial!',
      confirmButtonAriaLabel: 'Thumbs up, great!'
    })
  }
  infocuantitativas(): void {
    Swal.fire({
      title: 'Info',
      icon: 'info',
      html:
        '<button class="btn btn-primary" > Agregar Variable </button>' +
        '<br/><br/> Presione para visualizar el listado de variables cuantitativas y seleccione la que necesite usar <br/>' +
        '<br/><button class="btn btn-danger" > <i class="fa fa-trash"></i> </button> <br/>' +
        '<br/>Elimine las variables que no necesita para la formula' +
        '<i class="fas fa-exclamation-triangle me-2"></i>Recuerde que eliminar variables que esten en la formula puede ocasionar errores<br/>' +
        '<br/><button class="btn btn-primary" ><i class="fa fa-check"></i></button> <br/>' +
        '<br/>Presione este boton para agregar el registro de la fila a la formula'
      ,

      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Genial!',
      confirmButtonAriaLabel: 'Thumbs up, great!'
    })
  }
  verIndicadores() {
    this.router.navigate(['/sup/flujo-criterio/subcriterios-indicador'], { state: { data: this.subcriterio, criterio: this.criterio } });
  }
  verSubcriterios() {
    this.router.navigate(['/sup/flujo-criterio/criterios-subcriterio'], { state: { data: this.criterio } });
  }
  verCriterios() {
    this.router.navigate(['/sup/flujo-criterio/criterioSuper']);
  }
  irCuantitativas() {
    this.router.navigate(['/sup/formula/cuantitativa']);
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.listaEvaluarCuant;;
    }
  }
  aplicarFiltromodal() {
    if (this.filterPostmodal) {
      const lowerCaseFilter = this.filterPostmodal.toLowerCase();
      this.dataSourcemodal.data = this.dataSourcemodal.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSourcemodal.data = this.listaCuantitativa;;
    }
  }


}