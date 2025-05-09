import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { GlobalService } from '../../services/global.service';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../company/company.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-company-table',
  imports: [TableModule, RouterLink,ConfirmDialogModule, ToastModule],
  templateUrl: './company-table.component.html',
  styleUrl: './company-table.component.css',
  providers: [MessageService, ConfirmationService]
})
export class CompanyTableComponent implements OnInit {
  constructor(private http: HttpClient,
    private global: GlobalService,
    private companyService: CompanyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {

  }
  ngOnInit(): void {
    this.getcompanylist();
  }
  companyList: any[] = [];
  selectedCompany = {};

  getcompanylist() {
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    this.companyService.getall().subscribe((res: any) => {
      this.companyList = res;
    }, (error) => {
      console.log(error);

    })
  }





  confirmDelete(companyId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Company?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCompany(companyId);
      }
    });
  }

  deleteCompany(companyId: number): void {
    this.companyService.delete(companyId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Company deleted successfully' });
          this.companyList = this.companyList.filter(cop => cop.companyId !== companyId);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
    });
  }
}
