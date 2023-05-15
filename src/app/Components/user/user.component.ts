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
import { ActivateComponent } from '../activate/activate.component';
import { DisableComponent } from '../disable/disable.component';
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
    this.loadDisable();
  }
  userlist: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loadUser() {
    this.service.GetAll().subscribe((res) => {
      this.userlist = res;
      this.dataSource = new MatTableDataSource(this.userlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  displayedColumns: string[] = ['name', 'email', 'role', 'action'];
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

  registerform = this.builder.group({
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

  //Disabled user -------------------------------------------------------------------------------------------------------------------------------------------
  disabledlist: any;
  disabledSource: any;

  loadDisable() {
    this.service.GetAllDisabled().subscribe((res) => {
      this.disabledlist = res;
      this.disabledSource = new MatTableDataSource(this.disabledlist);
      this.disabledSource.paginator = this.paginator;
      this.disabledSource.sort = this.sort;
    });
  }
  displayedDisabled: string[] = ['name', 'email', 'role', 'action'];

  disableUser(code: any) {
    const disable = this.dialog.open(DisableComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '500ms',
      width: '50%',
      data: {
        usercode: code,
      },
    });

    disable.afterClosed().subscribe((res) => {
      this.loadUser();
    });
  }

  //Activate user----------------------------------------------------------------------------------------------------------------------------------------------
  unactiveSource: any;
  unactivelist: any;
  loadunActive() {
    this.service.GetAllDisabled().subscribe((res) => {
      this.disabledlist = res;
      this.unactiveSource = new MatTableDataSource(this.unactivelist);
      this.unactiveSource.paginator = this.paginator;
      this.unactiveSource.sort = this.sort;
    });
  }
  displayedUnactive: string[] = ['name', 'email', 'role', 'action'];
  activateUser(code: any) {
    const activate = this.dialog.open(ActivateComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '500ms',
      width: '50%',
      data: {
        usercode: code,
      },
    });

    activate.afterClosed().subscribe((res) => {
      this.loadUser();
    });
  }

  // deleted list-----------------------------------------------------------------------------------------------------------------------------------------------------
  deletedSource: any;
  deletedlist: any;
  loadDeleted() {
    this.service.GetAllDeleted().subscribe((res) => {
      this.deletedlist = res;
      this.deletedSource = new MatTableDataSource(this.deletedlist);
      this.deletedSource.paginator = this.paginator;
      this.deletedSource.sort = this.sort;
    });
  }
  displayedDeleted: string[] = ['name', 'email', 'role', 'action'];
}
