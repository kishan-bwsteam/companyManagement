import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  constructor(private http: HttpClient,private global:GlobalService) {
  
    }

  get(){
    return this.http.get( this.global.baseUrl + "api/User/GetUserType");
  }
}
