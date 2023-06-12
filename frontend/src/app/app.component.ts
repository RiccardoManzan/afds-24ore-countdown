import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CountdownConfig, CountdownEvent, CountdownStatus } from 'ngx-countdown';
import { environment } from 'src/environments/environment';
import { moreThan24HoursDateFormatter } from './countdown-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.route.queryParams.subscribe((params) => {
      this.isAuthenticated = params['isAuthenticated'];
    });
  }

  isAuthenticated = false;

  countdownConfig : CountdownConfig = {
    stopTime: environment.countdownEndDate.valueOf(),
    formatDate: moreThan24HoursDateFormatter
  }
  showCountdown = false
  isCountdownCompleted = new Date() > environment.countdownEndDate

  ngOnInit(): void {
    void ( async () => {
      while(!this.showCountdown){
        this.showCountdown = new Date > environment.countdownStartDate
        await new Promise(r => setTimeout(r, 1000));
      }
    })()
  }

  handleCountdownEvent(event: CountdownEvent){
    if(event.status == CountdownStatus.done){
      this.isCountdownCompleted = true
    }
  }

  login(){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        'isAuthenticated': true
      },
      queryParamsHandling: 'merge',
    });
    this.isAuthenticated = false;
  }

  logout(){
    this.http.get(`${environment.apiBasePath}/login`).subscribe();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        'isAuthenticated': undefined
      },
      queryParamsHandling: 'merge',
    });
    this.isAuthenticated = true;
  }


  registerDonation(type: 'blood' | 'plasma', element: HTMLButtonElement) {
    setTimeout(() => (window.document as any).activeElement?.blur(), 760);
    this.http.post(`${environment.apiBasePath}/register-donation/${type}`, {}).subscribe();
  }

}


//TODO: https://stackoverflow.com/questions/38854424/angular-http-auth-not-getting-browser-login-prompt
