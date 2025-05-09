import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { PersonalComponent } from './personal/personal.component';
import { DocumentComponent } from './document/document.component';
import { SalaryStructureComponent } from './salary-structure/salary-structure.component';
import { PayslipComponent } from './payslip/payslip.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,
    PersonalComponent,
    DocumentComponent,
    PayslipComponent,
    SalaryStructureComponent,
    FormsModule,
    TabsModule,
    SelectModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(){
    
  }
  months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];
  years:number[] = []
  selectedMonth = "";
  selectedYear = "";
}
