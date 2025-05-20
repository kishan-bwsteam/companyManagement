import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { PaginatedResult } from '../../models/paginatedResult.modal';
import { AdminUser, UserBasic } from '../../models/User.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  imports: [TableModule, RouterLink, IconFieldModule, InputIconModule,ToastModule],
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css'],
  providers:[MessageService]
})
export class AdminTableComponent implements OnInit {
  adminlist: AdminUser[] = [];
  totalRecords: number = 0;
  startingRow: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(private adminService: AdminService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loading = true;
    this.adminService.getAdmins(this.rows, this.startingRow).subscribe(
      (res: PaginatedResult<AdminUser>) => {
        this.adminlist = res.data;
        this.totalRecords = res.totalRecords;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  onPageChange(event: any): void {
    this.startingRow = event.first;
    this.rows = event.rows;
    this.loadAdmins();
  }

  search(query:any){
    let val: string = query.target.value;
    if(val.length < 1){
      return;
    }
    this.adminService.getAdmins(this.rows,this.startingRow,val).subscribe(
      (res: PaginatedResult<AdminUser>)=>{
        this.adminlist = res.data;
        this.totalRecords = res.totalRecords;
      },(err)=>{
        console.log(err);  
      }
    )
  }

  deleteAdmin(Adminid:number){
    this.adminService.delete(Adminid).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Admin deleted successfully' });
          this.adminlist = this.adminlist.filter(ad => ad.userID !== Adminid);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
    })
  }
}