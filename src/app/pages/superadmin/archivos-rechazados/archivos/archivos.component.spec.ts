import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosRechazadosComponent} from './archivos.component';

describe('ArchivosComponent', () => {
  let component: ArchivosRechazadosComponent;
  let fixture: ComponentFixture<ArchivosRechazadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosRechazadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivosRechazadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
