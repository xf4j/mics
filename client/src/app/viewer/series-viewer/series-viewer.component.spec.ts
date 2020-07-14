import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesViewerComponent } from './series-viewer.component';

describe('SeriesViewerComponent', () => {
  let component: SeriesViewerComponent;
  let fixture: ComponentFixture<SeriesViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
