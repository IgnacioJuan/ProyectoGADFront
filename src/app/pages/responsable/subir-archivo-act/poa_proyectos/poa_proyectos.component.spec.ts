/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Poa_proyectosComponent } from './poa_proyectos.component';

describe('Poa_proyectosComponent', () => {
  let component: Poa_proyectosComponent;
  let fixture: ComponentFixture<Poa_proyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Poa_proyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Poa_proyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
