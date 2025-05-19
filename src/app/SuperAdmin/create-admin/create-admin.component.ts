import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { SelectModule } from 'primeng/select';
import Country from '../../models/country.model';
import State from '../../models/state.model';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { Toast, ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-admin',
  imports: [StepperModule,
    RouterLink,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    ProgressBarModule,
    ToastModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
    FormsModule,
    Toast,
    DatePickerModule,
    CommonModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
  providers: [MessageService]
})
export class CreateAdminComponent implements OnInit {
  constructor(private http: HttpClient,
    private ActiveRoute: ActivatedRoute,
    private router: Router,
    private global:GlobalService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    const id = this.ActiveRoute.snapshot.paramMap.get("id");
    console.log(id);

    this.getState();
    this.getCountry();
  }
  filteredStates: any[] = [];
  onCountryChange(countryId: number) {
    this.global.getStatesByCountryId(countryId).subscribe((res: any) => {
      this.filteredStates = res;
    }, (error) => {
      console.log(error);
    })
    // this.filteredStates[index] = this.states.filter(state => state.countryId == countryId);
    // this.addressForms[index].get('stateId')?.setValue(null);
  }

  countryList: Country[] = [];
  stateList: State[] = [];
  personalForm = new FormGroup({
    FirstName: new FormControl("", Validators.required),
    LastName: new FormControl(""),
    MiddleName: new FormControl(""),
    EmailID: new FormControl("", [Validators.email, Validators.required]),
    AddressLine1: new FormControl("", Validators.required),
    AddressLine2: new FormControl(""),
    Country: new FormControl("", Validators.required),
    City: new FormControl("", Validators.required),
    State: new FormControl("", Validators.required),
    Zipcode: new FormControl("", Validators.required),
    UserName: new FormControl("", Validators.required)
  })
  companyObjects: any[] = [];
  companyForm = new FormGroup({
  CompanyName: new FormControl("", Validators.required),
  AddressLine1: new FormControl("", Validators.required),
  AddressLine2: new FormControl(""),
  City: new FormControl("", Validators.required),
  StateId: new FormControl("", Validators.required),
  CountryId: new FormControl("", Validators.required),
  ZipCode: new FormControl("", Validators.required),
  GSTIN: new FormControl(""),
  CIN: new FormControl(""),
})

  isAllFormValid() {
    return this.companyObjects.length > 0
  }
  findState(id: any) {
    return this.stateList.find(ob => ob.stateId == id)?.stateName;
  }
  findCountry(id: any) {
    return this.countryList.find(ob => ob.countryId == id)?.countryName;
  }
  getState() {
    // this.global.getStatesByCountryId().subscribe((res: any) => {
    //   if (res.status == 200 && res.stateList.length > 0) {
    //     this.stateList = res.stateList;
    //   }
    // }, (error) => {
    //   console.log(error);
    // })
  }
  getCountry() {
    this.global.getCountries().subscribe((res: any) => {
      this.countryList = res;
    }, (error) => {
      console.log(error);
    })
  }
  deleteClick(companyName: any): void {
    var index = this.companyObjects.findIndex(ob => ob.CompanyName == companyName);
    if (index !== -1) {
      this.companyObjects.splice(index, 1);
    }
  }
  editClick(companyName: any): void {
    debugger
    var index = this.companyObjects.findIndex(ob => ob.CompanyName == companyName);
    if (index !== -1) {
      var ob = this.companyObjects.find(ob => ob.CompanyName == companyName);
      this.companyObjects.splice(index, 1);

      this.companyForm.patchValue({
        CompanyName: ob.CompanyName,
        GSTIN: ob.GSTIN,
        CIN: ob.CIN,
        AddressLine1: ob.AddressLine1,
        AddressLine2: ob.AddressLine2,
        CountryId: ob.CountryId,
        StateId: ob.StateId,
        City: ob.City,
        ZipCode: ob.ZipCode
      })
    }
  }

  addcompany() {
    if (this.companyForm.valid == false) {
      return
    }
    console.log(this.companyForm.getRawValue());

    this.companyObjects.push(this.companyForm.getRawValue());
    this.companyForm.reset();
  }

  // submit() {
  //   const franchise = this.personalForm.getRawValue();
  //   const param = {
  //     ManageFranchise: franchise,
  //     Companys: this.companyObjects
  //   }
  //   this.http.post(this.global.baseUrl + "api/admin", param).subscribe((res: any) => {

  //     if (res.status == 200) {
  //       this.messageService.add({ severity: 'success', summary: "Success", detail: res.message });
  //       this.router.navigate([""]);
  //     } else {
  //       this.messageService.add({ severity: 'error', summary: "Error", detail: res.message });
  //     }
  //   }, (error) => {
  //     this.messageService.add({ severity: 'error', summary: "Error", detail: 'Something went wrong!!' });
  //   })
  // }

  submit() {
  if (!this.personalForm.valid || this.companyObjects.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please complete all required fields and add at least one company.'
    });
    return;
  }

  const franchise = this.personalForm.getRawValue();
  const param = {
    ManageFranchise: franchise,
    Companys: this.companyObjects
  };

  const headers = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  };

  console.log("Submitting data:", param);

  this.http.post(this.global.baseUrl + "api/admin", param, headers).subscribe({
    next: (res: any) => {
      console.log("Server Response:", res);
      if (res?.status === 200 || res?.message?.toLowerCase() === 'success') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'User created successfully!'
        });
        this.router.navigate(["/"]); // Or your desired route
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.message || 'Unexpected response from server'
        });
      }
    },
    error: (error) => {
      console.error("Error from server:", error);
      this.messageService.add({
        severity: 'error',
        summary: 'Submission Failed',
        detail: error?.error?.message || 'Something went wrong. Please try again later.'
      });
    }
  });
}

}
