import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { PositionService } from '../../services/position.service';  // Add PositionService
import { ActivatedRoute, Router } from '@angular/router'; 
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';  // For Toast messages
import { Position } from '../../models/position.model';
import { CompanyService } from '../company.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-position-upsert',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule,ToastModule],
  templateUrl: './position-upsert.component.html',
  styleUrl: './position-upsert.component.css',
  providers:[MessageService]
})

export class PositionUpsertComponent implements OnInit {
  positionForm: FormGroup;
  departments: Department[] = [];
  positionObject: Position = {
    positionID: 0,
    positionName: '',
    positionLevel: 0,
    abberivation: '',
    userID: 0,
    companyID: 0,
    departmentID: 0
  };
  
  isEditMode: boolean = false;  // Flag to check if we're editing or creating
  
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private positionService: PositionService,  // Inject PositionService
    private activatedRoute: ActivatedRoute,   // To read the route parameters
    private router: Router,
    private messageService: MessageService  // For Toast messages
  ) {
    this.positionForm = this.fb.group({
      positionName: ['', [Validators.required, Validators.maxLength(50)]],
      positionLevel: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      abberivation: ['', [Validators.required, Validators.maxLength(10)]],
      departmentID: ['', [Validators.required]]
    });
  }
  companyId:any = 0;
  positionId:any = 0;
  ngOnInit(): void {
    this.companyId = this.activatedRoute.parent?.snapshot.paramMap.get('companyId');
    this.positionId = this.activatedRoute.snapshot.paramMap.get('posId');
  
    if ((!this.companyId && parseInt(this.companyId) !> 0) || !this.positionId ) {
      this.router.navigate(['/not-found']);
    }
    this.getDepartments();
    this.checkEditMode();
  }

  // Check if we are in edit mode (based on the route parameter)
  checkEditMode(): void {
    if (this.positionId != null && parseInt(this.positionId) > 0) {
      this.isEditMode = true;
      this.positionObject.positionID = parseInt(this.positionId);
      this.getPositionDetails(this.positionId);
    }
  }

  // Fetch the position details for editing
  getPositionDetails(id: string): void {
    this.positionService.getSingle(id).subscribe((res: any) => {
      if (res.status === 200) {
        this.positionForm.setValue({
          positionName: res.pModel.positionName,
          positionLevel: res.pModel.positionLevel,
          abberivation: res.pModel.abberivation,
          departmentID: res.pModel.departmentID
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  // Fetch all departments for the dropdown
  getDepartments(): void {
    this.departmentService.getall(this.companyId).subscribe((res: any) => {
      if (res.status === 200) {
        this.departments = res.departmentModelList;
      }
    }, (error) => {
      console.log(error);
    });
  }
  onSubmit(): void {
    if (this.positionForm.valid) {
      const formValue = this.positionForm.value;
  
      const positionData: Position = {
        ...this.positionObject,
        positionName: formValue.positionName,
        positionLevel: formValue.positionLevel,
        abberivation: formValue.abberivation,
        companyID: this.companyId,
        departmentID: formValue.departmentID
      };
  
      this.positionService.upsert(positionData).subscribe((res: any) => {
        if (res.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.isEditMode ? 'Position updated successfully' : 'Position created successfully'
          });
          this.router.navigate(["company", this.companyId.toString(), 'positionTable']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong.' });
      });
    } else {
      this.positionForm.markAllAsTouched();
    }
  }
  
  // Get form controls for validation
  get f() {
    return this.positionForm.controls;
  }
}
