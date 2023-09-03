/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Actividades_desigComponent } from './actividades_desig.component';

describe('Actividades_desigComponent', () => {
  let component: Actividades_desigComponent;
  let fixture: ComponentFixture<Actividades_desigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Actividades_desigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Actividades_desigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
