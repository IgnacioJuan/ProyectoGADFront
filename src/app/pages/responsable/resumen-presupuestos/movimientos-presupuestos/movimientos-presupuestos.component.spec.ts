import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosPresupuestosComponent } from './movimientos-presupuestos.component';

describe('MovimientosPresupuestosComponent', () => {
  let component: MovimientosPresupuestosComponent;
  let fixture: ComponentFixture<MovimientosPresupuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientosPresupuestosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosPresupuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
