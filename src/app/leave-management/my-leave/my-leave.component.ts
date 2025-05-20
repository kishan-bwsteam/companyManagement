import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import Leave from '../../models/leave.model';
import ChangeLeaveStatus from '../../models/changeLeaveStatus.model';
import { LeaveStatus } from '../../models/leave-status.enum';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import LeaveType from '../../models/leaveType';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-my-leave',
  imports: [CommonModule,
    TagModule,
    TableModule,
  ],
  templateUrl: './my-leave.component.html',
  styleUrl: './my-leave.component.css',
  providers: [DatePipe]
  
})
export class MyLeaveComponent implements OnInit{
  leaves: Leave[] = [];  
  leaveTypes: LeaveType[] = [];
  
  statusList = Object.keys(LeaveStatus).filter(key => isNaN(Number(key)));
  
  constructor(private leaveService: LeaveService,
    private datePipe: DatePipe
  ) {

  }
 
  ngOnInit(): void {
    this.getLeaveTypes()
    this.getMyLeaves()
  }


  getLeaveTypeName(id:any){
    // return this.leaveTypes.find(lt => lt.id == id)?.name
    return "";
  }

  getLeaveTypes() {
    this.leaveService.getLeaveTypes().subscribe((res: any) => {
      this.leaveTypes = res;
    }, (error) => {
      console.log(error);

    })
  }
  findLeaveTypeName(id:number){
    // let lvtype = this.leaveTypes.find(lv => lv.id == id);
    // return lvtype?.name;
    return ""
  }
  getMyLeaves() {
    this.leaveService.getmyLeaves().subscribe((res: any) => {
      // this.leaves = res;
      if (res.status == 200){
        this.leaves = res.leaveViewModel;
      }
      
    }, (error) => {
      console.log(error);
    })
  }
  formatDate(date:string){
    date = date + "Z";
    return this.datePipe.transform(date, 'medium', 'Asia/Kolkata');
  }
  cancelLeave(id: number) {
    const reqOb: ChangeLeaveStatus = {
      LeaveId: id,
      Status: LeaveStatus.Cancelled
    }
    this.leaveService.updateStatus(reqOb).subscribe((res: any) => {
      if (res.success == true) {
        Swal.fire({
          title: "Success",
          text: res.message,
          icon: "success"
        });
        this.getMyLeaves();
      } else {
        Swal.fire({
          title: "Error",
          text: res.message,
          icon: "error"
        });
      }
    }, (error) => {
      Swal.fire({
        title: "Error",
        text: error.error.message,
        icon: "error"
      });
    })
  }


  getLeaveStatusString(val: any) {
    val = parseInt(val);
    val -= 1;
    return this.statusList[val]
  }
  getLeaveStatusSeverity(val: any) {
    if ([3, 4].some((v) => v == val)) {
      return "danger";
    } else if (val == 2) {
      return "success";
    }
    else {
      return "secondary";
    }
  }

}
