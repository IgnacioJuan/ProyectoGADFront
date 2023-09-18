/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Repote_metasComponent } from './repote_metas.component';

describe('Repote_metasComponent', () => {
  let component: Repote_metasComponent;
  let fixture: ComponentFixture<Repote_metasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Repote_metasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Repote_metasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
