import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeloProyectoComponent } from './modelo-proyecto.component';

describe('ModeloProyectoComponent', () => {
  let component: ModeloProyectoComponent;
  let fixture: ComponentFixture<ModeloProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeloProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeloProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
