import { TestBed } from '@angular/core/testing';

import { StudyDetailResolverService } from './study-detail-resolver.service';

describe('StudyDetailResolverService', () => {
  let service: StudyDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
