import { ComponentFixture, TestBed } from '@angular/core/testing';

import {EvidenciasRechazoComponent } from './evidencias.component';

describe('EvidenciasComponent', () => {
  let component: EvidenciasRechazoComponent;
  let fixture: ComponentFixture<EvidenciasRechazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenciasRechazoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciasRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
