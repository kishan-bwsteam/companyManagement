import { TestBed } from '@angular/core/testing';

import { BankdetailService } from './bankdetail.service';

describe('BankdetailService', () => {
  let service: BankdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
