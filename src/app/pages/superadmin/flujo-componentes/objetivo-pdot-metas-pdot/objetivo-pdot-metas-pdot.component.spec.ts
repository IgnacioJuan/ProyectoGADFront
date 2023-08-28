import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivoPdotMetasPdotComponent } from './objetivo-pdot-metas-pdot.component';

describe('ObjetivoPdotMetasPdotComponent', () => {
  let component: ObjetivoPdotMetasPdotComponent;
  let fixture: ComponentFixture<ObjetivoPdotMetasPdotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivoPdotMetasPdotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetivoPdotMetasPdotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
