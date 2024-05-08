import { TestBed } from '@angular/core/testing';

import { UsdaService } from './usda.service';

describe('UsdaService', () => {
  let service: UsdaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsdaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
