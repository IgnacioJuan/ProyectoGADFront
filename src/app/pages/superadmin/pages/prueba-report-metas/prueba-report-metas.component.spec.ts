import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaReportMetasComponent } from './prueba-report-metas.component';

describe('PruebaReportMetasComponent', () => {
  let component: PruebaReportMetasComponent;
  let fixture: ComponentFixture<PruebaReportMetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebaReportMetasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaReportMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
