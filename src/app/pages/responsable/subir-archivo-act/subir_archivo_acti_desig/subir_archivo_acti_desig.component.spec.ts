/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Subir_archivo_acti_desigComponent } from './subir_archivo_acti_desig.component';

describe('Subir_archivo_acti_desigComponent', () => {
  let component: Subir_archivo_acti_desigComponent;
  let fixture: ComponentFixture<Subir_archivo_acti_desigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Subir_archivo_acti_desigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Subir_archivo_acti_desigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
