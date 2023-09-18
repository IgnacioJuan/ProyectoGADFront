import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoUresponsablesComponent } from './dialogo-uresponsables.component';

describe('DialogoUresponsablesComponent', () => {
  let component: DialogoUresponsablesComponent;
  let fixture: ComponentFixture<DialogoUresponsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoUresponsablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoUresponsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
