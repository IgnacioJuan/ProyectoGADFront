import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoUsuariosComponent } from './dialogo-usuarios.component';

describe('DialogoUsuariosComponent', () => {
  let component: DialogoUsuariosComponent;
  let fixture: ComponentFixture<DialogoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
