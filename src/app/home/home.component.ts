import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { SliderModule } from 'primeng/slider';
import { GlobalService } from '../services/global.service';
import { HeaderComponent } from '../shared/header/header.component';
import { NavigationDrawerComponent } from '../shared/navigation-drawer/navigation-drawer.component';
import { SecondIntoTimePipePipe } from '../second-into-time-pipe.pipe';
import { AdminTableComponent } from '../SuperAdmin/admin-table/admin-table.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule,
      RouterLink,
      SliderModule,
      DrawerModule,
      ButtonModule,
      AdminTableComponent,
      FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public global:GlobalService){

  }
}
