import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Leave from '../models/leave.model';
import { LeaveStatus } from '../models/leave-status.enum';
import ChangeLeaveStatus from '../models/changeLeaveStatus.model';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor(private http: HttpClient,private global:GlobalService) { }

  apply(leave: any): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.post(this.global.baseUrl, leave, { headers: headers });
  }
  getStat(): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + "stats", { headers: headers });
  }
  getmyLeaves(): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + "User/" + this.global.token.userId.toString(), { headers: headers });
  }
  getLeaveRequests(): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + "requests", { headers: headers });
  }
  getLeaveTypes(): Observable<any> {
    return this.http.get(this.global.baseUrl + "GetReason")
  }
  updateStatus(reqModel: ChangeLeaveStatus): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    

    return this.http.post(`${this.global.baseUrl}status/`, reqModel, { headers });
  }



}
