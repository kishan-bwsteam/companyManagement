import { Component, makeStateKey } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-support-ticket-info',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './support-ticket-info.component.html',
  styleUrl: './support-ticket-info.component.css',
  providers: [MessageService]
})
export class SupportTicketInfoComponent {
  TicketTypeList: any[] = [];
  SupportTicketList: any[] = [];
  SupportTicketID: number = 0;
  uploadedFiles: any[] = [];
  TicketID: number = 0;
  TicketGUID: string = '';
  SupportTicketForm!: FormGroup;
  SupportTicketUpdateForm!: FormGroup;
  Submitted: boolean = false;
  CreatedBy: string = '';
  uploadedFile: any[] = [];
  SupportTicketDetailId: any;
  isCloseTicket: boolean = false;

  constructor(private http: EmployeeService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    var data = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('userDetails'))));
    console.log("Data", data);
    this.CreatedBy = data.userDetails.userID;

    this.route.params.subscribe(params => {
      this.TicketGUID = params['TicketGUID'];
      this.getAllTickets();
    });

    this.SupportTicketForm = this.fb.group({
      TicketDetail: ['', Validators.required],
      TicketSubject: ['', Validators.required],
      PriorityTypeID: ['3231', Validators.required],
      TicketTypeID: [-1],
      ReplyLevel: [0]
    });

    this.SupportTicketUpdateForm = this.fb.group({
      TicketDetail: ['', Validators.required],
      TicketSubject: [''],
      PriorityTypeID: [''],
      TicketTypeID: [''],
      ReplyLevel: []
    });
  }

  getAllTickets(): void {
    this.http.GetSingleTickets(this.TicketGUID).subscribe(
      (res: any) => {
        this.SupportTicketList = res.fetchTicketList;
        this.TicketID = res.fetchTicketList[0].ticketID
        this.SupportTicketDetailId = res.fetchTicketList[0].supportTicketDetailId

        this.uploadedFiles = res.fatchTicketAttachmentList || [];
        // if (this.SupportTicketList.length > 0) {
        //   this.TicketID = this.SupportTicketList[0].ticketID;
        //   this.SupportTicketDetailId = this.SupportTicketList[0].supportTicketDetailId;

        //   const closed = localStorage.getItem(`closedTicket_${this.TicketID}`);
        //   if (closed === 'true') {
        //     this.SupportTicketList[0].ticketStatusName = 'Closed';
        //     this.SupportTicketList[0].StatusName = 'Closed';
        //   }
        // }
      },
      (err) => console.error('Error fetching ticket', err)
    );
  }

  SaveUpdateSupportTicketDetails(): void {
    debugger;
    this.Submitted = true;

    const data = this.SupportTicketUpdateForm.value;
    data.SupportTicketID = this.TicketID;
    data.Files = this.uploadedFile;

    this.http.saveOrUpdateTicket(data).subscribe(
      (res) => {
        this.uploadedFiles = [];
        this.SupportTicketForm.reset();
        this.SupportTicketUpdateForm.reset();
        this.getAllTickets();
        this.Submitted = false;
      },
      (err) => console.error('Error saving ticket', err)
    );
  }

  UpdateSupportTicketDetails() {
    const data = {
      ...this.SupportTicketUpdateForm.value,
      SupportTicketID: this.TicketID,
      CreatedBy: this.CreatedBy,
      Files: this.uploadedFile,
      TicketStatusId: this.isCloseTicket ? 3 : 2,
      SupportTicketDetailId: this.SupportTicketDetailId,
      SupportTicketGuid: this.TicketGUID,
      TicketSubject: this.SupportTicketList[0].ticketSubject,
      PriorityTypeID: this.SupportTicketList[0].priorityTypeID || this.SupportTicketForm.value.PriorityTypeID,  
      TicketTypeID: this.SupportTicketList[0]?.ticketTypeID || this.SupportTicketForm.value.TicketTypeID,
      IsComment: true,
      Message: '',                                
      ex: ''
    };

    if (this.isCloseTicket && !data.TicketDetail) {
      data.TicketDetail = "Ticket has been resolved successfully.";
    }

    this.http.replyToTicket(data).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.getAllTickets();
          this.uploadedFile = [];
          this.isCloseTicket = false;
          this.SupportTicketUpdateForm.reset();
        } else {
          console.error('Error updating ticket:', res.message);
        }
      },
      error: (err) => {
        console.error('HTTP Error updating ticket:', err);
      }
    });
  }

  onFileChange(event: any): void {
    const fileList: FileList = event.files;
    if (fileList.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        formData.append('uploadFiles', fileList[i], fileList[i].name);
      }

      this.http.TicketuploadFile(formData).subscribe(
        (res) => {
          this.uploadedFile = res;
        },
        (err) => console.error('File upload error', err)
      );
    }
  }

  Reset() {
    this.SupportTicketForm.reset();
    this.SupportTicketUpdateForm.reset();
    this.Submitted = false;
    this.isCloseTicket = false;
    this.router.navigate(['/SupportTicketDetail']);
  }

  openTab(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.click();
    }
  }

  CloseTicket() {
    Swal.fire({
      title: 'Are you sure you want to close this ticket?',
      icon: 'warning',
      showCancelButton: true
    }).then((res)=>{
      if(res.isConfirmed){
        const closeRequest = {
        TicketGuid: this.TicketGUID,
        ActionBy: this.CreatedBy
      };
      this.http.closeTicket(this.TicketGUID, this.CreatedBy).subscribe({
        next:(res)=>{
          if(res.status == 200){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket closed successfully' });
            this.getAllTickets();
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
          }
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
      })
      }
    })  
    }
  }
