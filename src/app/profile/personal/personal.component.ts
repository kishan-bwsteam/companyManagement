import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Employee from '../../models/employee.model';
import { CommonModule, DatePipe, } from '@angular/common';
import Bank from '../../models/bank.model';
import Address from '../../models/address.model';
import State from '../../models/state.model';
import Country from '../../models/country.model';

@Component({
  selector: 'app-personal',
  imports: [DatePipe, CommonModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.getDetails();
    this.getAddress();
    this.getBankDetails();
    this.getState();
    this.getCountry();
  }
  state: State[] = []
  country: Country[] = []
  address: Address = {
    userID: 0,
    addressline1: '',
    addressline2: '',
    city: '',
    addressTypeID: 3,
    zipCode: '',
    stateId: 0,
    countryId: 0
  }
  bankDetails: Bank = {
    bankDetailID: 0,
    userID: 0,
    bankName: '',
    accountNo: '',
    ifscCode: ''
  };
  empDetails: Employee = {
    empID: 0,
    employeeStatusID: 0,
    companyID: 0,
    userGuid: '',
    password: '',
    departmentID: 10015,
    roleID: 0,
    primaryPhoneNo: '',
    secondaryPhoneNo: '',
    isActive: false,
    empCode: 0,
    bloodGroup: '',
    userTypeId: 0,
    firstName: '',
    lastName: '',
    middleName: '',
    userID: 0,
    userName: '',
    emailID: ''
  }
  getDetails() {
    this.http.get("https://localhost:44363/api/EmpPersonalDetail/User/3").subscribe((res: any) => {
      if (res.status == 200 && res.singleModelList.length > 0) {
        this.empDetails = res.singleModelList[0];
      }

    }, (error) => {
      console.log(error);
    })
  }
  getAddress() {
    this.http.get("https://localhost:44363/api/EmpAddress/User/3").subscribe((res: any) => {
      if (res.status == 200 && res.singleModelList != undefined) {
        this.address = res.singleModelList;
      }
    }, (error) => {
      console.log(error);
    })
  }
  getBankDetails() {
    this.http.get("https://localhost:44363/api/bank").subscribe((res: any) => {
      if (res.status == 200 && res.banklist.length > 0) {
        this.bankDetails = res.banklist.find((ob: Bank) => ob.userID == 3);
      }
    }, (error) => {
      console.log(error);
    })
  }
  getFormatedAddress() {
    console.log(this.state.find((ob:State)=>ob.stateId == this.address.stateId)?.stateName);
    
    return this.address.addressline1 + ", " + 
    this.address.addressline2 + ", " + 
    this.address.city + ", " + 
    this.state.find((ob:State)=>ob.stateId == this.address.stateId)?.stateName + ", " +
    this.country.find((ob:Country)=>ob.countryId == this.address.countryId)?.countryName + ", " + this.address.zipCode;
  }
  getState() {
    this.http.get("https://localhost:44363/api/EmpAddress/State").subscribe((res: any) => {
      if (res.status == 200 && res.stateList.length > 0) {
        this.state = res.stateList;
      }
    }, (error) => {
      console.log(error);
    })
  }
  getCountry() {
    this.http.get("https://localhost:44363/api/EmpAddress/Country").subscribe((res: any) => {
      if (res.status == 200 && res.countryList.length > 0) {
        this.country = res.countryList;
      }
    }, (error) => {
      console.log(error);
    })
  }
}
