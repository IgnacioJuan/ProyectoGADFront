import {Component, OnInit} from '@angular/core';

import {FormBuilder, Validators} from "@angular/forms";
import {ObjetivoodsService} from "../../../../services/objetivoods.service";

import {Objetivoods} from "../../../../models/objetivoods";

@Component({
  selector: 'app-objetivoods-lista',
  templateUrl: './objetivoods-lista.component.html',
  styleUrls: ['./objetivoods-lista.component.css']
})
export class ObjetivoodsListaComponent implements OnInit {

  objetivosodslista: Objetivoods[] = [];
  constructor(private objetivoodsServicio: ObjetivoodsService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.obtenerobjetivosods();
  }


  private obtenerobjetivosods(){
    this.objetivoodsServicio.obtenerListaobjetivoods().subscribe(dato => {
      this.objetivosodslista = dato;
    });
  }
}
