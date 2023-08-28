import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjesListaComponent } from './ejes-lista.component';

describe('EjesListaComponent', () => {
  let component: EjesListaComponent;
  let fixture: ComponentFixture<EjesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjesListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
