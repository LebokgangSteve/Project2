import { Component, DoCheck, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck {
  title = 'Project2';
  isRequired: any;
  constructor(
    private router: Router,
    private service: AuthService,
    private toastr: ToastrService,
    private builder: FormBuilder,
    private dialog: MatDialog
  ) {}
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['signin']);
  }

  checkRole() {
    if (sessionStorage.getItem('userrole') === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  ngDoCheck(): void {
    let currentUrl = this.router.url;

    if (currentUrl == '/signin' || currentUrl == '/signup') {
      this.isRequired = false;
    } else {
      this.isRequired = true;
    }
  }

  //  getFullName() {
  //   return 'Welcome ' + sessionStorage.getItem('fullName');
  //  }

  //Displaying user details
  emailX: any;
  nameX: any;
  passwordX: any;
  confirmPasswordX: any;
  roleX: any;
  usersX: any;

  ngOnInit(): void {
    this.service
      .GetByCode(sessionStorage.getItem('username'))
      .subscribe((res) => {
        this.usersX = res;
      });
  }

  update() {
    console.log('Update');
    console.log(sessionStorage.getItem('username'));
    this.emailX = this.usersX.id;
    this.nameX = this.usersX.fullName;
    this.passwordX = this.usersX.password;
    this.confirmPasswordX = this.usersX.confirmPassword;
    this.roleX = this.usersX.role;
  }

  //editing details-----------------------------------------------

  onName(value: string) {
    this.nameX = value;
  }
  onPassword(value: string) {
    this.passwordX = value;
  }
  onConfirmPassword(value: string) {
    this.confirmPasswordX = value;
  }

  registerform: any;
  updateuser() {
    this.registerform = this.builder.group({
      id: this.builder.control(this.emailX),
      fullName: this.builder.control(this.nameX, Validators.required),
      password: this.builder.control(
        this.passwordX,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ])
      ),
      confirmPassword: this.builder.control(
        this.confirmPasswordX,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ])
      ),
      role: this.builder.control(this.roleX, Validators.required),
    });

    this.service.UpdateUser(this.emailX, this.registerform.value).subscribe(
      (res) => {
        alert('Updated successfully');
        location.reload();
      },
      (err) => {
        alert('Update unsuccessful, Please try again');
      }
    );
  }
}
