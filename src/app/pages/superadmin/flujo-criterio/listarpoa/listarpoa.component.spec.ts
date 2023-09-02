import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarpoaComponent } from './listarpoa.component';

describe('PoaComponent', () => {
  let component: ListarpoaComponent;
  let fixture: ComponentFixture<ListarpoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarpoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarpoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});