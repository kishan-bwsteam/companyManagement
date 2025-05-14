import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { GlobalService } from '../../services/global.service';
import { EmployeeService } from '../../services/employee.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-company-employee-table',
  imports: [TableModule, RouterLink, ToastModule],
  templateUrl: './company-employee-table.component.html',
  styleUrl: './company-employee-table.component.css',
  providers: [MessageService]

})
export class CompanyEmployeeTableComponent implements OnInit {

  empList: any[] = [];
  constructor(private http: HttpClient,
    private global: GlobalService,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private messageService: MessageService) {

  }
  companyId: any = 0;
  ngOnInit(): void {
    this.companyId = this.activatedRoute.parent?.snapshot.paramMap.get('companyId');
    if (this.companyId == null) {
      return
    }
    this.companyId = parseInt(this.companyId);
    this.getemplist();
  }

  getemplist() {
    this.http.get(this.global.baseUrl + "api/EmployeeDetail/Company/" + this.companyId.toString()).subscribe((res: any) => {
      if (res.status == 200) {
        this.empList = res.employeeDetailList
      }

    }, (error) => {
      console.log(error);

    })
  }
  deleteEmp(empId: number) {
    this.empService.delete(empId).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: "Education record Deleted"
      });
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Something went wrong!!"
      });
    })
  }
}
