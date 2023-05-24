import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import { HttpClient } from '@angular/common/http';
import { DeletepopupComponent } from 'src/app/deletepopup/deletepopup.component';
import { StatuspopupComponent } from 'src/app/statuspopup/statuspopup.component';
import { UserList } from 'src/app/users.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private router: Router,
    private service: AuthService,
    private dialog: MatDialog
  ) {
    this.users();
    this.goTotDeleted();
  }

  userlist: UserList[] = [];
  dataSource: MatTableDataSource<UserList> = new MatTableDataSource();
  user: UserList = new UserList();
  totalActive: number = 0;
  totalInActive: number = 0;
  totalUsers: number = 0;
  totalAdmin: number = 0;
  total: number = 0;
  totalInActiveAdmin: number = 0;
  totalActiveAdmin: number = 0;

  deletedlist: UserList[] = [];
  deletedSource: any;
  totDeleted: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  goTotDeleted() {
    this.service.GetAllDeleted().subscribe((res) => {
      this.deletedlist = res;
      this.totDeleted = res.length;
      this.deletedSource = new MatTableDataSource(this.deletedlist);
      this.deletedSource.paginator = this.paginator;
      this.deletedSource.sort = this.sort;
    });
  }

  users() {
    this.service.GetAll().subscribe((res: UserList[]) => {
      //counting total
      this.total = res.length;

      //counting total active users
      this.totalActive = res.filter(
        (el: UserList) => el.status === true && el.role === 'user'
      ).length;

      //counting total not active users
      this.totalInActive = res.filter(
        (el: UserList) => el.status === false && el.role === 'user'
      ).length;

      //counting total admin
      this.totalAdmin = res.filter(
        (el: UserList) => el.role === 'admin'
      ).length;

      //counting users
      this.totalUsers = res.filter((el: UserList) => el.role === 'user').length;

      //total active admins
      this.totalActiveAdmin = res.filter(
        (el: UserList) => el.status === true && el.role === 'admin'
      ).length;

      //total Non active admin
      this.totalInActiveAdmin = res.filter(
        (el: UserList) => el.status === false && el.role === 'admin'
      ).length;

      // -------------------------------------------------------------------------------------

      this.userlist = res;
      this.checkRole();
      this.dataSource = new MatTableDataSource(this.userlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = ['name', 'email', 'status'];

  usersform = this.builder.group({
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
    status: this.builder.control(false),
  });

  ngOnInit() {
    const sess = sessionStorage.getItem('expiredSession');
    if (sess) {
      const item = new Date().getTime() >= JSON.parse(sess).sessDate;
      if (item) {
        window.alert('Session Expired,Please log in again!');
        sessionStorage.clear();
        this.router.navigate(['signin']);
      }
    }
  }
  checkRole() {
    let arr: UserList[] = [];
    for (let user of this.userlist) {
      if (user.role === 'user') {
        arr.push(user);
      }
    }
    this.userlist = arr;
  }

  roleAdmin() {
    if (sessionStorage.getItem('userrole') === 'admin') {
      return false;
    } else {
      return true;
    }
  }

  getTotUser(role: string = '') {
    if (!role || role.length == 0) {
      this.router.navigate(['./user']);
    } else {
      this.router.navigate([`./user/${role}`]);
    }
  }

  getAllDeleted() {
    this.router.navigate(['/deletedusers']);
  }
}
