import { TestBed } from '@angular/core/testing';

import { SeriesViewerResolverService } from './series-viewer-resolver.service';

describe('SeriesViewerResolverService', () => {
  let service: SeriesViewerResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeriesViewerResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
