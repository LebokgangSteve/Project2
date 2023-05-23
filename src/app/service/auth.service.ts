import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserList } from '../users.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  apiurl = 'http://localhost:3000/user';
  apiurlStatus = 'http://localhost:3000/user/update-status';
  apiurldeleted = 'http://localhost:3000/deletedUsers';
  apiurldisabled = 'http://localhost:3000/disabledUsers';

  GetAll(role: string = '') {
    if (role == '') {
      return this.http.get<UserList[]>(this.apiurl);
    } else {
      return this.http.get<UserList[]>(`${this.apiurl}?role=${role}`);
    }
  }

  GetAllStatuses(status: boolean = false) {
    if(status == false) {
      return this.http.get<UserList[]>(this.apiurl);
    } else {
      return this.http.get<UserList[]>(`${this.apiurl}?status=${status}`);
    }
  }

  GetAllRole() {
    return this.http.get<UserList[]>('http://localhost:3000/role');
  }
  GetAllStatus() {
    return this.http.get<UserList[]>('http://localhost:3000/status');
  }
  GetAllDisabled() {
    return this.http.get<UserList[]>(this.apiurldisabled);
  }

  GetAllDeleted() {
    return this.http.get<UserList[]>(this.apiurldeleted);
  }

  GetByDeleted(code: any) {
    return this.http.get<UserList[]>(this.apiurldisabled + '/' + code);
  }

  GetByCode(code: string | undefined | null): Observable<UserList> {
    return this.http.get<UserList>(this.apiurl + '/' + code);
  }
  ProceedRegistration(inputdata: any) {
    return this.http.post<UserList>(this.apiurl, inputdata);
  }

  UpdateUser(code: string | null | undefined, inputdata: UserList | undefined) {
    return this.http.put<UserList>(this.apiurl + '/' + code, inputdata);
  }

  isLoggedIn() {
    return sessionStorage.getItem('username') != null;
  }

  delete(data: string) {
    return this.http.delete(this.apiurl + '/' + data);
  }

  deletedUsers(inputdata: UserList) {
    return this.http.post<UserList>(this.apiurldeleted, inputdata);
  }

  getUserRole() {
    if (sessionStorage.getItem('role') != null) {
      return false;
    } else {
      return true;
    }
  }
  getUsers() {
    if (sessionStorage.getItem('role') === 'admin') {
      return false;
    } else {
      return true;
    }
  }

  //   getAdmin(){
  // if(this.GetAll.)
  //     return this.http.get(this.apiurl)
  //   }

  updateStatus(code: string, status: UserList) {
    return this.http.put(this.apiurl + '/' + code, status);
  }
}
