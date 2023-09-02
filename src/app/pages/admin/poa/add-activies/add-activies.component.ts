import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RegistrarPoaComponent } from '../registrar-poa/registrar-poa.component';

@Component({
  selector: 'app-add-activies',
  templateUrl: './add-activies.component.html',
  styleUrls: ['./add-activies.component.css']
})
export class AddActiviesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RegistrarPoaComponent>) { }

  ngOnInit(): void {
  }
}
