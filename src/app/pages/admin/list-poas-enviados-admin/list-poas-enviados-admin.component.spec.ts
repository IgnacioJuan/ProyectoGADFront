import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPoasEnviadosAdminComponent } from './list-poas-enviados-admin.component';

describe('ListPoasEnviadosAdminComponent', () => {
  let component: ListPoasEnviadosAdminComponent;
  let fixture: ComponentFixture<ListPoasEnviadosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPoasEnviadosAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPoasEnviadosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
