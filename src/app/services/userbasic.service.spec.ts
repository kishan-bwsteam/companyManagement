import { TestBed } from '@angular/core/testing';

import { UserbasicService } from './userbasic.service';

describe('UserbasicService', () => {
  let service: UserbasicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserbasicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
