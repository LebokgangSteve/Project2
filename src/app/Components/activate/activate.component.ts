import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css'],
})
export class ActivateComponent {
  constructor(
    private toastr: ToastrService,
    private builder: FormBuilder,
    private service: AuthService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    this.loadDisable();
  }

  disabledSource: any;
  unactivelist: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loadDisable() {
    this.service.GetAllDisabled().subscribe((res) => {
      this.unactivelist = res;
      this.disabledSource = new MatTableDataSource(this.unactivelist);
      this.disabledSource.paginator = this.paginator;
      this.disabledSource.sort = this.sort;
    });
  }
  displayedColumns: string[] = ['name', 'email', 'role', 'action'];

  editdata: any;
  ngOnInit(): void {
    this.service.GetAllDisabled().subscribe((res) => {
      console.log('load all disabled users: ', res);
      this.unactivelist = res;
    });
    if (this.data.usercode != null && this.data.usercode != '') {
      this.service.GetByDeleted(this.data.usercode).subscribe((res) => {
        this.editdata = res;
        console.log('load disabled users: ', this.editdata);
        this.registerform.setValue({
          id: this.editdata.id,
          fullName: this.editdata.fullName,
          password: this.editdata.password,
          confirmPassword: this.editdata.confirmPassword,
          role: this.editdata.role,
        });
      });
    }
  }
  registerform = this.builder.group({
    id: this.builder.control(''),
    fullName: this.builder.control('', Validators.required),
    password: this.builder.control(''),
    confirmPassword: this.builder.control(''),
    role: this.builder.control('', Validators.required),
  });

  activateUser() {
    if (this.registerform.valid) {
      this.service
        .deleteDisabled(this.registerform.value.id)
        .subscribe((res) => {
          console.log('res-delete user: ', res);
        });
      this.service
        .activateUsers(this.registerform.value.id)
        .subscribe((res) => {
          console.log('res-activate user: ', res);
        });

      alert('User activated successfully');

      this.dialog.closeAll();
    } else {
      alert('User Already Activated');
    }
  }
}
