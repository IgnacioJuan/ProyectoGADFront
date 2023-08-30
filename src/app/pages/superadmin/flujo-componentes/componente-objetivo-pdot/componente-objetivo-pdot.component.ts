import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Componentes } from 'src/app/models/Componentes';
import { Criterio } from 'src/app/models/Criterio';
import { ObjetivoPDOT } from 'src/app/models/ObjetivoPDOT';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { ObjetivoPdotService } from 'src/app/services/objetivo-pdot.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-objetivo-pdot',
  templateUrl: './componente-objetivo-pdot.component.html',
  styleUrls: ['./componente-objetivo-pdot.component.css']
})
export class ComponenteObjetivoPdotComponent  implements OnInit {
formObjetivoPdot: FormGroup;
guardadoExitoso: boolean = false;
//tabla
itemsPerPageLabel = 'Objetivo PDOT por página';
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
componente: Componentes = new Componentes();
objetivoPDOT: any[] = [];

miModal!: ElementRef;
public subcrite = new Subcriterio();
public objePDOT = new ObjetivoPDOT();

  //Buscar
  filterPost = '';
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;

dataSource = new MatTableDataSource<ObjetivoPDOT>();
columnasUsuario: string[] = ['id_objetivo_pdot', 'nombre', 'descripcion', 'cantidadMetas', 'actions'];

@ViewChild('datosModalRef') datosModalRef: any;
@ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

constructor(
  private paginatorIntl: MatPaginatorIntl,
  private router: Router, private fb: FormBuilder,
  private objetivoPdotService: ObjetivoPdotService,
) {
  this.formObjetivoPdot = fb.group({
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
ngOnInit() {
  const data = history.state.data;
  this.componente = data;
  console.log(this.componente);
  if (this.componente == undefined) {
    this.router.navigate(['user-dashboard']);
    location.replace('/use/user-dashboard');
  }
  this.listar(this.componente.id_componente)
}



guardar() {
  this.objePDOT = this.formObjetivoPdot.value;
  this.objePDOT.componente = this.componente;
  this.objetivoPdotService.crear(this.objePDOT)
    .subscribe(
      (response: any) => {
        console.log('Objetivo PDOT creado con éxito:', response);
        this.guardadoExitoso = true;
        this.listar(this.componente.id_componente);
        Swal.fire(
          'Exitoso',
          'Se ha completado el registro con exito',
          'success'
        )
      },
      (error: any) => {
        console.error('Error al crear el Objetivo PDOT:', error);
        Swal.fire(
          'Error',
          'Ha ocurrido un error',
          'warning'
        )
      }
    );

}
eliminar(objetivoP: any) {
  Swal.fire({
    title: 'Estas seguro de eliminar el registro?',
    showDenyButton: true,
    confirmButtonText: 'Cancelar',
    denyButtonText: `Eliminar`,
  }).then((result) => {
    if (!result.isConfirmed) {
        this.objetivoPdotService.eliminar(objetivoP).subscribe(
          (response) => {
            this.listar(this.componente.id_componente)
            Swal.fire('Eliminado!', '', 'success')

          }
        );
    }
  })

}




listar(idComponente: number): void {
  this.objetivoPdotService.listarObjetivosPdotsPorIdComponente(idComponente).subscribe(
    (data: any[]) => {
      this.objetivoPDOT = data;
      this.dataSource.data = this.objetivoPDOT;
    },
    (error: any) => {
      console.error('Error al listar los objetivos:', error);
    }
  );
}

//optimizar
/*
listar(): void {
  this.objetivoPdotService.listar().subscribe(
    (data: any[]) => {
      this.objetivoPDOT = data;
      this.dataSource.data = this.objetivoPDOT;
    },
    (error: any) => {
      console.error('Error al listar los subcriterios:', error);
    }
  );
}*/

editDatos(objetivo: ObjetivoPDOT) {
  this.objePDOT = objetivo;
  this.formObjetivoPdot = new FormGroup({
    nombre: new FormControl(this.objePDOT.nombre),
    descripcion: new FormControl(this.objePDOT.descripcion)

  });
}

limpiarFormulario() {
  this.formObjetivoPdot.reset();
  this.objePDOT = new ObjetivoPDOT;
}

actualizar() {
  this.objePDOT.nombre = this.formObjetivoPdot.value.nombre;
  this.objePDOT.descripcion = this.formObjetivoPdot.value.descripcion;
  this.objePDOT.componente = this.componente;

  this.objetivoPdotService.actualizar(this.objePDOT.id_objetivo_pdot, this.objePDOT)
    .subscribe((response: any) => {
      this.objePDOT = new ObjetivoPDOT;
      this.listar(this.componente.id_componente)
      Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
    });
}

verDetalles(objePDOT: any) {
  this.router.navigate(['/sup/flujo_Componentes/objetivoPDOT_metasPDOT'], { state: { data: objePDOT, componente: this.componente } });
}
verComponentes() {
  this.router.navigate(['/sup/flujo_Componentes/componentesSuper']);
}



buscar() {
  // Filtra los componentes basados en el filtro
  this.filteredComponentes = this.objetivoPDOT.filter((objetivo) =>
    objetivo.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
  );

  // Actualiza los datos del dataSource con los resultados filtrados
  this.dataSource.data = this.filteredComponentes;

  // Verifica si se encontraron resultados
  this.resultadosEncontrados = this.filteredComponentes.length > 0;
}

}
