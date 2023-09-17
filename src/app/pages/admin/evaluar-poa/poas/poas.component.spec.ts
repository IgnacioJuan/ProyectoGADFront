import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoasComponent } from './poas.component';

describe('PoasComponent', () => {
  let component: PoasComponent;
  let fixture: ComponentFixture<PoasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
