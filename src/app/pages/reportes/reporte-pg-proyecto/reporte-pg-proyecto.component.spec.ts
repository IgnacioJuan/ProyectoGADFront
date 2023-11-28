import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePgProyectoComponent } from './reporte-pg-proyecto.component';

describe('ReportePgProyectoComponent', () => {
  let component: ReportePgProyectoComponent;
  let fixture: ComponentFixture<ReportePgProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePgProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportePgProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
