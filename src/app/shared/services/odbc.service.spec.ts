import { TestBed, inject } from '@angular/core/testing';

import { OdbcService } from './odbc.service';

describe('OdbcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OdbcService]
    });
  });

  it('should be created', inject([OdbcService], (service: OdbcService) => {
    expect(service).toBeTruthy();
  }));
});
