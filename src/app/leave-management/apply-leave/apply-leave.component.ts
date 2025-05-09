import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import LeaveType from '../../models/leaveType';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Leave from '../../models/leave.model';
import Swal from 'sweetalert2';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule,
    DividerModule,
    RadioButtonModule,
    ReactiveFormsModule,
    ChartModule,],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css',
  providers: [DatePipe]

})
export class ApplyLeaveComponent implements OnInit{
  
  errors: any = {
    leaveType: "",
    duration: "",
    date: "",
    halfTimePeriod: "",
    shortTimePeriod: ""
  }
  minDate: Date;
  maxDate: Date;
  constructor(private leaveService: LeaveService,private global:GlobalService,
    private datePipe: DatePipe
  ) {
    this.formChangeListener = this.leaveForm.valueChanges.subscribe(val => {
      this.validateform(val);
    });

    
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
  }
  ngOnInit() {
    this.getLeaveTypes();
    this.getStats();

    this.calculatVals();

    const leaveLabels = this.leaveTypes.map((leave: any) => leave.name);
    const barColors = ['#FF5733', '#33FF57', '#3357FF'];
    this.basicData = {
      labels: leaveLabels,
      datasets: [
        {
          label: "Leaves",
          data: [15, 5, 10],
          backgroundColor: barColors,
          borderColor: '#ffffff',
          borderWidth: 1
        }
      ]
    };
  }


  formChangeListener: Subscription;

  leaveType: any = []

  leaveTypes: LeaveType[] = [];

  selectedHalfLeave: any = "firstHalf";

  leaveStats: any[] | undefined;
  durationTypes: any = [
    { "id": 1, "type": "Short Leave" },
    { "id": 2, "type": "Half Leave" },
    { "id": 3, "type": "Full Leave" }
  ];
  selectedDuration = this.durationTypes[0];


get durationTypeId() {
    return this.leaveForm.get('durationTypeId')?.value;
  }
  getStats() {
    this.leaveService.getStat().subscribe((res: any[]) => {
      this.leaveType = res;
      this.pieData = [];
      this.pieOptions = [];
      res.forEach(ob => {
        this.pieData?.push(
          {
            labels: ['Used ' + ob.used.toString(), 'Available ' + (ob.totalPerYear - ob.used).toString()],
            datasets: [
              {
                data: [ob.used, ob.totalPerYear - ob.used],
                backgroundColor: ['Gray', '#FF6384']
              }
            ]
          }
        );
        this.pieOptions?.push(
          {
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem: any) => {
                    return tooltipItem.raw + ' Leaves';
                  }
                }
              }
            }
          }
        );

      })
    }, (error) => {
      console.log(error);
    });

  }
  getLeaveTypes() {
    this.leaveService.getLeaveTypes().subscribe((res: any) => {
      if (res.status == 200){
        this.leaveTypes = res.reasonlist;
      }
    }, (error) => {
      console.log(error);

    })
  }


  pieData: any[] = [];
  pieOptions: any[] = [];

  basicData: any;
  basicOptions = {
    responsive: true,
    scales: {
      x: {
        min: 0,
        man: 0,
        title: {
          display: true,
          text: 'Leaves',
          font: {
            size: 14
          }
        }
      },
      y: {
        min: 0,
        man: 0,
        title: {
          display: true,
          text: 'Available',
          font: {
            size: 15
          }
        },
        beginAtZero: true
      }
    }
  };





  leaveForm = new FormGroup({
    leaveTypeId: new FormControl(0),
    durationTypeId: new FormControl(1),
    halfParition: new FormControl(1),
    fromDate: new FormControl(""),
    toDate: new FormControl(""),
    fromTime: new FormControl(""),
    toTime: new FormControl(""),
    attachment: new FormControl(""),
    reason: new FormControl(""),
  });
  attachmentForm = new FormGroup({
    file: new FormControl(null)
  });
  onFileChange(event: any) {
    this.isUploaded = "No Attachment Uploaded";
    const file = event.target.files[0];
    if (file) {
      this.attachmentForm.patchValue({
        file: file
      });
    }
  }
  isUploaded = "No Attachment Uploaded"
  uploadFile() {
    const file = this.attachmentForm.get("file")?.value;
    
    if (!file) {
      console.error('No file selected');
      return; // Optional: Show an error message to the user
    }

    const formData = new FormData();
    formData.append('file', file);  // appending the file to FormData

    this.global.uploadFile(formData).subscribe(
      (res: any) => {
        if (res.fileName.length > 0){
          this.leaveForm.patchValue({
            attachment:res.fileName
          })
          this.isUploaded = "Attachment Uploaded"
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }
  handleSubmit() {
    let Lfrom: Date | undefined = this.leaveForm.controls["fromDate"].value ? new Date(this.leaveForm.controls["fromDate"].value) : undefined;
    let Lto: Date | undefined = this.leaveForm.controls["toDate"].value ? new Date(this.leaveForm.controls["toDate"].value) : undefined;

    let leaveTypeId = this.leaveForm.controls["leaveTypeId"].value;
    let reason = this.leaveForm.controls["reason"].value;
    if (Lfrom != undefined && Lto != undefined && leaveTypeId != undefined) {
      let Lfromtime = this.leaveForm.controls["fromTime"].value;
      let Ltotime = this.leaveForm.controls["toTime"].value;


      let h = parseInt(Lfromtime ? Lfromtime.split(":")[0].toString() : "0");
      let m = parseInt(Lfromtime ? Lfromtime.split(":")[1].toString() : "0");
      Lfrom?.setHours(h, m, 0, 0);
      h = parseInt(Ltotime ? Ltotime.split(":")[0].toString() : "0");
      m = parseInt(Ltotime ? Ltotime.split(":")[1].toString() : "0");
      Lto?.setHours(h, m, 0, 0);

      // let leave: Leave = {
      //   reason: reason ? reason : "",
      //   leaveTypeId: leaveTypeId,
      //   leaveFrom: Lfrom,
      //   leaveTo: Lto,
      //   id: 0
      // }
      let leave = {
        LeaveRequestID: 0,
        StatusName: '',
        ReasonName: '',
        AttachmentName: this.leaveForm.get("attachment") != null? this.leaveForm.get("attachment")?.value: "",
        LeavePersonName: '',
        FromDate: Lfrom,
        ToDate: Lto,
        UserID: this.global.token.userId,
        IsDeleted: 0,
        LeaveStatusID: 0,
        LeaveReasonId: leaveTypeId,
        LeaveRequestAttachmentID: 0,
      }
      console.log(this.global.token);
      
      this.leaveService.apply(leave).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            title: "Success",
            text: res.message,
            icon: "success"
          });
          this.resetForm();
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
    } else {
      Swal.fire({
        title: "Error",
        text: "Invalid",
        icon: "error"
      });
    }
  }
  resetForm() {
    this.leaveForm.controls["leaveTypeId"].enable();
    this.leaveForm.controls["durationTypeId"].disable();
    this.leaveForm.controls["halfParition"].disable();
    this.leaveForm.controls["fromDate"].disable();
    this.leaveForm.controls["toDate"].disable();
    this.leaveForm.controls["fromTime"].disable();
    this.leaveForm.controls['toTime'].disable();

    let currDate = new Date();

    this.leaveForm.patchValue({
      leaveTypeId: 0,
      durationTypeId: 1,
      halfParition: 1,
      fromDate: this.datePipe.transform(currDate.toString(), 'yyyy-MM-dd') || '',
      toDate: this.datePipe.transform(currDate.toString(), 'yyyy-MM-dd') || '',
      fromTime: this.datePipe.transform(currDate.toString(), 'HH:mm') || '',
      toTime: this.datePipe.transform(currDate.toString(), 'HH:mm') || ''
    });
  };
  onDateChange(date: any) {
    if (Array.isArray(date) && date.length > 1) {

      if (date[1] == null) {
        let toDate: Date = new Date(date[0].toString());
        toDate.setDate(toDate.getDate() + 1);

        this.leaveForm.patchValue({
          fromDate: this.datePipe.transform(date[0].toString(), 'yyyy-MM-dd') || '',
          toDate: this.datePipe.transform(toDate.toString(), 'yyyy-MM-dd') || '',
          fromTime: this.datePipe.transform(date[0].toString(), 'HH:mm') || '',
          toTime: this.datePipe.transform(toDate.toString(), 'HH:mm') || ''
        })
      } else {
        let toDate: Date = new Date(date[1].toString());
        toDate.setDate(toDate.getDate() + 1);

        this.leaveForm.patchValue({
          fromDate: this.datePipe.transform(date[0].toString(), 'yyyy-MM-dd') || '',
          toDate: this.datePipe.transform(toDate.toString(), 'yyyy-MM-dd') || '',
          fromTime: this.datePipe.transform(date[0].toString(), 'HH:mm') || '',
          toTime: this.datePipe.transform(toDate.toString(), 'HH:mm') || ''
        })
      }
    } else {
      let fromDate: Date = new Date(date);
      let toDate: Date = new Date(date);
      if (this.selectedDuration.id == 1) {
        toDate.setHours(toDate.getHours() + 2);

      } else {
        if (this.selectedHalfLeave == "secondHalf") {
          fromDate.setHours(15);
          fromDate.setMinutes(0);
          fromDate.setSeconds(0);
          toDate.setHours(19);
          toDate.setMinutes(0);
          toDate.setSeconds(0);
        } else {
          fromDate.setHours(9);
          fromDate.setMinutes(0);
          fromDate.setSeconds(0);
          toDate.setHours(14);
          toDate.setMinutes(0);
          toDate.setSeconds(0);
        }
      }


      this.leaveForm.patchValue({
        fromDate: this.datePipe.transform(date.toString(), 'yyyy-MM-dd') || '',
        toDate: this.datePipe.transform(date.toString(), 'yyyy-MM-dd') || '',
        fromTime: this.datePipe.transform(fromDate.toString(), 'HH:mm') || '',
        toTime: this.datePipe.transform(toDate.toString(), 'HH:mm') || ''
      })
    }
  }

  validateform(vals: any) {
    // debugger
    this.formChangeListener.unsubscribe();
    const durationId = this.leaveForm.controls["durationTypeId"].value;
    if (vals.leaveTypeId == 0) {
      this.leaveForm.controls["durationTypeId"].disable();
      this.leaveForm.controls["fromDate"].disable();
      this.leaveForm.controls["toDate"].disable();
      this.leaveForm.controls["fromTime"].disable();
      this.leaveForm.controls["toTime"].disable();
      this.leaveForm.controls["reason"].disable();
    } else {
      this.leaveForm.controls["durationTypeId"].enable();
      this.leaveForm.controls["reason"].enable();
      this.leaveForm.controls["halfParition"].disable();


      let fTime: Date, tTime: Date;

      if (durationId == 1) {
        this.leaveForm.controls["fromDate"].enable();
        this.leaveForm.controls["toDate"].disable();
        this.leaveForm.controls["fromTime"].enable();
        this.leaveForm.controls["toTime"].disable();
      } else if (durationId == 2) {
        this.leaveForm.controls["halfParition"].enable();

        this.leaveForm.controls["fromDate"].enable();
        this.leaveForm.controls["toDate"].disable();
        this.leaveForm.controls["fromTime"].disable();
        this.leaveForm.controls["toTime"].disable();
      } else if (durationId == 3) {
        this.leaveForm.controls["fromDate"].enable();
        this.leaveForm.controls["toDate"].enable();
        this.leaveForm.controls["fromTime"].disable();
        this.leaveForm.controls["toTime"].disable();
      } else {
        this.leaveForm.controls["durationTypeId"].disable();
        this.leaveForm.controls["fromDate"].disable();
        this.leaveForm.controls["toDate"].disable();
        this.leaveForm.controls["fromTime"].disable();
        this.leaveForm.controls["toTime"].disable();
        this.leaveForm.controls["reason"].disable();
      };
    };

    this.calculatVals();
    this.formChangeListener = this.leaveForm.valueChanges.subscribe(val => {
      this.validateform(val);
    })
  };
  calculatVals() {
    let vals = this.leaveForm.value;
    let fDate: Date = new Date(vals.fromDate ? vals.fromDate.toString() : new Date());
    let tDate: Date = new Date(vals.toDate ? vals.toDate.toString() : new Date());


    if (vals.fromTime?.length == 0) {
      fDate.setHours(0, 0, 0, 0);
    } else {
      let h = parseInt(vals.fromTime ? vals.fromTime.split(":")[0].toString() : "0");
      let m = parseInt(vals.fromTime ? vals.fromTime.split(":")[1].toString() : "0");
      fDate.setHours(h, m, 0, 0);
    }
    if (vals.toTime?.length == 0) {
      tDate.setHours(0, 0, 0, 0);
    } else {
      let h = parseInt(vals.toTime ? vals.toTime.split(":")[0].toString() : "0");
      let m = parseInt(vals.toTime ? vals.toTime.split(":")[1].toString() : "0");
      tDate.setHours(h, m, 0, 0);
    }

    if (vals.durationTypeId == 1) {
      tDate = new Date(fDate);
      tDate.setHours(fDate.getHours() + 2, fDate.getMinutes(), fDate.getSeconds(), fDate.getMilliseconds());
    } else if (vals.durationTypeId == 2) {
      tDate = new Date(fDate);

      if (vals.halfParition == 1) {
        fDate.setHours(9, 0, 0, 0);
        tDate.setHours(14, 0, 0, 0);

      } else if (vals.halfParition == 2) {
        fDate.setHours(15, 0, 0, 0);
        tDate.setHours(19, 0, 0, 0);
      }
    } else if (vals.durationTypeId == 3) {
      if (tDate <= fDate) {
        tDate = new Date(fDate);
        tDate.setDate(tDate.getDate() + 1);
      }
      fDate.setHours(0, 0, 0, 0);
      tDate.setHours(0, 0, 0, 0);
    }

    this.leaveForm.patchValue({
      fromDate: this.datePipe.transform(fDate.toString(), 'yyyy-MM-dd') || '',
      toDate: this.datePipe.transform(tDate.toString(), 'yyyy-MM-dd') || '',
      fromTime: this.datePipe.transform(fDate.toString(), 'HH:mm') || '',
      toTime: this.datePipe.transform(tDate.toString(), 'HH:mm') || ''
    })
  }
}
