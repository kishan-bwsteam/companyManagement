import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser'; 
import { FormsModule } from '@angular/forms';
import { provideRouter, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { GlobalService } from './services/global.service';
import { HeaderComponent } from './shared/header/header.component';
import { NavigationDrawerComponent } from './shared/navigation-drawer/navigation-drawer.component';
import { SecondIntoTimePipePipe } from './second-into-time-pipe.pipe';
import { HTTP_INTERCEPTORS, HttpClientModule, } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { HomeComponent } from './home/home.component';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [CommonModule,
    HeaderComponent,
    NavigationDrawerComponent,
    RouterOutlet,
    SliderModule,
    DrawerModule,
    ButtonModule,
    FormsModule],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppComponent {
  constructor(public global:GlobalService){
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
});