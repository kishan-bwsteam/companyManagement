import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../models/department.model';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../company.service';
import { DepartmentService } from '../../services/department.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-upsert',
  imports: [ReactiveFormsModule,ToastModule,CommonModule],
  templateUrl: './department-upsert.component.html',
  styleUrls: ['./department-upsert.component.css'],
  providers: [MessageService]
})
export class DepartmentUpsertComponent implements OnInit {
  depForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    abberivation: new FormControl("", [Validators.required]),
  });
  
  depObject: Department = {
    departmentId: 0,
    departmentName: '',
    abberivation: '',
    companyID: 0,
    isMarketing: false
  };

  constructor(
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  companyId:any = 0;
  departmentId:any = 0;
  ngOnInit(): void {
    this.companyId = this.activatedRoute.parent?.snapshot.paramMap.get('companyId');
    this.departmentId = this.activatedRoute.snapshot.paramMap.get('depId');
  
    if ((!this.companyId && parseInt(this.companyId) !> 0) || !this.departmentId ) {
      this.router.navigate(['/not-found']);
    }
    this.depObject.departmentId = parseInt(this.departmentId);
    this.getDetails(this.departmentId);
  }

  getDetails(id: any) {
    this.departmentService.getSingle(id).subscribe((res: any) => {
      this.depForm.setValue({
        name: res.singleDeparmentList.departmentName,
        abberivation: res.singleDeparmentList.abberivation,
      });
    }, (error) => {
      console.error(error);
    });
  }

  submitForm() {
    if (this.depForm.invalid) {
      return; // Don't submit if form is invalid
    }

    const val = this.depForm.getRawValue();
    if (val.name == null || val.abberivation == null) return;
    this.depObject.departmentName = val.name;
    this.depObject.abberivation = val.abberivation;
    this.depObject.companyID = this.companyId;

    this.departmentService.upsert(this.depObject).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.messageService.add({ severity: 'success', summary: "Success", detail: res.message });
          this.router.navigate(["company", this.companyId.toString(), "departmentTable"]);
        } else {
          this.messageService.add({ severity: 'error', summary: "Error", detail: res.message });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: "Error", detail: 'Something went wrong!' });
      }
    );
  }

  get f() {
    return this.depForm.controls;
  }
}
