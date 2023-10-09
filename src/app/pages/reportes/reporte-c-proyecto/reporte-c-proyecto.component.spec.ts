import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCProyectoComponent } from './reporte-c-proyecto.component';

describe('ReporteCProyectoComponent', () => {
  let component: ReporteCProyectoComponent;
  let fixture: ComponentFixture<ReporteCProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
