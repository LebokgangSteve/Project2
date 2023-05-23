import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { UtilService } from '../service/util.service';
import { UserList } from '../users.model';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
})
export class ResetpasswordComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private utilService: UtilService,
    private router: Router
  ) {}
  userdata: UserList = new UserList();
  resetform = this.builder.group({
    email: this.builder.control(
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
  });

  proceedReset() {
    if (this.resetform.valid) {
      const email = this.resetform.value.email || '';
      this.service.GetByCode(email).subscribe((res) => {
        this.userdata = res;
        if (
          this.userdata.id === this.resetform.value.email &&
          this.userdata.fullName === this.resetform.value.fullName
        ) {
          this.userdata.password = this.resetform.value.password || '';
          this.userdata.confirmPassword =
            this.resetform.value.confirmPassword || '';
          this.service
            .UpdateUser(this.userdata.id, this.userdata)
            .subscribe((res) => {});
          
          alert('Password resetted successfully');

          this.router.navigate(['./signin']);
        } else {
          window.alert('Invalid combination of username and password');
        }
      });
    } else {
      window.alert('Enter valid data');
    }
  }
}
