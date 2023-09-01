import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarporUsuarioComponent } from './listarpoaporusuario.component';

describe('PoaComponent', () => {
  let component: ListarporUsuarioComponent;
  let fixture: ComponentFixture<ListarporUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarporUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarporUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});