import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  apiurl = 'http://localhost:3000/user';
  apiurlStatus = 'http://localhost:3000/user/update-status';
  apiurldeleted = 'http://localhost:3000/deletedUsers';
  apiurldisabled = 'http://localhost:3000/disabledUsers';

  GetAll() {
    return this.http.get(this.apiurl);
  }
  GetAllRole() {
    return this.http.get('http://localhost:3000/role');
  }
  GetAllStatus() {
    return this.http.get('http://localhost:3000/status');
  }
  GetAllDisabled() {
    return this.http.get(this.apiurldisabled);
  }

  GetAllDeleted() {
    return this.http.get(this.apiurldeleted);
  }

  GetByDeleted(code: any) {
    return this.http.get(this.apiurldisabled + '/' + code);
  }

  GetByCode(code: any) {
    return this.http.get(this.apiurl + '/' + code);
  }
  ProceedRegistration(inputdata: any) {
    return this.http.post(this.apiurl, inputdata);
  }

  UpdateUser(code: any, inputdata: any) {
    return this.http.put<any>(this.apiurl + '/' + code, inputdata);
  }

  isLoggedIn() {
    return sessionStorage.getItem('username') != null;
  }

  delete(data: any) {
    return this.http.delete(this.apiurl + '/' + data);
  }

  deleteDisabled(data: any) {
    return this.http.delete(this.apiurldisabled + '/' + data);
  }

  deletedUsers(inputdata: any) {
    return this.http.post(this.apiurldeleted, inputdata);
  }

  disableUsers(inputdata: any) {
    return this.http.post(this.apiurldisabled, inputdata);
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

  updateStatus(code: any, status: any) {
    return this.http.put(this.apiurl + '/' + code, status);
  }
}
