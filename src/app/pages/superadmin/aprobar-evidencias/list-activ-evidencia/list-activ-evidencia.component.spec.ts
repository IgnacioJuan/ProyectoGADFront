import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActivEvidenciaComponent } from './list-activ-evidencia.component';

describe('ListActivEvidenciaComponent', () => {
  let component: ListActivEvidenciaComponent;
  let fixture: ComponentFixture<ListActivEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListActivEvidenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListActivEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
