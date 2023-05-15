import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  userdata: any;
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    //sessionStorage.clear();
  }
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
            sessionStorage.setItem('username', this.userdata.id);
            sessionStorage.setItem('userrole', this.userdata.role);
            sessionStorage.setItem('fullName', this.userdata.fullName);

            this.router.navigate(['home']);
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
}
