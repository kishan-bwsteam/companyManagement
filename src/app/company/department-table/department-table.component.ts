
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DepartmentService } from '../../services/department.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-department-table',
  imports: [TableModule, RouterLink,ConfirmDialogModule, ToastModule],
  templateUrl: './department-table.component.html',
  styleUrl: './department-table.component.css',
  providers: [ConfirmationService, MessageService]
})
export class DepartmentTableComponent implements OnInit {

  depList: any[] = [];
  constructor(
    private departmentService: DepartmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute, private router: Router) {

  }
  companyId:any = 0;
  ngOnInit(): void {
    this.companyId = this.activatedRoute.parent?.snapshot.paramMap.get('companyId');
    if (!this.companyId && parseInt(this.companyId) !> 0 ) {
      this.router.navigate(['/not-found']);
    }
    this.getdeplist();
  }

  getdeplist() {
    this.departmentService.getall(this.companyId).subscribe((res: any) => {
      if (res.status == 200) {
        this.depList = res.departmentModelList
      }
    }, (error) => {
      console.log(error);

    })
  }






  confirmDelete(departmentId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this department?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDepartment(departmentId);
      }
    });
  }

  deleteDepartment(departmentId: number): void {
    this.departmentService.delete(departmentId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department deleted successfully' });
          this.depList = this.depList.filter(dep => dep.departmentId !== departmentId);
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
