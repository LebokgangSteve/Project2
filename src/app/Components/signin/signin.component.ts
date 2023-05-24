import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { AppComponent } from 'src/app/app.component';
import { UserList } from 'src/app/users.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  showPassword: boolean = false;
  userdata: UserList = new UserList();
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router,
    private app: AppComponent
  ) {}
  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      this.router.navigate(['home']);
    }
  }

  loginform = this.builder.group({
    email: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
  });

  proceedlogin() {
    if (this.loginform.valid) {
      this.service.GetByCode(this.loginform.value.email).subscribe(
        (res) => {
          this.userdata = res;
          if (this.userdata.password === this.loginform.value.password) {
            if (this.userdata.status === true) {
              const date = new Date().setMinutes(new Date().getSeconds() + 60);
              sessionStorage.setItem(
                'expiredSession',
                JSON.stringify({
                  value: String,
                  sessDate: date,
                })
              );
              sessionStorage.setItem('username', this.userdata.id);
              sessionStorage.setItem('userrole', this.userdata.role);
              sessionStorage.setItem('fullName', this.userdata.fullName);

              this.router.navigate(['home']);
              this.app.ngOnInit();
            } else {
              window.alert('User is not active, please contact administrator');
            }
          } else {
            window.alert('incorrect password');
          }
        },
        (error: Response) => {
          if (error.status === 404) {
            window.alert('Username not found');
          }
        }
      );
    } else {
      window.alert('Enter valid data');
    }
  }

  visibility(): void {
    this.showPassword = !this.showPassword;
  }
}
