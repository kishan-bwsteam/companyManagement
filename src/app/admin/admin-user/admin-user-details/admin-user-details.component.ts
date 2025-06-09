import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EmployeeService } from '../../../services/employee.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AdminUserService } from '../../../services/admin-user.service';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-admin-user-details',
  imports: [RouterModule,
    CommonModule,
    ToastModule,
    TableModule, IconFieldModule, InputIconModule],
  templateUrl: './admin-user-details.component.html',
  styleUrl: './admin-user-details.component.css',
  providers: [MessageService]
})
export class AdminUserDetailsComponent {
  UserList: any = [];
  totalRecords: number = 0;
  startingRow: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(private Messageservice: MessageService, private adminUserService: AdminUserService) { }
  
  ngOnInit() {
    this.GetAllUserDetails()
  }

  GetAllUserDetails() {
    this.loading = true;
    this.adminUserService.getall().subscribe({
      next: (res: any) => {
        this.UserList = res.createUserAllModelList || [];
        this.totalRecords = res.totalRecords;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.Messageservice.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.startingRow = event.first;
    this.rows = event.rows;
    this.GetAllUserDetails();
  }

  search(query:any){
      let val: string = query.target.value;
      if(val.length < 1){
        return;
      }
      this.adminUserService.getall().subscribe(
        (res: any)=>{
          this.UserList = res.createUserAllModelList;
          this.totalRecords = res.totalRecords;
        },(err)=>{
          console.log(err);  
        }
      )
    }

  deleteUser(userID: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminUserService.delete(userID).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.Messageservice.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully'
            });
            this.GetAllUserDetails();
          } else {
            this.Messageservice.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message || 'Failed to delete user'
            });
          }
        },
        error: (err) => {
          this.Messageservice.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Delete request failed'
          });
        }
      });
    }
  }
}
