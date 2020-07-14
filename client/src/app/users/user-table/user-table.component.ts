import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { UserService, User } from '../user.service';
import { AuthService } from '../auth.service';
import { OrganizationService } from '../../organizations/organization.service';

import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  displayedColumns: string[] = ['select', 'username', 'organization', 'email', 'admin', 'action'];
  dataSource = new MatTableDataSource<User>();
  userSelection = new SelectionModel<User>(true, []);
  selectedUser: string | number = '';
  userForm: FormGroup;
  userList: User[] = [];
  organizationList: any[] = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private formBuilder: FormBuilder,
    private confirmDialog: MatDialog
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
      email: ['', Validators.email],
      profile: this.formBuilder.group({
        is_admin: false,
        organization: ''
      })
    });
  }

  ngOnInit(): void {

 // Get the organization list if staff or form a list of only the user's organization
    if (this.authService.is_staff) { // get organization list if staff
      this.organizationService.getOrganizationsList().subscribe(
        data => {
          this.organizationList = data;
          // this.userForm.get('profile.organization').patchValue(this.organizationList[0]);
        }
      );
    }
    else {
      // this.userForm.get('profile.organization').patchValue(this.authService.organizationId);
      this.organizationList = [{
        id: this.authService.organizationId,
        name: this.authService.organization
      }];
    }
    this.getUsers();
    
  }

  // Get users and set to datasource
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.userList = data;
        this.setDataSource(this.userList);
      }
    );
  }

  // Set the datasource and attach the paginator and sort
  private setDataSource(data): void {
    this.userSelection.clear();
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.userSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.userSelection.clear() :
      this.dataSource.data.forEach(row => this.userSelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.userSelection.isSelected(row) ? 'deselect' : 'select'} study ${row.id}`;
  }

  // Validator function to check if password and confirm-password are matching
  checkMatchingPasswords(): boolean {
    if (this.userForm.controls.password.value !== this.userForm.controls.confirmPassword.value) {
      this.userForm.controls.confirmPassword.setErrors({notMatching: true}); // set confirmPassword errors if not values matching
      return false;
    }
    this.userForm.controls.confirmPassword.setErrors(null); // otherwise set to null
    return true;
  }

  checkStaffStatus(): boolean {
    return this.authService.is_staff;
  }

  // Select a user to edit and add the editing columns
  setSelectedRow(user: User) {
    this.selectedUser = user.id;
    if (this.displayedColumns.includes('select')) this.displayedColumns.shift(); // removes select, the first column
    if (!this.displayedColumns.includes('password')) this.displayedColumns.splice(1, 0, 'password', 'confirmPassword');
    this.userSelection.clear();
    this.f.username.setValue(user.username);
    this.f.email.setValue(user.email);
    if (user.hasOwnProperty('profile') && user.profile != null) {
      this.userForm.patchValue({
        profile: {
          is_admin: user.profile['is_admin'],
          organization: user.profile['organization']
        }
      });
    } else {
      this.userForm.patchValue({
        profile: {
          is_admin: 'staff',
          organization: null
        }
      });
    }
    // this.userForm.get('profile.is_admin').patchValue(user['profile']['is_admin']);
    // this.userForm.get('profile.organization').patchValue(user['profile']['organization']);
  }
  // If form is valid, either add the user or update the selected user
  saveChanges(): void {
    if (!this.userForm.valid) return;
    // If creating a new user
    if (this.selectedUser == 'new-id') { 
      if (this.userForm.get('profile.is_admin').value == 'staff') {
        this.userService.addStaff(JSON.stringify(this.userForm.value)).subscribe(
          res => {
            this.getUsers();
            this.resetChanges();
          },
          err => { }
        );
      } else {
        this.userService.addUser(JSON.stringify(this.userForm.value)).subscribe(
          res => {
            this.getUsers();
            this.resetChanges();
          },
          err => { } // Don't do anything on error to let the user fix their errors
        );
      }
    } else { // If updating an existing user
      let form = {};
      for (let key in this.userForm.value) {
        // Only add key: dict if it's not empty and not a staff user
        if (this.userForm.value[key] !== null && this.userForm.value[key] !== '' && this.userForm.value[key]['is_admin'] !== 'staff') form[key] = this.userForm.value[key];
      }
      this.userService.updateUser(JSON.stringify(form), this.selectedUser).subscribe(
        res => {
          this.getUsers();
          this.resetChanges();
        },
        err => { } // Don't do anything on error to let the user fix their errors
      );
    }
  }

  // Prompt an extra confirmation and if delete is selected, request the user be deleted
  deleteRow():void {
    let users = this.userSelection.selected;
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '350px',
      maxWidth: '85vw',
      data: {
        message: "Are you sure you want to delete these users?",
        options: ["Delete", "Cancel"],
        detail: users.map(user => 'Username: ' + user.username)
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res == "Delete") {
          for (let i = 0; i < users.length; i++) {
            this.userService.deleteUser(users[i]).subscribe(
              res => {
                if (i == users.length - 1) {
                  this.getUsers();
                  this.resetChanges();
                }
              },
              err => {
                this.getUsers();
                this.resetChanges();
              }
            );
          }
        }
      }
    );
  }
  get f() {
    return this.userForm.controls;
  }

  // Remove the new row if added, reset the form, and reset the no-edit display
  resetChanges(): void {
    if (this.selectedUser == 'new-id') {
      this.userList = this.userList.filter(row => row.id != 'new-id');
      this.setDataSource(this.userList);
    }
    this.selectedUser = '';
    this.userForm.reset();
    if (!this.displayedColumns.includes('select')) this.displayedColumns.unshift('select');
    if (this.displayedColumns.includes('password')) this.displayedColumns = this.displayedColumns.filter(c => c != 'password' && c != 'confirmPassword');
  }

  // Open or close the extra table row for adding a new user
  toggleNewRow(): void {
    const index = this.userList.findIndex(user => user.id == 'new-id');
    if (index == -1) {
      this.userForm.reset();
      let newUser: User = {
        id: 'new-id',
        username: '',
        email: '',
        profile: {
          is_admin: false,
          organization: ''
        }
      };
      this.userList.push(newUser);
      this.setSelectedRow(newUser);
      this.selectedUser = newUser.id;
      if (this.displayedColumns.includes('select')) this.displayedColumns.shift(); // removes select, the first colum
      if (!this.displayedColumns.includes('password')) this.displayedColumns.splice(1, 0, 'password', 'confirmPassword');
    } else {
      this.userList.splice(index, 1);
      this.selectedUser = '';
      if (!this.displayedColumns.includes('select')) this.displayedColumns.unshift('select');
      if (this.displayedColumns.includes('password')) this.displayedColumns = this.displayedColumns.filter(c => c != 'password' && c != 'confirmPassword');
    }
    this.setDataSource(this.userList);
  }

  // return a string of a given user's priveleges
  getAdminStatus(user: User): string {
    if (!!user['profile']) return user.profile['is_admin'] ? 'admin' : 'user';
    return 'staff';
  }


}
