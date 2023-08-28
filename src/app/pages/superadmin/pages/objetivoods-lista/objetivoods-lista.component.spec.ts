import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivoodsListaComponent } from './objetivoods-lista.component';

describe('ObjetivoodsListaComponent', () => {
  let component: ObjetivoodsListaComponent;
  let fixture: ComponentFixture<ObjetivoodsListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivoodsListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetivoodsListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
