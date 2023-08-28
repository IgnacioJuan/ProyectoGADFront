import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadEvidenciaComponent } from './actividad-evidencia.component';

describe('ActividadEvidenciaComponent', () => {
  let component: ActividadEvidenciaComponent;
  let fixture: ComponentFixture<ActividadEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadEvidenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
