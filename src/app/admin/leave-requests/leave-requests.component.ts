import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { GlobalService } from '../../services/global.service';
import ChangeLeaveStatus from '../../models/changeLeaveStatus.model';
import { LeaveStatus } from '../../models/leave-status.enum';
import Swal from 'sweetalert2';
import { LeaveRequestData } from '../../models/leave.model';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    PaginatorModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css'],
  providers: [DatePipe]
})
export class LeaveRequestsComponent implements OnInit {
  leaveStatusEnum = LeaveStatus;
  leaves: LeaveRequestData[] = [];
  totalRecords: number = 0;
  limit: number = 10;
  startingRow: number = 0;
  searchText: string = '';
  loading: boolean = false;

  constructor(
    private leaveService: LeaveService,
    public global: GlobalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getLeaveRequests();
  }

  getLeaveRequests() {
    this.loading = true;
    this.leaveService.getLeavesByAdminId(this.limit, this.startingRow, this.searchText)
      .subscribe({
        next: (res) => {
          this.leaves = res.data;
          this.totalRecords = res.totalRecords;
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "Failed to load leave requests",
            icon: "error"
          });
          this.loading = false;
        }
      });
  }

  onPageChange(event: any) {
    this.limit = event.rows;
    this.startingRow = event.first;
    this.getLeaveRequests();
  }

  onSearchChange() {
    // Reset to first page when searching
    this.startingRow = 0;
    this.getLeaveRequests();
  }

  getLeaveStatusSeverity(statusId: number): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    switch(statusId) {
      case LeaveStatus.Pending: return 'warn';
      case LeaveStatus.Approved: return 'success';
      case LeaveStatus.Rejected: return 'danger';
      case LeaveStatus.Cancelled: return 'secondary';
      default: return 'secondary';
    }
  }

  approveRequest(leaveId: number) {
    this.updateLeaveStatus(leaveId, LeaveStatus.Approved);
  }

  rejectRequest(leaveId: number) {
    this.updateLeaveStatus(leaveId, LeaveStatus.Rejected);
  }

  private updateLeaveStatus(leaveId: number, status: LeaveStatus) {
    const reqOb: ChangeLeaveStatus = {
      LeaveId: leaveId,
      Status: status
    };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${status === LeaveStatus.Approved ? 'approve' : 'reject'} this leave request`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.leaveService.updateStatus(reqOb).subscribe({
          next: (res: any) => {
            if (res.status == 200) {
              Swal.fire({
                title: "Success",
                text: res.message,
                icon: "success"
              });
              this.getLeaveRequests();
            } else {
              Swal.fire({
                title: "Error",
                text: res.message,
                icon: "error"
              });
            }
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              title: "Error",
              text: "Failed to update leave status",
              icon: "error"
            });
          }
        });
      }
    });
  }

  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
  }
}