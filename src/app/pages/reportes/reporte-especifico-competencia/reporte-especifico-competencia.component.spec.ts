import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEspecificoCompetenciaComponent } from './reporte-especifico-competencia.component';

describe('ReporteEspecificoCompetenciaComponent', () => {
  let component: ReporteEspecificoCompetenciaComponent;
  let fixture: ComponentFixture<ReporteEspecificoCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEspecificoCompetenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEspecificoCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
