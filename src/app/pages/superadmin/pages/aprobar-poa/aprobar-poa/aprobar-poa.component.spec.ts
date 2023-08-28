import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarPoaComponent } from './aprobar-poa.component';

describe('AprobarPoaComponent', () => {
  let component: AprobarPoaComponent;
  let fixture: ComponentFixture<AprobarPoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarPoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprobarPoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
