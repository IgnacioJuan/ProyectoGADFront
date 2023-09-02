import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Poa } from 'src/app/models/Poa';
import { PoaService } from 'src/app/services/poa.service';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {
  transform(value: any): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }
}

@Component({
  selector: 'app-reporteavancepoa',
  templateUrl: './reporteavancepoa.component.html',
  styleUrls: ['./reporteavancepoa.component.css']
})

export class ReporteavancepoaComponent implements OnInit {
  modeloPoa: any[] = [];
  poa =new Poa();

  constructor(
    private servicePoa: PoaService,
    private  router :Router,
    private proyectoService: ProyectoService, 
    ) {}

  ngOnInit(): void {
    this.listarPoa();
  }
  

  listarPoa() {
    this.servicePoa.listarPoa().subscribe(data => {
      this.modeloPoa = data;
      console.log(this.modeloPoa, "listaaa");
    });
  }

  enviarPoa1(poae: Poa): void {
    localStorage.setItem("id", poae.id_poa.toString());
    this.poa = poae;
    this.router.navigate(['sup/reporteEspecificoPoa']);
  }
  enviarPoa(poae: Poa): void {
    this.router.navigate(['sup/reporteEspecificoPoa', poae.id_poa]);
  }
  
}

