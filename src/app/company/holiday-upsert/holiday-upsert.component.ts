import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HolidayService } from '../../services/holiday.service';
import { MessageService } from 'primeng/api';
import { Holiday } from '../../models/holiday.model';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { Company } from '../../models/company.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-holiday-upsert',
  imports:[SelectModule,DatePickerModule,ReactiveFormsModule,ButtonModule,InputTextModule,ToastModule],
  templateUrl: './holiday-upsert.component.html',
  styleUrls: ['./holiday-upsert.component.css'],
  providers: [MessageService]
})
export class HolidayUpsertComponent implements OnInit {
  holidayForm: FormGroup;
  isEditMode = false;
  holidayId: number | null = null;
  loading = false;
  companies:Company[] = [];
  companyID:number = 0;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private global: GlobalService,
    private http: HttpClient,
    private holidayService: HolidayService,
    private messageService: MessageService
  ) {
    this.holidayForm = this.fb.group({
      holidayName: ['', Validators.required],
      holidayDate: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      if (params['companyId']) {
        this.companyID = +params["companyId"]
      }
    });
    this.route.params.subscribe(params => {
      if (params['holiId']) {
        this.holidayId = +params['holiId'];
        if (this.holidayId > 0){
          this.isEditMode = true;
          this.loadHoliday(this.holidayId);
        }
      }
    });
  }
  loadHoliday(id: number): void {
    this.loading = true;
    this.holidayService.getById(id).subscribe({
      next: (holiday: Holiday) => {
        this.holidayForm.patchValue({
          holidayName: holiday.holidayName,
          holidayDate: new Date(holiday.holidayDate),
          companyID: holiday.companyID,
        });
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load holiday data'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.holidayForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const holidayData: Holiday = {
      holidayID: this.isEditMode ? this.holidayId! : 0,
      companyID:this.companyID,
      ...this.holidayForm.value
    };

    const operation = this.isEditMode 
      ? this.holidayService.saveUpdate(holidayData) // Using 1 as userID for example
      : this.holidayService.saveUpdate(holidayData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Holiday ${this.isEditMode ? 'updated' : 'created'} successfully`
        });
        debugger
        this.router.navigate(["company",this.companyID.toString(),'holidayTable']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Operation failed'
        });
        this.loading = false;
      }
    });
  }

  markAllAsTouched(): void {
    Object.values(this.holidayForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/holidays']);
  }
}