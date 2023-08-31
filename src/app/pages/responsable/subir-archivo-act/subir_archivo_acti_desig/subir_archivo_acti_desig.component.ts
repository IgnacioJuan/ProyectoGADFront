import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Archivo } from 'src/app/models/Archivo';
import { ArchivoService } from 'src/app/services/archivo.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { Actividad_arch } from 'src/app/services/actividad_arch';
@Component({
  selector: 'app-subir_archivo_acti_desig',
  templateUrl: './subir_archivo_acti_desig.component.html',
  styleUrls: ['./subir_archivo_acti_desig.component.css']
})
export class Subir_archivo_acti_desigComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Archivo','Descripcion', 'Fecha','Valor', 'Borrar'];
  fileInfos: Observable<any> | undefined;
  isLoggedIn = false;
  user: any = null;
  aRCHI!: Archivo[];
  filearchivo!: File;
    archivon=new Actividad_arch();
   // Crear una fuente de datos para la tabla
 dataSource = new MatTableDataSource<Archivo>();
 formulario: FormGroup;
   
  constructor(
    private archivo: ArchivoService,
    public login: LoginService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      valor: [0, Validators.required]
    });

   }
   onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.filearchivo = event.target.files[0];
    }
  }
  @ViewChild('fileInput') fileInput!: ElementRef;
 
  
  activ: Actividad_arch = new Actividad_arch();
  archi: Archivo = new Archivo()


  ngOnInit() {
    const data = history.state.data;
    this.activ = data;
    if (this.activ == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    console.log("johb iid acti>>>>"+this.activ.id_actividad)
    
    const datos = history.state.data;
    this.archi = data;
    if (this.archi == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.isLoggedIn = this.login.isLoggedIn();
     this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();

      }
    )
    this.listar();

  }

  descripcion:string="";
  valor: number = 0;
    onUpload(): void {
    this.archivo.cargarpparagad(this.filearchivo, this.descripcion,this.valor, this.activ.id_actividad).subscribe(
      event => {
        console.log('Archivo subido:');
        // Lógica adicional después de subir el archivo
        Swal.fire({
          title: '¡Éxito!',
          text: 'El archivo se ha subido correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.descripcion = '';
        this.listar();
      },
      error => {
        console.error('Error al subir el archivo:', error);
        // Lógica adicional para manejar el error
        Swal.fire({
          title: '¡Error!',
          text: 'Nombre del archivo repetido',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
    // this.notificar();
    // this.notificaradmin();
  }

  limpiarFormulario() {
    this.formulario.reset();
    this.archi = new Archivo;
  }


  listar(): void {
    this.archivo.getarchivoActividad(this.activ.id_actividad).subscribe(data => {
      this.aRCHI = data;
      this.dataSource.data = data;
   });
  }

  elim(nom:string, id:any) {
    Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro de que quieres eliminar " + nom + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(nom);
        console.log(id);
        this.eliminarlog(id);
        Swal.fire("Eliminado", nom + " ha sido eliminado correctamente.", "success");
      }
    });
  }


  //eliminado de la carpeta
eliminar(filename: string) {
  this.archivo.borrar(filename).subscribe(res => {
    this.fileInfos = this.archivo.listar();
  })
}



eliminarlog(act:any) {
  this.archivo.eliminar(act).subscribe(
    (response) => {
      this.listar();
    },
    (error) => {
      console.error('Error al eliminar:', error);
    }
  );
}

filterPost = '';

aplicarFiltro() {
  if (this.filterPost) {
    const lowerCaseFilter = this.filterPost.toLowerCase();
    this.dataSource.data = this.dataSource.data.filter((item: any) => {
      return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
    });
  } else {

    // Restaurar los datos originales si no hay filtro aplicado
    this.listar();
    }
}

}
