import { TestBed } from '@angular/core/testing';

import { AprobacionPoaService } from './aprobacion-poa.service';

describe('AprobacionPoaService', () => {
  let service: AprobacionPoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AprobacionPoaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
