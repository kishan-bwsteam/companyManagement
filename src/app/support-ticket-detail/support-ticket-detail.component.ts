import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EmployeeService } from '../services/employee.service';
import { Router, RouterModule } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-support-ticket-detail',
  imports: [CommonModule, TableModule, RouterModule],
  templateUrl: './support-ticket-detail.component.html',
  styleUrl: './support-ticket-detail.component.css'
})
export class SupportTicketDetailComponent {
  companyId: number = 0;
  userTypeId: number = 0;
  SupportTicketList: any[] = []
  dataAvailable: boolean = false;
  order: string = 'updatedOn';
  reverse: boolean = false;

  constructor(private employeeService: EmployeeService, private router: Router,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    if (this.globalService.isAuthenticated()) {
      this.userTypeId = this.globalService.token.userTypeId;
    }

    const companyData = JSON.parse(localStorage.getItem('SideCompanyID') || '0');
    this.companyId = Number(companyData);

    this.getAllTickets();
  }

  getAllTickets() {
    debugger;
    this.employeeService.GetAllTickets(this.userTypeId).subscribe((res: any) => {
      debugger
      this.SupportTicketList = res.fetchTicketList;
      this.dataAvailable = this.SupportTicketList.length > 0;
    });
  }

  setOrder(column: string) {
    if (this.order === column) {
      this.reverse = !this.reverse;
    } else {
      this.order = column;
      this.reverse = false;
    }
  }
}
