import { Injectable, OnInit, SimpleChange } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import Token from '../models/token.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isAlreadyAuth = false;
  ActiveDurationInSeconds: number = 0;
  ActiveDurationInterval: any = null;
  token: Token = {
    userId: 0,
    lastName: "",
    firstName: '',
    sub: '',
    userTypeId: 0,
    TokenCreadtedAt: ''
  };
  defualtImageUrl = "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid";
  imgUrl: string = "";
  drawerVisible = false;
  baseUrl = "http://192.168.1.4:5102/";
  Roles: any[] = [];
  Departments: Department[] = [];
  constructor(private router: Router, private http: HttpClient) { 
    let checkin = sessionStorage.getItem("checkin");
    if (checkin) {
      this.ActiveDurationInSeconds = parseInt(Date.now().toString().slice(0, -3)) - parseInt(checkin.slice(0, -3));
      this.ActiveDurationInterval = setInterval(() => {
        this.ActiveDurationInSeconds += 1;
      }, 1000);
    }
  }
  getStatesByCountryId(countryId:number): Observable<any>{
    return this.http.get(this.baseUrl + "api/States/Country/" + countryId.toString())
  }
  getCountries(): Observable<any>{
    return this.http.get(this.baseUrl + "api/Country");
  }
  uploadFile(data: FormData): Observable<any> {
    return this.http.post( this.baseUrl + 'api/Common/uploadfile', data); 
  }
  getRoleName(roleId: number): string {
    const role = this.Roles.find(r => r.id === roleId);
    return role ? role.name : '--';
  }
  getDepName(depId: number): string {
    const dep = this.Departments.find(r => r.departmentId === depId);
    return dep ? dep.departmentName : '--';
  }
  decryptToken(): any {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }
    let data = atob(token.split(".")[1]);
    return JSON.parse(data);
  }
  logout() {
    sessionStorage.removeItem("token");
    this.router.navigate(["/auth"]);
    window.location.reload();

  }
  isAuthenticated(): boolean {
    if (sessionStorage.getItem("token")) {
      if (this.token.userId == 0) {
        let userInfo = this.decryptToken();
        if (userInfo == null) return false;
        let keys = Object.keys(userInfo);

        this.token.sub = userInfo[keys[0]];
        this.token.userId = parseInt(userInfo[keys[1]]);
        this.token.userTypeId = userInfo[keys[2]];
        this.token.firstName = userInfo[keys[3]];
        this.token.lastName = userInfo[keys[4]];
      }
      return true;
    }
    else {
      if (this.isAlreadyAuth == true) {
        this.isAlreadyAuth = false;
        this.logout();
      }

      return false;
    }
  }
  isSuperAdmin(): boolean {
    if (this.isAuthenticated() == true) {
      if (this.token.userTypeId == 1) {
        return true;
      }
    }
    return false;
  }
  isAdmin(): boolean {
    if (this.isAuthenticated() == true) {
      if (this.token.userTypeId == 2) {
        return true;
      }
    }
    return false;
  }
  isUser(): boolean {
    if (this.isAuthenticated() == true) {
      if (this.token.userTypeId == 3) {
        return true;
      }
    }
    return false;
  }
  isEmployee(): boolean {
    if (this.isAuthenticated() == true) {
      if (this.token.userTypeId == 4) {
        return true;
      }
    }
    return false;
  }
}
