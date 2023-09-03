import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoaActividadComponent } from './poa-actividad.component';

describe('PoaActividadComponent', () => {
  let component: PoaActividadComponent;
  let fixture: ComponentFixture<PoaActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoaActividadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoaActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
