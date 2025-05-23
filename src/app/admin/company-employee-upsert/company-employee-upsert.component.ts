import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Modules
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { EmployeeDetail, EmployeeModel, UserAddress, UserBankDetail, UserBasic, UserEducation } from '../../models/User.model';
import { EmployeeService } from '../../services/employee.service';
import { CalendarModule } from 'primeng/calendar';
import UserType from '../../models/userType.model';
import { DepartmentService } from '../../services/department.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Department } from '../../models/department.model';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../company/company.service';
import { AddressTypeService } from '../../services/address-type.service';
import { AddressType } from '../../models/addressType.model';
import { GlobalService } from '../../services/global.service';
import Country from '../../models/country.model';
import State from '../../models/state.model';
import { EducationService } from '../../services/employee/education.service';
import { AddressService } from '../../services/employee/address.service';
import { BankdetailService } from '../../services/employee/bankdetail.service';
import { UserbasicService } from '../../services/userbasic.service';
// ngx-toastr Module

@Component({
  selector: 'app-company-employee-upsert',
  imports: [
    CalendarModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ToastModule],
  templateUrl: './company-employee-upsert.component.html',
  styleUrl: './company-employee-upsert.component.css',
  providers: [MessageService]
})
export class CompanyEmployeeUpsertComponent implements OnInit {
  activeStep = 1;
  today = new Date();
  defaultBirthDate: Date = new Date(2000, 0, 1);
  maxBirthDate = new Date();
  minHireDate = new Date(2000, 0, 1); // Adjust as needed

  userBasicForm: FormGroup;
  employeeBasicForm: FormGroup;
  userBankForm: FormGroup;
  userAddressForm: FormGroup;
  userEducationForm: FormGroup;

  states: State[] = [];

  countries: Country[] = [];
  getCountry() {
    this.global.getCountries().subscribe((res: any) => {
      this.countries = res;
    }, (error) => {
      console.log(error);
    })
  }


  employeeStatusOptions = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'On Leave' },
    { id: 3, name: 'Terminated' }
  ];

  bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  departments: Department[] = []
  getDepartments() {
    this.departmentService.getall(this.companyId).subscribe((res: any) => {
      this.departments = res.departmentModelList;
    }, (error) => {
      console.log(error);
    })
  }

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Staff' }
  ];

  companies: Company[] = [];
  getCompanies() {
    this.companyService.getall().subscribe((res: any) => {
      this.companies = res;
    }, (error) => {
      console.log(error);
    })
  }

  addressTypes: AddressType[] = [];
  getAddressTypes(): void {
    this.addressTypeService.getAllAddressTypes().subscribe(
      (data: AddressType[]) => {
        this.addressTypes = data;
      },
      error => {
        console.error('Error fetching address types', error);
      }
    );
  }
  constructor(private fb: FormBuilder,
    private addressTypeService: AddressTypeService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private router: Router,
    private global: GlobalService,
    private empUserBasicService: UserbasicService,
    private empAddressService: AddressService,
    private empEducationService: EducationService,
    private empBankDetailService: BankdetailService,
    private activateRoute: ActivatedRoute,
    private messageService: MessageService) {

    this.maxBirthDate.setFullYear(this.today.getFullYear() - 18);

    this.userBasicForm = this.fb.group({
      userID: [0, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      middleName: [''],
      userTypeID: [3, Validators.required]
    });
    // Employee Basic Form
    this.employeeBasicForm = this.fb.group({
      empId: [0, [Validators.required]],
      empCode: ['', [Validators.required]],
      dob: ['', Validators.required],
      doh: ['', Validators.required],
      departmentID: [null, Validators.required],
      employeeStatusID: [1, Validators.required], // Default to Active
      bloodGroup: ['O+'],
      roleId: [null, Validators.required],
      emailID: ['', Validators.required],
    });
    // For Bank Details
    this.userBankForm = this.fb.group({
      bankDetailID: [0, Validators.required],
      bankName: ['', Validators.required],
      ifscCode: ['', Validators.required],
      accountNo: ['', Validators.required]
    });

    // For Address
    this.userAddressForm = this.fb.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      stateId: [null],
      countryId: [null],
      zipCode: [''],
      addressTypeID: [null]
    });

    // For Education
    this.userEducationForm = this.fb.group({
      educationId:[0],
      degreeName: [''],
      instName: [''],
      passingYear: [''],
      percentage: [null]
    });
  }
  isFormValid(): boolean {
    return this.userBasicForm.valid && this.userBankForm.valid && this.userAddressForm.valid && this.userEducationForm.valid;
  }

  activateCallback(step: number): void {
    this.activeStep = step;
  }
  nextStep() {
    if (this.activeStep < 3) {
      this.activeStep++;
    }
  }

  prevStep() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  // Add these arrays to hold multiple entries
  addressForms: FormGroup[] = [];
  educationForms: FormGroup[] = [];
  filteredStates: any[] = [];

  companyId: any = 0;
  employeeId: any;
  userId: any;
  // Initialize with one empty form
  ngOnInit() {
    this.companyId = this.activateRoute.parent?.snapshot.paramMap.get('companyId');
    this.employeeId = this.activateRoute.snapshot.paramMap.get('empId');

    if ((!this.companyId && parseInt(this.companyId)! > 0) || !this.employeeId) {
      this.router.navigate(['/not-found']);
    }

    this.initializeForms();
    this.addAddress();
    this.addEducation();

    this.getDepartments();
    this.getCompanies();
    this.getAddressTypes();
    this.getCountry();


    if (this.employeeId && this.employeeId !== '0') {
      this.fetchEmployeeData(parseInt(this.employeeId));
    }
  }


  private populateForms(employee: EmployeeModel): void {
    // Populate basic forms
    if(employee.userID == undefined || employee.userID == null || employee.userID == 0){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch employee data'
      });
      return
    }
    this.userId = employee.userID;
    this.userBasicForm.patchValue({
      userID: employee.userBasic.userID,
      firstName: employee.userBasic?.firstName || '',
      lastName: employee.userBasic?.lastName || '',
      userName: employee.userBasic?.userName || '',
      middleName: employee.userBasic?.middleName || '',
      userTypeID: employee.userBasic?.userTypeID || null
    });

    this.employeeBasicForm.patchValue({
      empId:employee.empId,
      empCode: employee.empCode,
      dob: employee.dob ? new Date(employee.dob) : null,
      doh: employee.doh ? new Date(employee.doh) : null,
      departmentID: employee.departmentID,
      employeeStatusID: employee.employeeStatusID,
      bloodGroup: employee.bloodGroup,
      roleId: employee.roleId,
      emailID: employee.emailID || ''
    });

    // Populate bank form
    if (employee.userBankDetail) {
      this.userBankForm.patchValue({
        bankDetailID: employee.userBankDetail.bankDetailID,
        bankName: employee.userBankDetail.bankName,
        ifscCode: employee.userBankDetail.ifscCode,
        accountNo: employee.userBankDetail.accountNo
      });
    }
    // Clear existing address and education forms
    this.addressForms = [];
    this.educationForms = [];

    // Populate address forms
    if (employee.userAddress && employee.userAddress.length > 0) {
      employee.userAddress.forEach(address => {
        const addressForm = this.createAddressForm(address.userAddressId);
        addressForm.patchValue({
          addressId:address.userAddressId,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          stateId: address.stateId,
          countryId: address.countryId,
          zipCode: address.zipCode || '',
          addressTypeID: address.addressTypeID
        });
        this.addressForms.push(addressForm);
        this.onCountryChange( address.countryId,this.addressForms.length - 1);

        // this.filteredStates[this.addressForms.length - 1] =
        //   this.states.filter(state => state.countryId == address.countryId);
          });
    } else {
      this.addAddress(); // Add at least one empty address form
    }

    // Populate education forms
    if (employee.userEducation && employee.userEducation.length > 0) {
      employee.userEducation.forEach(education => {
        const educationForm = this.createEducationForm(education.educationId);
        educationForm.patchValue({
          educationId: education.educationId,
          degreeName: education.degreeName,
          instName: education.instName,
          passingYear: education.passingYear ? new Date(education.passingYear) : null,
          percentage: education.percentage
        });
        this.educationForms.push(educationForm);
      });
    } else {
      this.addEducation(); // Add at least one empty education form
    }
  }

  private fetchEmployeeData(employeeId: number): void {
    this.employeeService.getByEmpId(employeeId).subscribe({
      next: (employee: EmployeeModel) => {
        this.populateForms(employee);
      },
      error: (error) => {
        console.error('Error fetching employee data', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load employee data'
        });
      }
    });
  }


  initializeForms() {

  }

  // Address Form Methods
  createAddressForm(addressId: number): FormGroup {
    return this.fb.group({
      addressId:[0],
      userAddressId: [addressId],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      stateId: [null],
      countryId: [null],
      zipCode: [''],
      addressTypeID: [null]
    });
  }

  addAddress() {
    this.addressForms.push(this.createAddressForm(0));
  }

  removeAddress(index: number) {
    this.addressForms.splice(index, 1);
  }

  // Education Form Methods
  createEducationForm(educationId: number): FormGroup {
    return this.fb.group({
      educationId: [educationId],
      degreeName: [''],
      instName: [''],
      passingYear: [''],
      percentage: [null]
    });
  }

  addEducation() {
    this.educationForms.push(this.createEducationForm(0));

  }

  removeEducation(index: number) {
    this.educationForms.splice(index, 1);
  }
  // Helper methods for review step
  getCountryName(countryId: number): string {
    const country = this.countries.find(c => c.countryId === countryId);
    return country ? country.countryName : '';
  }

   getStateName(stateId: number): string {
    const state = this.states.find(s => s.stateId === stateId);
    return state ? state.stateName : '';
  }

  getAddressTypeName(typeId: number): string {
    const type = this.addressTypes.find(t => t.addressTypeID === typeId);
    return type ? type.typeName : '';
  }
  // Update country change handler to work with multiple addresses
  onCountryChange(countryId: number, index: number) {
    this.global.getStatesByCountryId(countryId).subscribe((res: any) => {
      this.filteredStates[index] = res;
    }, (error) => {
      console.log(error);
    })
    // this.filteredStates[index] = this.states.filter(state => state.countryId == countryId);
    // this.addressForms[index].get('stateId')?.setValue(null);
  }

  getFilteredStates(index: number): any[] {
    return this.filteredStates[index] || [];
  }

  // Add these helper methods to your component
  getDepartmentName(id: number): string {
    return this.departments.find(d => d.departmentId === id)?.departmentName || 'N/A';
  }

  getEmployeeStatusName(id: number): string {
    return this.employeeStatusOptions.find(s => s.id === id)?.name || 'N/A';
  }

  getRoleName(id: number): string {
    return this.roles.find(r => r.id === id)?.name || 'N/A';
  }
  // Update your submit method
  submitForm() {
    if (this.isFormValid()) {
      const employeeData: EmployeeModel = {
        empCode: this.employeeBasicForm.value.empCode, // Convert to number
        dob: this.formatDate(this.employeeBasicForm.value.dob),
        doh: this.formatDate(this.employeeBasicForm.value.doh),
        departmentID: this.employeeBasicForm.value.departmentID,
        employeeStatusID: this.employeeBasicForm.value.employeeStatusID,
        bloodGroup: this.employeeBasicForm.value.bloodGroup,
        companyId: this.companyId,
        roleId: this.employeeBasicForm.value.roleId,
        emailID: this.employeeBasicForm.value.emailID,
        userBasic: this.userBasicForm.value,
        userBankDetail: this.userBankForm.value,
        userAddress: this.addressForms.map(form => form.value),
        userEducation: this.educationForms.map(form => form.value)
      };

      this.employeeService.create(employeeData).subscribe({
        next: (response) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee created successfully'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create employee'
          });
        }
      });
    }
  }

  private formatDate(date: any): string {
    if (!date) return "";
    const jsDate = new Date(date);
    // Format as YYYY-MM-DD string
    return `${jsDate.getFullYear()}-${(jsDate.getMonth() + 1).toString().padStart(2, '0')}-${jsDate.getDate().toString().padStart(2, '0')}`;
  }
  private formatDateForDisplay(date: any): string {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  }






  public updateEducation(eduIndex: number, event: Event) {
    event.preventDefault();
    var edu: UserEducation = this.educationForms[eduIndex].getRawValue();
    edu.userID = this.userId;
    this.empEducationService.upsert(edu).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: res.message
      });
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error.message
      });
    })
  }

  public updateAddress(addrIndex: number, event: Event) {
    event.preventDefault();
    var addr: UserAddress = this.addressForms[addrIndex].getRawValue();
    addr.userID = this.userId;
    this.empAddressService.upsert(addr).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: res.message
      });
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error.message
      });
    })
  }


  public updateBankDetails(event: Event) {
    event.preventDefault();
    var bank: UserBankDetail = this.userBankForm.getRawValue();
    bank.userID = this.userId;
    this.empBankDetailService.upsert(bank).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: res.message
      });
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error.message
      });
    })
  }


  public updateUserBasicDetail(event: Event) {
    event.preventDefault();
    var usr: UserBasic = this.userBasicForm.getRawValue();
    this.empUserBasicService.upsert(usr).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: res.message
      });
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error.message
      });
    })
  }


  public updateEmployeeDetail(event: Event) {
    event.preventDefault();
    var emp: EmployeeDetail = this.employeeBasicForm.getRawValue();
    emp.userID = this.userId;
    this.employeeService.update(emp).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: res.message
      });
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error.message
      });
    })
  }


  public deleteAddr(addressId:number){
    debugger
    this.empAddressService.delete(addressId).subscribe((res:any)=>{
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: "Address record Deleted"
      });
    },(error)=>{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Something went wrong!!"
      });
    })
  }

  public deleteEdu(EduId:number){
    debugger
    this.empEducationService.delete(EduId).subscribe((res:any)=>{
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: "Education record Deleted"
      });
    },(error)=>{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Something went wrong!!"
      });
    })
  }


}