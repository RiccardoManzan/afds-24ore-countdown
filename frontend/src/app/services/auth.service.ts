import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient) {
  }

  isAuthenticated = sessionStorage.getItem('Authorization') != null;

  login() {
    const username = prompt('insert username');
    const password = prompt('insert password');
    const authorizationHeader = 'Basic ' + btoa(username + ':' + password);
    sessionStorage.setItem('Authorization', authorizationHeader);

    firstValueFrom(
      this.http.get(`${environment.apiBasePath}/login`, {
        headers: { Authorization: authorizationHeader },
      })
    )
      .then((r) => (this.isAuthenticated = true))
      .catch((ex) => alert('bad credentials'));
  }

  logout() {
    sessionStorage.removeItem('Authorization');
    this.isAuthenticated = false;
  }

  getAuthHeader() {
    return sessionStorage.getItem('Authorization')!!
  }
}
