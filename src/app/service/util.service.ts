import { Injectable } from '@angular/core';
import { UserData } from '../resetpassword/resetpassword.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

    constructor(private service: AuthService) {}


    updateuser(emailX: string, userData: UserData) {

        this.service.UpdateUser(emailX, userData).subscribe(
          () => {
            alert('Updated successfully');
            location.reload();
          },
          (err) => {
            alert('Update unsuccessful, Please try again');
          }
        );
      }

}
