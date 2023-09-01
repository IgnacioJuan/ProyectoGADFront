import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEspecificoPoaComponent } from './reporte-especifico-poa.component';

describe('ReporteEspecificoPoaComponent', () => {
  let component: ReporteEspecificoPoaComponent;
  let fixture: ComponentFixture<ReporteEspecificoPoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEspecificoPoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEspecificoPoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
