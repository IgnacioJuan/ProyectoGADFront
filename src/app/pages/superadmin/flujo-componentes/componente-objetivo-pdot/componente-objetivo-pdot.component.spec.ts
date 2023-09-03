import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteObjetivoPdotComponent } from './componente-objetivo-pdot.component';

describe('ComponenteObjetivoPdotComponent', () => {
  let component: ComponenteObjetivoPdotComponent;
  let fixture: ComponentFixture<ComponenteObjetivoPdotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteObjetivoPdotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteObjetivoPdotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
