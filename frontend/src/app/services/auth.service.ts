import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient) {
    this.login()
  }

  isAuthenticated = false;
  role : "admin"|"voter"|undefined;

  promptLogin() {
    const username = prompt('insert username');
    const password = prompt('insert password');
    const authorizationHeader = 'Basic ' + btoa(username + ':' + password);
    sessionStorage.setItem('Authorization', authorizationHeader);

    this.login();
  }

  login(){
    const header = this.getAuthHeader()

    if(!header) return;
    console.log(header)
    firstValueFrom(
      this.http.get<{role:string}>(`${environment.apiBasePath}/login`, {
        headers: { Authorization: header },
      })
    )
      .then((r) => {
        this.role=r.role as "admin"|"voter"
        this.isAuthenticated = true
        console.log("switching to role " + this.role)
      })
      .catch((ex) => {
        alert('bad credentials')
        this.logout()
      });
  }

  logout() {
    sessionStorage.removeItem('Authorization');
    this.isAuthenticated = false;
  }

  getAuthHeader() {
    return sessionStorage.getItem('Authorization')!!
  }
}
