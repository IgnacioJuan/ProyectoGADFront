import { TestBed } from '@angular/core/testing';

import { EjeService } from './eje.service';

describe('EjeService', () => {
  let service: EjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
