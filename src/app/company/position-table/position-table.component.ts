import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { TableModule } from 'primeng/table';
import { PositionService } from '../../services/position.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-position-table',
  imports: [TableModule,RouterLink,ConfirmDialogModule, ToastModule],
  templateUrl: './position-table.component.html',
  styleUrl: './position-table.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PositionTableComponent implements OnInit{

  posList:any[] = [];
  constructor(private positionService:PositionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  private activatedRoute:ActivatedRoute,
private router:Router){
  
  }
  companyId:any = 0;
  ngOnInit(): void {
    this.companyId = this.activatedRoute.parent?.snapshot.paramMap.get('companyId');
    if (!this.companyId && parseInt(this.companyId) !> 0 ) {
      this.router.navigate(['/not-found']);
    }
    this.getposlist();
  }
  
  getposlist(){
    this.positionService.getall(this.companyId).subscribe((res:any)=>{
      if (res.status == 200){
        this.posList = res.positionViewModel
      }
      
    },(error)=>{
      console.log(error);
      
    })
  }




  
  confirmDelete(positionId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this position?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePosition(positionId);
      }
    });
  }

  deletePosition(positionId: number): void {
    this.positionService.delete(positionId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Position deleted successfully' });
          this.posList = this.posList.filter(pos => pos.positionId !== positionId);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
    });
  }
}
