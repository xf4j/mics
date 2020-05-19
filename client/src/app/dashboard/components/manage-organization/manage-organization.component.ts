import { Component, OnInit } from '@angular/core';
import { UserService } from '@/users/services/user.service';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.component.html',
  styleUrls: ['./manage-organization.component.css']
})
export class ManageOrganizationComponent implements OnInit {
  organizationFields = ['address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip', 'address_country', 'phone', ];
  editForm: FormGroup[] = [];
  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    public auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.userService.getOrganizationDetail().subscribe(
      (data) => {
        let index = 0;
        for (const item of data) {
          this.editForm[index] = this.formBuilder.group({
          address_line1: [item.address_line1, Validators.required],
          address_line2: [item.address_line2, ],
          address_city: [item.address_city, Validators.required],
          address_state: [item.address_state, Validators.required],
          address_zip: [item.address_zip, Validators.required],
          address_country: [item.address_country, Validators.required],
          phone: [item.phone, Validators.required]
        });
          index++;
        }
      }
    );
  }

  onUpdate(id, index) {
    const request = {address_line1: this.editForm[index].controls.address_line1.value,
                     address_line2: this.editForm[index].controls.address_line2.value,
                     address_city: this.editForm[index].controls.address_city.value,
                     address_state: this.editForm[index].controls.address_state.value,
                     address_zip: this.editForm[index].controls.address_zip.value,
                     address_country: this.editForm[index].controls.address_country.value,
                     phone: this.editForm[index].controls.phone.value};
    this.userService.patchOrganizationDetail(id, request).subscribe();
  }
}
