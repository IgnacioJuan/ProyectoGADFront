import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPoaComponent } from './registrar-poa.component';

describe('RegistrarPoaComponent', () => {
  let component: RegistrarPoaComponent;
  let fixture: ComponentFixture<RegistrarPoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarPoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
