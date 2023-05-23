import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UserList } from '../users.model';

@Component({
  selector: 'app-deletepopup',
  templateUrl: './deletepopup.component.html',
  styleUrls: ['./deletepopup.component.css'],
})
export class DeletepopupComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private toastr: ToastrService,
    private builder: FormBuilder,
    private service: AuthService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
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

  rolelist: UserList[] = [];
  user: UserList = new UserList();
  registerform = this.builder.group({
    id: this.builder.control(''),
    fullName: this.builder.control('', Validators.required),
    password: this.builder.control(''),
    confirmPassword: this.builder.control(''),
    role: this.builder.control('', Validators.required),
  });

  deleteUser() {
    this.user.id = this.registerform.value.id || '';
    this.user.fullName = this.registerform.value.fullName || '';
    this.user.password = this.registerform.value.password || '';
    this.user.confirmPassword = this.registerform.value.confirmPassword || '';
    this.user.status = false;
    this.user.role = this.registerform.value.role || '';

    if (this.registerform.valid) {
      this.service
        .delete(this.registerform.value.id || '')
        .subscribe((res) => {});
      this.service.deletedUsers(this.user).subscribe((res) => {});

      alert('Deleted successfully');
      this.router.navigate(['user']);
      this.dialog.closeAll();
    } else {
      alert('User Already Deleted');
    }
  }

  // checking input box
  onFullName(value: string) {
    this.fullName = value;
  }
  onEmail(value: string) {
    this.email = value;
  }
  onPassword(value: string) {
    this.password = value;
  }

  onConfirmPassword(value: string) {
    this.confirmPassword = value;
  }
}
