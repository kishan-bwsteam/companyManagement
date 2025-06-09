import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule, DatePipe, NgFor, NgStyle, Time } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { LeaveService } from '../services/leave.service';
import { TabsModule } from 'primeng/tabs';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { MyLeaveComponent } from './my-leave/my-leave.component';

@Component({
  selector: 'app-leave',
  imports: [CommonModule,
    ApplyLeaveComponent,
    MyLeaveComponent,
    TabsModule,
    ButtonModule,
    FormsModule,
    DatePickerModule,
    SelectModule,
    FormsModule,
    ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css',
  providers: [DatePipe]
})


export class LeaveComponent implements OnInit {
  constructor() {
  }
  ngOnInit(): void {    
  }
  
}
