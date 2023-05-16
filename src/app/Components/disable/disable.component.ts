import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-disable',
  templateUrl: './disable.component.html',
  styleUrls: ['./disable.component.css'],
})
export class DisableComponent {
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
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  disabledlist: any;
  disabledSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loadDisable() {
    this.service.GetAllDisabled().subscribe((res) => {
      this.disabledlist = res;
      this.disabledSource = new MatTableDataSource(this.disabledlist);
      this.disabledSource.paginator = this.paginator;
      this.disabledSource.sort = this.sort;
    });
  }
  displayedColumns: string[] = ['name', 'email', 'role', 'action'];

  editdata: any;
  ngOnInit(): void {
    this.service.GetAllDisabled().subscribe((res) => {
      this.disabledlist = res;
      console.log('load all disabled users: ', this.disabledlist);
    });
    if (this.data.usercode != null && this.data.usercode != '') {
      this.service.GetByCode(this.data.usercode).subscribe((res) => {
        this.editdata = res;
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

  disableUser() {
    if (this.registerform.valid) {
      this.service.delete(this.registerform.value.id).subscribe((res) => {});
      this.service.disableUsers(this.registerform.value).subscribe((res) => {});

      alert('Disabled successfully');

      this.dialog.closeAll();
    } else {
      alert('User Already Disabled');
    }
  }
}
