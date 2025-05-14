import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminUserService } from '../../services/admin-user.service';
import { GlobalService } from '../../services/global.service';
import { AddressTypeService } from '../../services/address-type.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AddressType } from '../../models/addressType.model';
import Country from '../../models/country.model';
import State from '../../models/state.model';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-user',
  imports: [FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SelectModule,
    ToastModule,
    CalendarModule,
    ButtonModule],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  providers: [MessageService]
})
export class AdminUserComponent implements OnInit {
  adminUserForm: FormGroup;
  countryList: Country[] = [];
  stateList: State[] = [];
  editMode = false;
  userID: number = 0;

  constructor(
    private fb: FormBuilder,
    private adminUserService: AdminUserService,
    private globalService: GlobalService,
    private messageService: MessageService,
    
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.adminUserForm = this.fb.group({
      userID: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      userName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      companyId: [0],
      dob: ['', Validators.required],
      address: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        stateId: [0],
        countryId: [0],
        zipCode: ['', Validators.required],
      }),
    });
  }
  companyId:any = 0;
  ngOnInit(): void {
    debugger
    this.companyId = this.route.parent?.snapshot.paramMap.get('companyId');
    if (this.companyId == null || this.companyId == undefined ){
      this.router.navigate(["not-found"]);
    }
    this.initializeForm();
    this.loadDropdowns();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.adminUserForm = this.fb.group({
      userID: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      userName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      companyId: [0],
      dob: ['', Validators.required],
      address: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        stateId: [0, Validators.required],
        countryId: [0, Validators.required],
        zipCode: ['', Validators.required]
      })
    });
  }

  loadDropdowns(): void {
    this.globalService.getCountries().subscribe(
      (countries: Country[]) => {
        debugger
        this.countryList = countries;
      },
      error => {
        console.error('Error loading countries', error);
      }
    );
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['userId']) {
        this.editMode = true;
        this.userID = +params['userId'];
        this.loadUserData(this.userID);
      }
    });
  }

  loadUserData(userId: number): void {
    this.adminUserService.getSingle(userId).subscribe(
      (data: any) => {
        this.populateForm(data);
      },
      (error) => {
        console.error('Error loading user data', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user data'
        });
      }
    );
  }

  populateForm(userData: any): void {
    this.onCountryChange(userData.address?.countryId);
    this.adminUserForm.patchValue({
      userID: userData.userID,
      firstName: userData.firstName,
      middleName: userData.middleName || '',
      lastName: userData.lastName,
      userName: userData.userName,
      emailId: userData.emailId,
      phoneNumber: userData.phoneNumber,
      companyId: userData.companyId,
      dob: this.formatDate(userData.dob)
    });

    // Patch nested address FormGroup separately
    this.adminUserForm.get('address')?.patchValue({
      addressLine1: userData.address?.addressLine1 || '',
      addressLine2: userData.address?.addressLine2 || '',
      city: userData.address?.city || '',
      stateId: userData.address?.stateId || null,
      countryId: userData.address?.countryId || null,
      zipCode: userData.address?.zipCode || ''
    });
  }


  formatDate(date: string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.adminUserForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    const formValue = this.adminUserForm.value;
    const payload = {
      ...formValue,
      userID: this.editMode ? this.userID : 0,
      phoneNumber: formValue.phoneNumber,
      zipCode: parseInt(formValue.address.zipCode, 10),
      countryId: Number(formValue.address.countryId),
      stateId: Number(formValue.address.stateId),
      companyId: Number(formValue.companyId)
    };

    if (this.editMode) {
      delete payload.password;
      delete payload.confirmPassword;
    } else {
      delete payload.confirmPassword;
    }

    this.adminUserService.upsert(payload).subscribe(
      (res: any) => {
        if (res.status === 200) {
          const message = this.editMode ? 'User updated successfully' : 'User created successfully';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message
          });
          setTimeout(()=>{
            this.router.navigate(["company",this.companyId,'adminUserTable']);
          },1000)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.detail || 'Failed to save user'
          });
        }
      },
      error => {
        console.error('Error saving user data', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Server error: ' + error.message
        });
      }
    );
  }

  onCountryChange(countryId: number): void {
    this.globalService.getStatesByCountryId(countryId).subscribe(
      (states: State[]) => {
        this.stateList = states;
      },
      error => {
        console.error('Error loading states', error);
      }
    );
  }
}
