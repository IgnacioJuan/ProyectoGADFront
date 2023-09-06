import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPoaActividadComponent } from './list-poa-actividad.component';

describe('ListPoaActividadComponent', () => {
  let component: ListPoaActividadComponent;
  let fixture: ComponentFixture<ListPoaActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPoaActividadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPoaActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
