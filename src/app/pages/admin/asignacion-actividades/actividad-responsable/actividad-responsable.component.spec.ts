import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadResponsableComponent } from './actividad-responsable.component';

describe('ActividadResponsableComponent', () => {
  let component: ActividadResponsableComponent;
  let fixture: ComponentFixture<ActividadResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadResponsableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
