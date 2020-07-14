import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesTabsComponent } from './series-tabs.component';

describe('SeriesTabsComponent', () => {
  let component: SeriesTabsComponent;
  let fixture: ComponentFixture<SeriesTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
