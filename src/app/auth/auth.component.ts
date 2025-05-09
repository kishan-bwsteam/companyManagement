import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GlobalService } from '../services/global.service';
import LoginReponse from '../models/loginResponse.model';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule],
  providers:[AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor (private authService:AuthService,private router: Router){
    
  }
  authForm:FormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  })
  auth(){
    this.authService.auth(this.authForm.value.email,this.authForm.value.password).subscribe((res:LoginReponse)=>{
      if(res.token != null){
        sessionStorage.setItem("token",res.token);
        // sessionStorage.setItem("checkin",Date.now().toString());http://localhost:4200/
        this.router.navigate(["/"]);
        // this.global.ActiveDurationInterval = setInterval(() => {
        //   this.global.ActiveDurationInSeconds += 1;
        // }, 1000);
      }
      else{
        Swal.fire({
          title: "Error",
          text: res.userDetails.message,
          icon: "error"
        });
      }
    },(error)=>{
      Swal.fire({
        title: "Error",
        text: error.error.userDetails.message,
        icon: "error"
      });
    })
  }
}
