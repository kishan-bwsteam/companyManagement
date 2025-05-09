import { Component, OnInit } from '@angular/core';
import Leave from '../../models/leave.model';
import { LeaveService } from '../../services/leave.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { GlobalService } from '../../services/global.service';
import ChangeLeaveStatus from '../../models/changeLeaveStatus.model';
import { LeaveStatus } from '../../models/leave-status.enum';
import Swal from 'sweetalert2';
import LeaveType from '../../models/leaveType';

@Component({
  selector: 'app-leave-requests',
  imports: [CommonModule,
    TableModule,

  ],
  templateUrl: './leave-requests.component.html',
  styleUrl: './leave-requests.component.css'
})
export class LeaveRequestsComponent implements OnInit {
  leaveTypes: LeaveType[] = [];

  constructor(private leaveService: LeaveService,
    public global: GlobalService,
    private datePipe:DatePipe
  ) {

  }
  ngOnInit(): void {
    this.getLeaveTypes()
    this.getLeaveRequests();
  }
  getLeaveTypes() {
    this.leaveService.getLeaveTypes().subscribe((res: any) => {
      this.leaveTypes = res;
    }, (error) => {
      console.log(error);

    })
  }
  getLeaveTypeName(id:any){
    // return this.leaveTypes.find(lt => lt.id == id)?.name
    return "";
  }
  requests: Leave[] = [];
  getLeaveRequests() {
    this.leaveService.getLeaveRequests().subscribe((res: any) => {
      this.requests = res;
    }, (error) => {
      console.log(error);

    })
  }

  rejectRequest(leaveId: any) {
    const reqOb: ChangeLeaveStatus = {
      LeaveId: leaveId,
      Status: LeaveStatus.Rejected
    };
    this.leaveService.updateStatus(reqOb).subscribe((res: any) => {
      if (res.success == true) {
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
    }, (error) => {
      console.log(error);

    })
  }
  formatDate(date:string){
    date = date + "Z";
    return this.datePipe.transform(date, 'medium', 'Asia/Kolkata');
  }
  approveRequest(leaveId: any) {
    const reqOb: ChangeLeaveStatus = {
      LeaveId: leaveId,
      Status: LeaveStatus.Approved
    };
    this.leaveService.updateStatus(reqOb).subscribe((res: any) => {
      if (res.success == true) {
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
    }, (error) => {
      console.log(error);

    })
  }
}
