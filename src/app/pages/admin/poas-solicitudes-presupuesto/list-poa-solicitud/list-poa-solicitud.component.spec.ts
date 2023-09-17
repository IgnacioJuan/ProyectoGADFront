import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPoaSolicitudComponent } from './list-poa-solicitud.component';

describe('ListPoaSolicitudComponent', () => {
  let component: ListPoaSolicitudComponent;
  let fixture: ComponentFixture<ListPoaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPoaSolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPoaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
