import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { PaginatedResult } from '../../models/paginatedResult.modal';
import { UserBasic } from '../../models/User.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  imports: [TableModule, RouterLink, IconFieldModule, InputIconModule],
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})
export class AdminTableComponent implements OnInit {
  adminlist: any[] = [];
  totalRecords: number = 0;
  startingRow: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loading = true;
    this.adminService.getAdmins(this.rows, this.startingRow).subscribe(
      (res: PaginatedResult<UserBasic>) => {
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
      (res: PaginatedResult<UserBasic>)=>{
        this.adminlist = res.data;
        this.totalRecords = res.totalRecords;
      },(err)=>{
        console.log(err);  
      }
    )
  }
}