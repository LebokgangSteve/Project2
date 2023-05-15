import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

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
          role: this.editdata.role,
        });
      });
    }
  }
  rolelist: any;
  registerform = this.builder.group({
    id: this.builder.control(''),
    fullName: this.builder.control('', Validators.required),
    password: this.builder.control(''),
    confirmPassword: this.builder.control(''),
    role: this.builder.control('', Validators.required),
  });
  updateuser() {
    if (this.registerform.valid) {
      this.service
        .UpdateUser(this.registerform.value.id, this.registerform.value)
        .subscribe((res) => {
          alert('Updated successfully');
        });
    } else {
      alert('Please select Role.');
    }
  }
}
