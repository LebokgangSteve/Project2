import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DeletepopupComponent } from 'src/app/deletepopup/deletepopup.component';
import { StatuspopupComponent } from 'src/app/statuspopup/statuspopup.component';
import { UserList } from 'src/app/users.model';
import { CdkTableDataSourceInput } from '@angular/cdk/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  dataSource: any;
  constructor(
    private http: HttpClient,
    private service: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private builder: FormBuilder
  ) {}

  // The ngOnInit() is a life cycle hook managed by angular and it is called to show that
  //  angular is created a component. Actual business logic performed in this method. We
  //  need to import OnInIt to use this method. Create a project with command.

  //A collection of matrix and query URL parameters.
  //

  ngOnInit(): void {
    this.route.params.subscribe((value) => {
      this.loadUser(value['role']);
    });
  }
  userlist: UserList[] = [];
  user: UserList[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loadUser(role: string = '') {
    this.service.GetAll(role !== '' ? role : '').subscribe((res: any) => {
      this.userlist = res;
      this.checkStatus();
      this.dataSource = new MatTableDataSource(this.userlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'action'];

  updateuser(code: string) {
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
    status: this.builder.control(''),
  });

  opendialog() {}

  deleteUser(code: string) {
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

  statusUser(code: string) {
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
  status: string = '';
  checkStatus() {
    let arr: UserList[] = [];
    for (let user of this.userlist) {
      if (user.status) {
        this.status = 'Active';

        arr.push(user);
      } else {
        this.status = 'Not-Active';

        arr.push(user);
      }
    }
    this.userlist = arr;
  }
}
