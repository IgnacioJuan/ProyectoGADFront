import { Component, OnInit } from '@angular/core';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { ModeloPoaService } from 'src/app/services/modelo_poa.service';

@Component({
  selector: 'app-reporteavancepoa',
  templateUrl: './reporteavancepoa.component.html',
  styleUrls: ['./reporteavancepoa.component.css']
})
export class ReporteavancepoaComponent implements OnInit{

  modeloPoa : any[] = [];
  constructor(
    private serviceModeloPoa: ModeloPoaService
  ){

  }
  ngOnInit(): void {
    this.listarModelPoa();
    
  }

  listarModelPoa(){
    this.serviceModeloPoa.getModeloPoas().subscribe(data => {
      this.modeloPoa = data;
      console.log(this.modeloPoa,"listaaa")
    });
    
  }



}
