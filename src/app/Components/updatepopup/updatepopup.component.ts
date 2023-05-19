import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UserData } from 'src/app/resetpassword/resetpassword.component';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css'],
})
export class UpdatepopupComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  editdata: any;
  ngOnInit(): void {
    this.service.GetAllRole().subscribe((res) => {
      this.rolelist = res;
    });
    if (this.data.usercode != null && this.data.usercode != '') {
      this.service.GetByCode(this.data.usercode).subscribe((res) => {
        this.editdata = res;
        this.registerform.setValue({
          id: this.editdata.id,
          fullName: this.editdata.fullName,
          password: this.editdata.password,
          confirmPassword: this.editdata.confirmPassword,
          status: this.editdata.status,
          role: this.editdata.role,
        });
      });
    }
  }

  mapUser(
    userData:
      | UserData
      | undefined
      | Partial<{
          id: string | null;
          fullName: string | null;
          password: string | null;
          confirmPassword: string | null;
          status: string | null;
          role: string | null;
        }>
  ) {
    if (userData) {
      return {
        id: userData.id || '',
        fullName: userData.fullName,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        status: userData.status,
        role: userData.role,
      };
    } else {
      return undefined;
    }
  }

  rolelist: any;
  registerform = this.builder.group({
    id: this.builder.control(''),
    fullName: this.builder.control('', Validators.required),
    password: this.builder.control(''),
    confirmPassword: this.builder.control(''),
    status: this.builder.control(''),
    role: this.builder.control('', Validators.required),
  });
  updateuser() {
    let userData: UserData = {
      id: this.registerform.value.id || '',
      fullName: this.registerform.value.fullName || '',
      password: this.registerform.value.password || '',
      confirmPassword: this.registerform.value.confirmPassword || '',
      status: Boolean(this.registerform.value.status) || false,
      role: this.registerform.value.role || '',
    };
    if (this.registerform.valid) {
      this.service

        .UpdateUser(this.registerform.value.id, userData)
        .subscribe((res) => {
          alert('Updated successfully');
        });
    } else {
      alert('Please select Role.');
    }
  }
}
