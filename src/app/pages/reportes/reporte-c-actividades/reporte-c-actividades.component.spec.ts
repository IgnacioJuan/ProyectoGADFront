import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCActividadesComponent } from './reporte-c-actividades.component';

describe('ReporteCActividadesComponent', () => {
  let component: ReporteCActividadesComponent;
  let fixture: ComponentFixture<ReporteCActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCActividadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
