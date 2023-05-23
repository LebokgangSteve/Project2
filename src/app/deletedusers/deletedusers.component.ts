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
import { HttpClient } from '@angular/common/http';
import { DeletepopupComponent } from 'src/app/deletepopup/deletepopup.component';
import { StatuspopupComponent } from 'src/app/statuspopup/statuspopup.component';
import { UserList } from '../users.model';

@Component({
  selector: 'app-deletedusers',
  templateUrl: './deletedusers.component.html',
  styleUrls: ['./deletedusers.component.css'],
})
export class DeletedusersComponent {
  constructor(
    private builder: FormBuilder,
    private router: Router,
    private service: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.goTotDeleted();
  }
  // ----------------------------------------------deleted users-----------------------
  deletedlist: UserList[] = [];
  deletedSource: any;
  totDeleted: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  goTotDeleted() {
    this.service.GetAllDeleted().subscribe((res: any) => {
      this.deletedlist = res;
      this.totDeleted = res.length;
      this.checkStatus();
      this.deletedSource = new MatTableDataSource(this.deletedlist);
      this.deletedSource.paginator = this.paginator;
      this.deletedSource.sort = this.sort;
    });
  }
  displayDeleted: string[] = ['name', 'email', 'status'];
  deletedform = this.builder.group({
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
  status: string = '';
  checkStatus() {
    let arr: UserList[] = [];
    for (let user of this.deletedlist) {
      if (user.status) {
        this.status = 'Active';

        arr.push(user);
      } else {
        this.status = 'Not-Active';

        arr.push(user);
      }
    }
    this.deletedlist = arr;
  }
}
