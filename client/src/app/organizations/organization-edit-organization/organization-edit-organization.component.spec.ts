import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEditOrganizationComponent } from './organization-edit-organization.component';

describe('OrganizationEditOrganizationComponent', () => {
  let component: OrganizationEditOrganizationComponent;
  let fixture: ComponentFixture<OrganizationEditOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationEditOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEditOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
