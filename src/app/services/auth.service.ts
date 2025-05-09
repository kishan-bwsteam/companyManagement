import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient,private global: GlobalService) {}
  Url:string = "api/login/";

  auth(email: string, password: string): Observable<any> {
    const param = {
      UserName: email,
      Password: password
    };
    return this.http.post(this.global.baseUrl + this.Url, param);
  }
  logout():Observable<any>{
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + this.Url + "logout",{headers:headers});
  }

}
