import { Component } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './support-ticket.component.html',
  styleUrl: './support-ticket.component.css'
})
export class SupportTicketComponent {
  SupportTicketForm: FormGroup;
  CreatedBy: any;
  SupportTicketList: any = [];
  SupportTicketDetailId: any;
  sub: any;
  TicketGUID: any;
  UserTypeID: any;
  isCloseTicket: boolean = false;
  SupportTicketID: any;
  SupportTicketUpdateForm: FormGroup;
  uploadedFiles: any = [];
  update: boolean = false;
  Submitted: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.SupportTicketForm = this.fb.group({
      TicketDetail: ['', Validators.required],
      TicketSubject: ['', Validators.required],
      TicketPriorityID: [0, Validators.required],
      TicketTypeID: ['', Validators.required],
      ReplyLevel: [0],
      TicketStatusId: [1]
    });

    this.SupportTicketUpdateForm = this.fb.group({
      TicketDetail: ['', Validators.required],
      TicketStatusId: [0]
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.TicketGUID = params['TicketGUID'];
    });

    const data = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.CreatedBy = data.userDetails?.userID;
    this.UserTypeID = data.userDetails?.userTypeID;

    if (this.TicketGUID) {
      this.getAllTickets();
    }
  }

  SaveUpdateSupportTicketDetails() {
    debugger;
    this.Submitted = true;
    if (!this.SupportTicketForm.valid) {
      return;
    }

    const data = {
      ...this.SupportTicketForm.value,
      Files: this.uploadedFiles,
      TicketPriorityID: Number(this.SupportTicketForm.value.TicketPriorityID),
      CreatedBy: this.CreatedBy,
      FranchiseId: this.CreatedBy,
      SupportTicketGuid: this.TicketGUID || '',
      Message: '',
      ex: ''
    };

    this.employeeService.saveOrUpdateTicket(data).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.getAllTickets();
          this.uploadedFiles = [];
          if (!this.TicketGUID) {
            this.router.navigate(['/SupportTicketDetail']);
          }
        } else {
          console.error('Error saving ticket:', res.message);
        }
      },
      error: (err) => {
        console.error('Error saving ticket:', err);
      }
    });
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const formData: FormData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        formData.append('uploadFiles', fileList[i], fileList[i].name);
      }

      this.employeeService.TicketuploadFile(formData).subscribe({
        next: (res: any) => {
          this.uploadedFiles = res;
        },
        error: (err) => {
          console.error('Error uploading files:', err);
        }
      });
    }
  }

  CancelUpload() {
    this.uploadedFiles = [];
  }

  Reset() {
    this.router.navigate(['/SupportTicketDetail']);
  }

  getAllTickets() {
    this.employeeService.GetSingleTickets(this.TicketGUID).subscribe({
      next: (res: any) => {
        this.SupportTicketList = res;
        this.SupportTicketDetailId = this.SupportTicketList[0]?.supportTicketDetailId;
        this.SupportTicketID = this.SupportTicketList[0]?.ticketID;
      },
      error: (err) => {
        console.error('Error fetching ticket details:', err);
      }
    });
  }

  UpdateSupportTicketDetails() {
    const data = {
      ...this.SupportTicketUpdateForm.value,
      SupportTicketID: this.SupportTicketID,
      CreatedBy: this.CreatedBy,
      Files: this.uploadedFiles,
      TicketStatusId: this.isCloseTicket ? 3 : 2,
      SupportTicketDetailId: this.SupportTicketDetailId,
      FranchiseId: this.CreatedBy,
      IsComment: true,
      SupportTicketGuid: this.TicketGUID || '',  
      Message: '',                                
      ex: ''
    };

    if (this.isCloseTicket && !data.TicketDetail) {
      data.TicketDetail = "Ticket has been resolved successfully.";
    }

    this.employeeService.replyToTicket(data).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.getAllTickets();
          this.uploadedFiles = [];
          this.isCloseTicket = false;
        } else {
          console.error('Error updating ticket:', res.message);
        }
      },
      error: (err) => {
        console.error('HTTP Error updating ticket:', err);
      }
    });
  }

  CloseTicket() {
    this.isCloseTicket = true;
    this.UpdateSupportTicketDetails();
  }

  openTab(id: any) {
    console.log(id)
    console.log(document.getElementById(id));
  }
}