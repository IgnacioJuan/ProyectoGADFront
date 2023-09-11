import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSolicitudesPresupuestoSuperadminComponent } from './list-solicitudes-presupuesto-superadmin.component';

describe('ListSolicitudesPresupuestoSuperadminComponent', () => {
  let component: ListSolicitudesPresupuestoSuperadminComponent;
  let fixture: ComponentFixture<ListSolicitudesPresupuestoSuperadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSolicitudesPresupuestoSuperadminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSolicitudesPresupuestoSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
