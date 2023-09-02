import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesEvidenciasrechazadasComponent } from './actividades-evidenciasrechazadas.component';

describe('ActividadesEvidenciasrechazadasComponent', () => {
  let component: ActividadesEvidenciasrechazadasComponent;
  let fixture: ComponentFixture<ActividadesEvidenciasrechazadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadesEvidenciasrechazadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesEvidenciasrechazadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
