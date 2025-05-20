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
import { AdminUser } from '../../models/User.model';
import { Company } from '../../models/company.model';
import { AdminService } from '../../services/admin.service';

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
    DatePickerModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
  providers: [MessageService]
})
export class CreateAdminComponent implements OnInit {
  constructor(private http: HttpClient,
    private ActiveRoute: ActivatedRoute,
    private router: Router,
    private global: GlobalService,
    private adminService:AdminService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    const id = parseInt(this.ActiveRoute.snapshot.paramMap.get("id") || "0");
    if (id !== 0) {
      this.getUserDetailsById(id);
    }
    this.getCountry();
  }
  getUserDetailsById(id: number) {
    this.http.get(`${this.global.baseUrl}api/admin/${id}`).subscribe((res: any) => {
      if (res) {
        const user:AdminUser = res;
        debugger
        // Populate personalForm
        this.personalForm.patchValue({
          UserId: id,
          FirstName: user.firstName,
          LastName: user.lastName,
          MiddleName: user.middleName,
          EmailID: user.emailID || '', // If available in real API
          AddressLine1: user.addressLine1,
          AddressLine2: user.addressLine2,
          CountryId: user.countryId,
          City: user.city,
          StateId: user.stateId,
          Zipcode: user.zipCode,
          UserName: user.userName
        });
        this.onCountryChange(user.countryId);
        // Populate companyObjects from companyList
        this.companyObjects = user.companyList;

      }
    }, (error) => {
      console.log("Error fetching user", error);
    });
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
  personalForm = new FormGroup({
    UserId: new FormControl(0, Validators.required),
    FirstName: new FormControl("", Validators.required),
    LastName: new FormControl(""),
    MiddleName: new FormControl(""),
    EmailID: new FormControl("", [Validators.email, Validators.required]),
    AddressLine1: new FormControl("", Validators.required),
    AddressLine2: new FormControl(""),
    CountryId: new FormControl(0, Validators.required),
    City: new FormControl("", Validators.required),
    StateId: new FormControl(0, Validators.required),
    Zipcode: new FormControl("", Validators.required),
    UserName: new FormControl("", Validators.required)
  })
  companyObjects: Company[] = [];
  companyForm = new FormGroup({
    companyId:new FormControl(0),
    companyName: new FormControl("", Validators.required),
    addressLine1: new FormControl("", Validators.required),
    addressLine2: new FormControl(""),
    city: new FormControl("", Validators.required),
    stateId: new FormControl(0, Validators.required),
    countryId: new FormControl(0, Validators.required),
    zipCode: new FormControl("", Validators.required),
    gstin: new FormControl(""),
    cin: new FormControl(""),
  });
  isAllFormValid() {
    return this.companyObjects.length > 0
  }
  findState(id: any) {
    return this.filteredStates.find(ob => ob.stateId == id)?.stateName;
  }
  findCountry(id: any) {
    return this.countryList.find(ob => ob.countryId == id)?.countryName;
  }
  getCountry() {
    this.global.getCountries().subscribe((res: any) => {
      this.countryList = res;
    }, (error) => {
      console.log(error);
    })
  }
  deleteClick(companyName: any): void {
    var index = this.companyObjects.findIndex(ob => ob.companyName == companyName);
    if (index !== -1) {
      this.companyObjects.splice(index, 1);
    }
  }
  editClick(companyName: any): void {
    debugger
    var index = this.companyObjects.findIndex(ob => ob.companyName == companyName);
    if (index !== -1) {
      var ob = this.companyObjects.find(ob => ob.companyName == companyName);
      this.companyObjects.splice(index, 1);

      this.companyForm.patchValue({
        companyId:ob?.companyId,
        companyName: ob?.companyName,
        gstin: ob?.gstin,
        cin: ob?.cin,
        addressLine1: ob?.addressLine1,
        addressLine2: ob?.addressLine2,
        countryId: ob?.countryId,
        stateId: ob?.stateId,
        city: ob?.city,
        zipCode: ob?.zipCode
      })
    }
  }

  addcompany() {
    if (this.companyForm.valid == false) {
      return
    }
    debugger;
    const comFormOb = this.companyForm.getRawValue();
    const comOb:Company = {
      companyId: comFormOb.companyId || 0,
      companyName: comFormOb.companyName || "",
      addressLine1: comFormOb.addressLine1 || "",
      addressLine2: comFormOb.addressLine2 || "",
      city: comFormOb.city || "",
      stateId: comFormOb.stateId || 0,
      state: this.findState(comFormOb.stateId),
      countryId: comFormOb.countryId || 0,
      zipCode: comFormOb.zipCode || "",
      gstin: comFormOb.gstin || "",
      cin: comFormOb.cin || ""
    }
    this.companyObjects.push(comOb);
    this.companyForm.reset();
  }

  submit() {
    const franchise = this.personalForm.getRawValue();

    const param: AdminUser = {
      userID: franchise.UserId || 0,
      firstName: franchise.FirstName || '',
      lastName: franchise.LastName || '',
      middleName: franchise.MiddleName || '',
      userName: franchise.UserName || '',
      addressLine1: franchise.AddressLine1 || '',
      addressLine2: franchise.AddressLine2 || '',
      city: franchise.City || '',
      stateId: +(franchise.StateId || 0),
      countryId: +(franchise.CountryId || 0),
      zipCode: franchise.Zipcode || '',
      emailID: franchise.EmailID || '',
      companyList: this.companyObjects
    };

    this.adminService.upsert(param).subscribe((res: any) => {

      if (res.status == 200) {
        this.messageService.add({ severity: 'success', summary: "Success", detail: res.message });
        setTimeout(() => {
          this.router.navigate([""]);
        }, 2000);
      } else {
        this.messageService.add({ severity: 'error', summary: "Error", detail: res.message });
      }
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: 'Something went wrong!!' });
    })
  }
}
