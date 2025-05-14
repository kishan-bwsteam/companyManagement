import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EmployeeService } from '../../../services/employee.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AdminUserService } from '../../../services/admin-user.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-admin-user-details',
  imports: [RouterModule,
    CommonModule,
    ToastModule,
    TableModule],
  templateUrl: './admin-user-details.component.html',
  styleUrl: './admin-user-details.component.css',
  providers: [MessageService]
})
export class AdminUserDetailsComponent {
  searchText = '';
  UserList: any = [];
  totalRecords: number = 0;
  startingRow: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(private Messageservice: MessageService,
    private adminUserService: AdminUserService) { }
  ngOnInit() {
    this.GetAllUserDetails()
  }

  GetAllUserDetails() {
    this.adminUserService.getall().subscribe({
      next: (res: any) => {
        this.UserList = res.data || [];
      },
      error: (err) => {
        this.Messageservice.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  onPageChange(event: any): void {
    debugger
    this.startingRow = event.first;
    this.rows = event.rows;
    this.GetAllUserDetails();
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
