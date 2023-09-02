import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Componentes } from 'src/app/models/Componentes';
import { MetasPDOT } from 'src/app/models/MetasPDOT';
import { ObjetivoPDOT } from 'src/app/models/ObjetivoPDOT';
import { MetasPdotService } from 'src/app/services/metas-pdot.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-objetivo-pdot-metas-pdot',
  templateUrl: './objetivo-pdot-metas-pdot.component.html',
  styleUrls: ['./objetivo-pdot-metas-pdot.component.css']
})
export class ObjetivoPdotMetasPdotComponent implements OnInit  {
formMeta: FormGroup;
guardadoExitoso: boolean = false;
//tabla
itemsPerPageLabel = 'Metas PDOT por página';
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
objPDOT: ObjetivoPDOT = new ObjetivoPDOT();
 componente: Componentes = new Componentes();
listaMetasPdot: MetasPDOT[] = [];



miModal!: ElementRef;
//public indic = new Indicador();
public metaPDOT = new MetasPDOT();

//Buscar
filterPost = '';
filteredComponentes: any[] = [];
resultadosEncontrados: boolean = true;

dataSource = new MatTableDataSource<MetasPDOT>();

columnasUsuario: string[] = ['id_meta_pdot', 'nombre', 'descripcion','meta_final', 'linea_base', 'cantidadIndicadores', 'actions'];

@ViewChild('datosModalRef') datosModalRef: any;
@ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

constructor(private paginatorIntl: MatPaginatorIntl,
  private router: Router, private fb: FormBuilder,
  private route: ActivatedRoute,
  private metaPDOTService: MetasPdotService
) {
  this.formMeta = fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    meta_final: ['', Validators.required],
    linea_base: ['', Validators.required],

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
ngOnInit() {
 
  this.objPDOT = history.state.data;
  this.componente = history.state.componente;
  if (this.objPDOT == undefined) {
    this.router.navigate(['user-dashboard']);
    location.replace('/use/user-dashboard');
  }
  console.log("DATAAAAAAAAAAAAAAAAAA")
  console.log(this.objPDOT)
  this.listar(this.objPDOT.id_objetivo_pdot)
}



guardar() {
  this.metaPDOT = this.formMeta.value;
  this.metaPDOT.objetivopdot = this.objPDOT;
  console.log(this.metaPDOT)
  
  this.metaPDOTService.crear(this.metaPDOT)
    .subscribe(
      (response: any) => {
        console.log('Meta PDOT creado con éxito:', response);
        this.guardadoExitoso = true;
        this.listar(this.objPDOT.id_objetivo_pdot);
        Swal.fire(
          'Exitoso',
          'Se ha completado el registro con exito',
          'success'
        )
      },
      (error: any) => {
        console.error('Error al crear la Meta PDOT :', error);
        Swal.fire(
          'Error',
          'Ha ocurrido un error',
          'warning'
        )
      }
    );

}
eliminar(meta: any) {
  Swal.fire({
    title: 'Estas seguro de eliminar el registro?',
    showDenyButton: true,
    confirmButtonText: 'Cacelar',
    denyButtonText: `Eliminar`,
  }).then((result) => {
    if (!result.isConfirmed) {
      this.metaPDOTService.eliminar(meta.id_meta_pdot, meta).subscribe(
        (response: any) => {
          this.listar(this.objPDOT.id_objetivo_pdot)
          Swal.fire('Eliminado!', '', 'success')
        }
      );
    }
  })
}


listar(idObjetivo: number): void {
  this.metaPDOTService.listarmetasPdotsPorIdObjetivo(idObjetivo).subscribe(
    (data: any[]) => {
      this.listaMetasPdot = data;
      console.log("DATAAAAAAAAAAAAAAAAAA")
      console.log(this.listaMetasPdot)

      this.dataSource.data = this.listaMetasPdot;
    },
    (error: any) => {
      console.error('Error al listar los objetivos:', error);
    }
  );
}

/*
listar(): void {
  this.metaPDOTService.listar().subscribe(
    (data: any[]) => {
      this.listaMetasPdot = data;
      this.dataSource.data=this.listaMetasPdot;
    },
    (error: any) => {
      console.error('Error al listar las metas:', error);
    }
  );
}*/

editDatos(meta: MetasPDOT) {
 this.metaPDOT = meta;
  this.formMeta = new FormGroup({
    nombre: new FormControl(meta.nombre),
    descripcion: new FormControl(meta.descripcion),
    meta_final: new FormControl(meta.meta_final),
    linea_base: new FormControl(meta.linea_base),

  });
}

limpiarFormulario() {
  this.formMeta.reset();
  this.metaPDOT = new MetasPDOT;
}

actualizar() {
  this.metaPDOT.nombre = this.formMeta.value.nombre;
  this.metaPDOT.descripcion = this.formMeta.value.descripcion;
  this.metaPDOT.meta_final = this.formMeta.value.meta_final;
  this.metaPDOT.linea_base = this.formMeta.value.linea_base;
  this.metaPDOT.objetivopdot = this.objPDOT;
  this.metaPDOT.visible = true;

  this.metaPDOTService.actualizar(this.metaPDOT.id_meta_pdot, this.metaPDOT)
    .subscribe((response: any) => {
      this.metaPDOT = new MetasPDOT;
      this.listar(this.objPDOT.id_objetivo_pdot);
      Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')

    });
}


verIndicadores(metaPDOT: any) {
console.log(metaPDOT);
console.log(this.componente);
console.log(this.objPDOT);
 this.router.navigate(['/sup/flujo_Componentes/metasPDOT_Indicadores'], { state: { data: metaPDOT, componente:this.componente, objPDOT:this.objPDOT } });
}
verObjetivosDOT() {
  this.router.navigate(['/sup/flujo_Componentes/componente_objetivoPDOT'], { state: { data: this.objPDOT } });
}
verComponentes() {
  this.router.navigate(['/sup/flujo_Componentes/componentesSuper']);
}

buscar() {
  // Filtra los componentes basados en el filtro
  this.filteredComponentes = this.listaMetasPdot.filter((meta) =>
    meta.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
  );

  // Actualiza los datos del dataSource con los resultados filtrados
  this.dataSource.data = this.filteredComponentes;

  // Verifica si se encontraron resultados
  this.resultadosEncontrados = this.filteredComponentes.length > 0;
}

}
