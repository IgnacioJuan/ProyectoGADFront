import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteavancepoaComponent } from './reporteavancepoa.component';

describe('ReporteavancepoaComponent', () => {
  let component: ReporteavancepoaComponent;
  let fixture: ComponentFixture<ReporteavancepoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteavancepoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteavancepoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
