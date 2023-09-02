import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActArchivoComponent } from './list-act-archivo.component';

describe('ListActArchivoComponent', () => {
  let component: ListActArchivoComponent;
  let fixture: ComponentFixture<ListActArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListActArchivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListActArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
