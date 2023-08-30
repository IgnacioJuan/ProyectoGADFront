import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from 'express';
import { Evidencia } from 'src/app/models/Evidencia';
import { EvidenciaService } from 'src/app/services/evidencia.service';

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.css']
})
export class EvidenciasRechazoComponent implements OnInit {
  ngOnInit(): void {
    
  }

   

}
