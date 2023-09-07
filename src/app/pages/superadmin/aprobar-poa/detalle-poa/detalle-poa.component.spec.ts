import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePoaComponent } from './detalle-poa.component';

describe('DetallePoaComponent', () => {
  let component: DetallePoaComponent;
  let fixture: ComponentFixture<DetallePoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
