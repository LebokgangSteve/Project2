import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

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

  editdata: any;
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
          status: this.editdata.status,
          role: this.editdata.role,
        });
      });
    }
  }

  rolelist: any;
  statusform = this.builder.group({
    id: this.builder.control(''),
    fullName: this.builder.control(''),
    password: this.builder.control(''),
    confirmPassword: this.builder.control(''),
    status: this.builder.control('', Validators.required),
    role: this.builder.control(''),
  });

  onUpdateStatus() {
    if (this.statusform.valid) {
      this.service
        .updateStatus(this.statusform.value.id, this.statusform.value)
        .subscribe((res) => {
          console.log('status-updated: ', res);
          alert('Updated successfully');
        });
      // this.service.GetByCode(userId).subscribe((res: any) => {
      //   console.log('rrr: ', res.status)
      //   this.user = res;
      // });
    } else {
      alert('Please select Status.');
    }
  }
}
