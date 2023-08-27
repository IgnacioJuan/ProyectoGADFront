import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoPoaComponent } from './proyecto-poa.component';

describe('ProyectoPoaComponent', () => {
  let component: ProyectoPoaComponent;
  let fixture: ComponentFixture<ProyectoPoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoPoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoPoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
