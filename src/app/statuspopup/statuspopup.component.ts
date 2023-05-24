import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UserList } from '../users.model';

@Component({
  selector: 'app-statuspopup',
  templateUrl: './statuspopup.component.html',
  styleUrls: ['./statuspopup.component.css'],
})
export class StatuspopupComponent {
  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  statusform = this.builder.group({
    id: this.builder.control(''),
    fullName: this.builder.control(''),
    password: this.builder.control(''),
    confirmPassword: this.builder.control(''),
    status: this.builder.control('', Validators.required),
    role: this.builder.control(''),
  });

  rolelist: UserList[] = [];
  user: UserList = new UserList();
  editdata: UserList = new UserList();
  ngOnInit(): void {
    this.service.GetAllRole().subscribe((res) => {
      this.rolelist = res;
    });

    if (this.data.usercode != null && this.data.usercode != '') {
      this.service.GetByCode(this.data.usercode).subscribe((res) => {
        this.editdata = res;
        this.statusform.setValue({
          id: this.editdata.id,
          fullName: this.editdata.fullName,
          password: this.editdata.password,
          confirmPassword: this.editdata.confirmPassword,
          status: this.editdata.status ? 'true' : 'false',
          role: this.editdata.role,
        });
      });
    }
  }

  onUpdateStatus() {
    this.user.id = this.statusform.value.id || '';
    this.user.fullName = this.statusform.value.fullName || '';
    this.user.password = this.statusform.value.password || '';
    this.user.confirmPassword = this.statusform.value.confirmPassword || '';
    this.user.status = Boolean(this.statusform.value.status);
    this.user.role = this.statusform.value.role || '';
    if (this.statusform.valid) {
      this.service
        .updateStatus(this.statusform.value.id || '', this.user)
        .subscribe((res) => {
          alert('Updated successfully');
        });
    } else {
      alert('Please select Status.');
    }
  }
}
