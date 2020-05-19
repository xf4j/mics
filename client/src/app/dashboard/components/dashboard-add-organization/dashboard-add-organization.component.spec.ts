import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAddOrganizationComponent } from './dashboard-add-organization.component';

describe('DashboardAddOrganizationComponent', () => {
  let component: DashboardAddOrganizationComponent;
  let fixture: ComponentFixture<DashboardAddOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAddOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAddOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
