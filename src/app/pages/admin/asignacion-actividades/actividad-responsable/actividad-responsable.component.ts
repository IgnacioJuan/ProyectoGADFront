import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
//import { Actividad } from 'src/app/models/Actividad';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad-responsable',
  templateUrl: './actividad-responsable.component.html',
  styleUrls: ['./actividad-responsable.component.css']
})
export class ActividadResponsableComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
