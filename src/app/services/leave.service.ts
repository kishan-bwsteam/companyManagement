import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ChangeLeaveStatus from '../models/changeLeaveStatus.model';
import { GlobalService } from './global.service';
import { PaginatedResult } from '../models/paginatedResult.modal';
import { LeaveRequestData } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor(private http: HttpClient, private global: GlobalService) { }

  apply(leave: any): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.post(this.global.baseUrl + "api/leave/", leave, { headers: headers });
  }
  getStat(): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + "api/leave/stats", { headers: headers });
  }


  getLeavesByLeaveId(leaveId: number): Observable<PaginatedResult<LeaveRequestData>> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get<PaginatedResult<LeaveRequestData>>(this.global.baseUrl + "api/leave/" + leaveId.toString(), { headers: headers });
  }
  getLeavesByCompanyId(companyId: number, limit: number, startingRow: number, search?: string): Observable<PaginatedResult<LeaveRequestData>> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });

    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('startingRow', startingRow.toString());

     
    if (search !== undefined) {
      if(search.length > 0){
        params = params.set('search', search);
      }
    }

    return this.http.get<PaginatedResult<LeaveRequestData>>(
      `${this.global.baseUrl}api/leave/Company/${companyId}`, { headers, params }
    );
  }

  getMyLeaves(limit: number, startingRow: number, search?: string): Observable<PaginatedResult<LeaveRequestData>> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });

    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('startingRow', startingRow.toString());
    
    if (search !== undefined) {
      if(search.length > 0){
        params = params.set('search', search);
      }
    }

    return this.http.get<PaginatedResult<LeaveRequestData>>(
      `${this.global.baseUrl}api/leave/User/`, { headers, params }
    );
  }

  getLeavesByAdminId(limit: number, startingRow: number, search?: string): Observable<PaginatedResult<LeaveRequestData>> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });

    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('startingRow', startingRow.toString());

  
    if (search !== undefined) {
      if(search.length > 0){
        params = params.set('search', search);
      }
    }

    return this.http.get<PaginatedResult<LeaveRequestData>>(
      `${this.global.baseUrl}api/leave/Admin/`, { headers, params }
    );
  }


  getLeaveTypes(): Observable<any> {
    return this.http.get(this.global.baseUrl + "api/leave/GetReason")
  }
  updateStatus(reqModel: ChangeLeaveStatus): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.patch(`${this.global.baseUrl}api/leave/`, reqModel, { headers });
  }



}
