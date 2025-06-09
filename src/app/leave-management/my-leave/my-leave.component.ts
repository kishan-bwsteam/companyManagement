import {
  Component,
  OnInit
} from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import ChangeLeaveStatus from '../../models/changeLeaveStatus.model';
import { LeaveStatus } from '../../models/leave-status.enum';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import LeaveType from '../../models/leaveType';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { LeaveRequestData } from '../../models/leave.model';
import { PaginatedResult } from '../../models/paginatedResult.modal';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-my-leave',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    TableModule,
    PaginatorModule,
    FormsModule
  ],
  templateUrl: './my-leave.component.html',
  styleUrl: './my-leave.component.css',
  providers: [DatePipe]
})
export class MyLeaveComponent implements OnInit {
  leaves: LeaveRequestData[] = [];
  leaveTypes: LeaveType[] = [];
  leaveStatusEnum = LeaveStatus;
  limit: number = 10;
  startingRow: number = 0;
  totalRecords: number = 0;

  searchText: string = '';

  statusList = Object.keys(LeaveStatus).filter(key => isNaN(Number(key)));

  constructor(
    private leaveService: LeaveService,
    public global:GlobalService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getLeaveTypes();
    this.getMyLeaves();
  }

  getMyLeaves() {
    this.leaveService.getMyLeaves(this.limit, this.startingRow, this.searchText).subscribe((res: PaginatedResult<LeaveRequestData>) => {

      this.leaves = res.data;
      this.totalRecords = res.totalRecords;

    }, (error) => {
      console.log(error);
    });
  }

  onPageChange(event: any) {
    this.limit = event.rows;
    this.startingRow = event.first;
    this.getMyLeaves();
  }

  onSearchChange() {
    this.startingRow = 0; // reset to first page
    this.getMyLeaves();
  }

  cancelLeave(id: number) {
    const reqOb: ChangeLeaveStatus = {
      LeaveId: id,
      Status: LeaveStatus.Cancelled
    };
    this.leaveService.updateStatus(reqOb).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire({
          title: 'Success',
          text: res.message,
          icon: 'success'
        });
        this.getMyLeaves();
      } else {
        Swal.fire({
          title: 'Error',
          text: res.message,
          icon: 'error'
        });
      }
    }, (error) => {
      Swal.fire({
        title: 'Error',
        text: error.error.message,
        icon: 'error'
      });
    });
  }

  formatDate(date: string) {
    return this.datePipe.transform(date + "Z", 'medium', 'Asia/Kolkata');
  }

  getLeaveStatusString(val: any) {
    val = parseInt(val) - 1;
    return this.statusList[val];
  }

  getLeaveStatusSeverity(val: any) {
    if ([3, 4].includes(val)) return 'danger';
    if (val === 2) return 'success';
    return 'secondary';
  }

  getLeaveTypeName(id: any) {
    return '';
  }

  getLeaveTypes() {
    this.leaveService.getLeaveTypes().subscribe((res: any) => {
      this.leaveTypes = res;
    }, (error) => {
      console.log(error);
    });
  }

  findLeaveTypeName(id: number) {
    return '';
  }
}
