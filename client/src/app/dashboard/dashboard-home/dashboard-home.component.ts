import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';


import { AuthService } from '../../users/auth.service';
import { UserService } from '../../users/user.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  selectedAthlete: any;
  showUploadBox: boolean = false;
  userList: any[] = [];
  organizationList: any[] = [];
  editMode: boolean = false;
  athleteForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private confirmDialog: MatDialog
  ) {
    this.authService.toggleSidenav(true);
    this.authService.disableSidenav(false);
    this.athleteForm = this.formBuilder.group({
      name: new FormControl({ value: '', disabled: true }),
      organization_id: new FormControl({ value: '', disabled: true }),
      height: new FormControl({ value: '', disabled: true }),
      weight: new FormControl({ value: '', disabled: true }),
      user: new FormControl({ value: null, disabled: true })
    });

  }

  ngOnInit(): void {
    
  }
}
