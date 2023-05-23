import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserList } from '../users.model';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private service: AuthService) {}

  updateuser(emailX: string, userData: UserList) {
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
