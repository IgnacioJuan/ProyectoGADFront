import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasPdotIndicadoresComponent } from './metas-pdot-indicadores.component';

describe('MetasPdotIndicadoresComponent', () => {
  let component: MetasPdotIndicadoresComponent;
  let fixture: ComponentFixture<MetasPdotIndicadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetasPdotIndicadoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetasPdotIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
