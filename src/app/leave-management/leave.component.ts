import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule, DatePipe, NgFor, NgStyle, Time } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { LeaveService } from '../services/leave.service';
import { StyleClass } from 'primeng/styleclass';
import { TabsModule } from 'primeng/tabs';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { MyLeaveComponent } from './my-leave/my-leave.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';

@Component({
  selector: 'app-leave',
  imports: [CommonModule,
    ApplyLeaveComponent,
    MyLeaveComponent,
    TabsModule,
    ButtonModule,
    FormsModule,
    DatePickerModule,
    SelectModule,
    FormsModule,
    ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css',
  providers: [DatePipe]
})


export class LeaveComponent implements OnInit {
  constructor(private leaveService: LeaveService, private datePipe: DatePipe) {
    
    // this.resetForm();


    // this.defaultDate = new Date();
    // this.date = this.defaultDate;
 








    


  }
  ngOnInit(): void {
    console.log("11");
    
  }
  
  
  
  

  // loadData(){
  //   this.getStats();
  //   this.getMyLeaves();
  //   this.getLeaveRequests();
  // }
  // ngOnInit(): void {
  //   this.getLeaveTypes();
  //   this.loadData();
  // }
  
  
  
  
  // disableAttr = {
  //   durationTypes: true,
  //   fromDate: true,
  //   toDate: true,
  //   fromTime: true,
  //   toTime: true,
  //   reason: true,
  // }
  // reason: string = "";
  // defaultDate: Date;
  // date: Date | [Date, Date];
  // dateSelectionMode: "single" | "multiple" | "range" = "single";
  
  
  // selectedLeaveType: any | undefined;
  // selectedShortLeave: any;


  // changeLeavetype(Ltype: any) {

  //   if (Ltype.id == 3) {
  //     this.date = [new Date(), new Date()];
  //     this.dateSelectionMode = "range";
  //   } else {
  //     this.date = new Date();
  //     this.dateSelectionMode = "single";
  //   }
  //   this.onDateChange(this.date);
  // }

  // leaveApplyWin = false;
  
  
  // changeLeaveWin(){
  //   if (this.leaveApplyWin == true){
  //     this.leaveApplyWin = false;
  //     this.getMyLeaves();
  //   }else{
  //     this.leaveApplyWin = true;
  //     this.getStats();
  //   }
  // }
  
  
}
