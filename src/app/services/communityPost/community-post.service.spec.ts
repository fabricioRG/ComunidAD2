import { TestBed } from '@angular/core/testing';

import { CommunityPostService } from './community-post.service';

describe('CommunityPostService', () => {
  let service: CommunityPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityPostService);
  });

  /*it('should be created', () => {
    expect(service).toBeTruthy();
  });*/
});
