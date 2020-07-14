import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { AuthService } from '../../users/auth.service';
import { OrganizationService } from '../../organizations/organization.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  opened: boolean;
  enabled: boolean;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public authService: AuthService,  //change to private
    public organizationService: OrganizationService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // if (this.authService.isLoggedIn() && Object.keys(this.athleteService.athletesList).length == 0) {
    //   
    //   this.athleteService.getAthletes();
    // }
  }

  ngOnInit(): void {
    this.authService.panelOpened.subscribe(
      state => {
        this.opened = state; // Open or close on subscribe
        
      }
    );
    this.authService.navDisabled.subscribe(
      state=>{
        this.enabled = state;
      }
    );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  setAthlete(athlete: any): void {
    //////to be added/this.athleteService.setSelectedAthlete(athlete);
    this.router.navigate(['dashboard']);
  } 
  // organization[] list
  setOrganization(organization? : any): void{
    if (!!organization) {
      this.organizationService.setSelectedOrganization(organization);
  }
  else{
    
    this.organizationService.setSelectedOrganization(null);
  }
    this.router.navigate(['dashboard']);
  }
  onOpenedChange(): void {
    this.authService.panelOpened.next(this.opened);
  }

  logout(): void {
    //////to be added/
    // this.athleteService.athletesList = {};
    // this.athleteService.setSelectedAthlete(null);
    this.authService.logout();
  }

  redirectHome(): void {
    this.authService.redirectHome();
  }

  checkLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  checkAdminStatus(): boolean {
    return this.authService.is_admin;
  }
  checkStaffStatus(): boolean {
    return this.authService.is_staff;
  }
  checkUsername(): string {
    return this.authService.username;
  }

  getOrganizationname() : string{
    
    return this.authService.organization;
  }

}
