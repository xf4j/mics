import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStudyListComponent } from './patient-study-list.component';

describe('PatientStudyListComponent', () => {
  let component: PatientStudyListComponent;
  let fixture: ComponentFixture<PatientStudyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientStudyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStudyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
