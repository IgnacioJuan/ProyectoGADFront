import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActiviesComponent } from './add-activies.component';

describe('AddActiviesComponent', () => {
  let component: AddActiviesComponent;
  let fixture: ComponentFixture<AddActiviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActiviesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddActiviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
