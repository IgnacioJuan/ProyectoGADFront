import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteProyectoComponent } from './reporte-proyecto.component';

describe('ReporteProyectoComponent', () => {
  let component: ReporteProyectoComponent;
  let fixture: ComponentFixture<ReporteProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
