import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../models/company.model';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../../company/company.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-company-upsert',
  imports:[ToastModule,ReactiveFormsModule,CommonModule, SelectModule ],
  templateUrl: './company-upsert.component.html',
  styleUrls: ['./company-upsert.component.css'],
  providers: [MessageService]
})
export class CompanyUpsertComponent implements OnInit {
  companyForm: FormGroup;
  companyObject: Company = {
    companyId: 0,
    loginUserID: 0,
    userID: 0,
    companyGuid: '',
    franchiseID: undefined,
    companyName: '',
    addressLine1: '',
    addressLine2: '',
    zipCode: 0,
    country: '',
    gstin: '',
    cin: '',
    stateId: 0,
    city: '',
    countryId: 0
  };
  isEditMode = false;
  stateList: any[] = [];
  countryList: any[] = [];
  
  
  constructor(
    private http:HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private global:GlobalService,
    private companyService: CompanyService,
    private messageService: MessageService
  ) {
    this.companyForm = this.fb.group({
    companyName: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['',Validators.required],
    stateId: [null, Validators.required],
    countryId: [null, Validators.required],
    zipCode: ['', [Validators.required, Validators.min(10000)]],
    gstin: ['', Validators.required],
    cin: ['', Validators.required],
  });
  
    
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id != "0") {
      this.isEditMode = true;
      this.loadCompany(+id);
    }
    this.getState();
    this.getCountry();
  }

  getState() {
    this.http.get(this.global.baseUrl + "/api/EmpAddress/State").subscribe((res: any) => {
      if (res.status == 200 && res.stateList.length > 0) {
        this.stateList = res.stateList;
      }
    }, (error) => {
      console.log(error);
    })
  }
  getCountry() {
    this.http.get(this.global.baseUrl + "/api/EmpAddress/Country").subscribe((res: any) => {
      if (res.status == 200 && res.countryList.length > 0) {
        this.countryList = res.countryList;
      }
    }, (error) => {
      console.log(error);
    })
  }
  loadCompany(id: number): void {
    this.companyService.getSingle(id).subscribe((res: any) => {
        const c = res as Company;
        this.companyObject = c;
        this.companyForm.patchValue({
          companyName: c.companyName,
          addressLine1: c.addressLine1,
          addressLine2: c.addressLine2,
          city: c.city,
          stateId: c.stateId,
          countryId: c.countryId,
          zipCode: c.zipCode,
          gstin: c.gstin,
          cin: c.cin
        });
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    const formVal = this.companyForm.value;
    const payload: Company = {
      ...this.companyObject,
      ...formVal
    };

    this.companyService.upsert(payload).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.router.navigate(['/companyTable']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    });
  }

  get f() {
    return this.companyForm.controls;
  }
}
