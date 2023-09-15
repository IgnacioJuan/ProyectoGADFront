import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearResponsablesComponent } from './crear-responsables.component';

describe('CrearResponsablesComponent', () => {
  let component: CrearResponsablesComponent;
  let fixture: ComponentFixture<CrearResponsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearResponsablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearResponsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
