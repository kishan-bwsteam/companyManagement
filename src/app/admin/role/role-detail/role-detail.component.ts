import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-detail',
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.css',
  providers: [MessageService] 
})
export class RoleDetailComponent {
  RoleList: any;
  UserTypeID: any=0;
  UserID:number=0;

  constructor(private messageServices: MessageService, private roleService:RoleService) {}
  ngOnInit() {
    var data = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('userDetails'))));
    console.log("Data", data);

    this.UserTypeID = data.userDetails.userTypeID;
    this.UserID=data.userDetails.userID;
    console.log("USerID",this.UserID)
    this.GetAllRoleData();
  }

  GetAllRoleData() {
    
    this.roleService.getall(Number(this.UserID)).subscribe(
      (res: any) => {
        
        console.log(res);
        
        this.RoleList = res.roleViewModel;
        if (res.status == 1) {
        }
      })
  }
  DeleteRole(roleID: number) {
    
    this.roleService.delete(roleID).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 1) {
          this.GetAllRoleData();
          this.messageServices.add({
            severity: 'success',
            summary: 'Deleted Successfully',
            detail: res.detail
          })
        }
        else {
          this.messageServices.add({
            severity: 'success',
            summary: 'error',
            detail: res.detail
          })
        }
      })
  }
}
