import { Component, OnInit } from '@angular/core';
import { HolidayService } from '../../services/holiday.service';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Holiday } from '../../models/holiday.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatedResult } from '../../models/paginatedResult.modal';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-holiday-table',
  standalone: true,
  imports: [CommonModule,
    TableModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    DialogModule,
    CalendarModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './holiday-table.component.html',
  styleUrls: ['./holiday-table.component.css'],
  providers: [MessageService,DatePipe]
})
export class HolidayTableComponent implements OnInit {
  holidayList: Holiday[] = [];
  totalRecords: number = 0;
  startingRow: number = 0;
  rows: number = 10;
  loading: boolean = false;
  displayDialog: boolean = false;
  selectedHoliday: Holiday | null = null;
  newHoliday: Partial<Holiday> = {};
  searchQuery: string = '';
  companyID:number = 0;
  constructor(
    private holidayService: HolidayService,
    private messageService: MessageService,
    private route:ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      if (params['companyId']) {
        this.companyID = +params["companyId"]
      }
    });
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.loading = true;
    this.holidayService.getAll(this.companyID,this.rows, this.startingRow, this.searchQuery).subscribe(
      (res: PaginatedResult<Holiday>) => {
        this.holidayList = res.data;
        this.totalRecords = res.totalRecords;
        this.loading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load holidays'
        });
        this.loading = false;
      }
    );
  }

  onPageChange(event: any): void {
    this.startingRow = event.first;
    this.rows = event.rows;
    this.loadHolidays();
  }

  search(event: any): void {
    this.searchQuery = event.target.value;
    if (this.searchQuery.length < 1) {
      this.searchQuery = '';
    }
    this.loadHolidays();
  }


  deleteHoliday(holidayId: number): void {
    this.holidayService.delete(holidayId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Holiday deleted successfully'
          });
          this.holidayList = this.holidayList.filter(h => h.holidayID !== holidayId);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message || 'Failed to delete holiday'
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong!'
        });
      }
    });
  }
}