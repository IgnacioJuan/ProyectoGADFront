import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
    UserProfileComponent,
    UserDashboardComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatSnackBarModule, // Agrega MatSnackBarModule
    MatButtonModule, // Agrega MatButtonModule si lo necesitas
    MatIconModule,
    MatDividerModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,

  ]
})
export class UserModule { }
