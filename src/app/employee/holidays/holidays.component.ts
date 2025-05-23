import { Component, OnInit } from '@angular/core';
import { Holiday } from '../../models/holiday.model';
import { HolidayService } from '../../services/holiday.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-holidays',
  imports: [CommonModule,
    TableModule,
    CalendarModule,
    ToastModule,
    DividerModule,
    FormsModule,
    TimelineModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    TagModule],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.css',
  providers: [MessageService]
})
export class HolidaysComponent implements OnInit {
  holidays: Holiday[] = [];
  loading: boolean = true;
  currentYear: number = new Date().getFullYear();
  selectedYear: number = this.currentYear;
  years: number[] = [];
  companyId: number = 0;
  upcomingHolidays: Holiday[] = [];

  calendarOptions: any;
  calendarEvents: any[] = [];
  constructor(
    private holidayService: HolidayService,
    private messageService: MessageService
  ) {
    // Generate years for dropdown (current year ± 2)
    for (let i = this.currentYear - 2; i <= this.currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    // this.companyId = this.authService.getCurrentUser()?.companyID || 0;
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.loading = true;
    this.holidayService.getMyholidays(this.selectedYear.toString()).subscribe({
      next: (holidays: Holiday[]) => {
        this.holidays = holidays;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load holidays'
        });
        this.loading = false;
      }
    });
  }

  onYearChange(): void {
    this.loadHolidays();
  }
  getStatusSeverity(date: Date): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    const status = this.getHolidayStatus(date);
    switch (status) {
      case 'past': return 'success';
      case 'upcoming': return 'warn';
      case 'today': return 'info';
      default: return undefined;
    }
  }
  isPastHoliday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  }

  isUpcomingHoliday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) > today;
  }
  getDaysUntil(date: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidayDate = new Date(date);
    holidayDate.setHours(0, 0, 0, 0);
    const diffTime = holidayDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  getHolidayStatus(holidayDate: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(holidayDate);

    if (date < today) return 'past';
    if (date.toDateString() === today.toDateString()) return 'today';
    return 'upcoming';
  }
}