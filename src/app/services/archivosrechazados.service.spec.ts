import { TestBed } from '@angular/core/testing';

import { ArchivosrechazadosService } from './archivosrechazados.service';

describe('ArchivosrechazadosService', () => {
  let service: ArchivosrechazadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchivosrechazadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
