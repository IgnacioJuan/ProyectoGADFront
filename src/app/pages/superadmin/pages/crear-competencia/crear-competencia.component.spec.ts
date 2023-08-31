import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearcompetenciaComponent } from './crear-competencia.component';

describe('CompetenciaComponent', () => {
  let component: CrearcompetenciaComponent;
  let fixture: ComponentFixture<CrearcompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearcompetenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearcompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});