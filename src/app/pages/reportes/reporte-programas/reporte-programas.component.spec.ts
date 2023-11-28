import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteProgramasComponent } from './reporte-programas.component';

describe('ReporteProgramasComponent', () => {
  let component: ReporteProgramasComponent;
  let fixture: ComponentFixture<ReporteProgramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteProgramasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteProgramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
