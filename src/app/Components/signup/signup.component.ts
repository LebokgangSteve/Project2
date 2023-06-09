import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { SigninComponent } from '../signin/signin.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword: boolean = false;

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {}

  registerform = this.builder.group({
    id: this.builder.control(
      '',
      Validators.compose([Validators.email, Validators.required])
    ),
    fullName: this.builder.control('', Validators.required),
    password: this.builder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ])
    ),
    confirmPassword: this.builder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ])
    ),
    role: this.builder.control('user'),
  });

  proceedRegistration() {
    if (this.registerform.valid) {
      this.service.ProceedRegistration(this.registerform.value).subscribe(
        (res) => {
          //this.toastr.success('Signup successful');
          alert('Signup successful');
          this.router.navigate(['signin']);
        },
        (error: Response) => {
          if (error.status === 500) {
            window.alert('Email already taken');
            //this.toastr.success('Email already taken');
          }
        }
      );
    } else {
      //this.toastr.success('Please enter valid data'); toastr not working
      alert('Please enter valid data'); //need to fix this one
    }
  }

  visibility(): void {
    this.showPassword = !this.showPassword;
  }



  // checking input box
  onFullName(value: string) {
    this.fullName = value;
  }
  onEmail(value: string) {
    this.email = value.toLowerCase();
  }
  onPassword(value: string) {
    this.password = value;
  }

  onConfirmPassword(value: string) {
    this.confirmPassword = value;
  }
}
