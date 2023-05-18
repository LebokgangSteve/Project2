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
  }

  userlist: any;
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  users() {
    this.service.GetAll().subscribe((res: any) => {
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
    status: this.builder.control('false'),
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
    let arr: any[] = [];
    for (let user of this.userlist) {
      if (user.role === 'user') {
        arr.push(user);
      }
    }
    this.userlist = arr;
  }
}
