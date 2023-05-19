import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DeletepopupComponent } from 'src/app/deletepopup/deletepopup.component';
import { StatuspopupComponent } from 'src/app/statuspopup/statuspopup.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  constructor(
    private http: HttpClient,
    private service: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private builder: FormBuilder
  ) {
    this.loadUser();
  }
  userlist: any;
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loadUser() {
    this.service.GetAll().subscribe((res: any) => {
      this.userlist = res;
      this.checkStatus();
      this.dataSource = new MatTableDataSource(this.userlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'action'];
  updateuser(code: any) {
    const popup = this.dialog.open(UpdatepopupComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '500ms',
      width: '50%',
      data: {
        usercode: code,
      },
    });

    popup.afterClosed().subscribe((res) => {
      this.loadUser();
    });
  }

  userform = this.builder.group({
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

  opendialog() {}

  deleteUser(code: any) {
    const deletepopup = this.dialog.open(DeletepopupComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '500ms',
      width: '50%',
      data: {
        usercode: code,
      },
    });

    deletepopup.afterClosed().subscribe((res) => {
      this.loadUser();
    });
  }

  statusUser(code: any) {
    const statuspopup = this.dialog.open(StatuspopupComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '500ms',
      width: '50%',
      data: {
        usercode: code,
      },
    });

    statuspopup.afterClosed().subscribe((res) => {
      this.loadUser();
    });
  }
  checkStatus() {
    let arr: any[] = [];
    for (let user of this.userlist) {
      if (user.status === 'true') {
        user.status = 'Active';

        arr.push(user);
      } else {
        user.status = 'Not-Active';

        arr.push(user);
      }
    }
    this.userlist = arr;
  }
}
