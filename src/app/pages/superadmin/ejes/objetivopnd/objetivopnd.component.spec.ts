import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivopndComponent } from './objetivopnd.component';

describe('ObjetivopndComponent', () => {
  let component: ObjetivopndComponent;
  let fixture: ComponentFixture<ObjetivopndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivopndComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetivopndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
