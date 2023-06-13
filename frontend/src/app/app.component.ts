import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountdownConfig,
  CountdownEvent,
  CountdownStatus,
} from 'ngx-countdown';
import { environment } from 'src/environments/environment';
import { moreThan24HoursDateFormatter } from './countdown-utils';
import { firstValueFrom, interval, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   this.isAuthenticated = params['isAuthenticated'];
    // });
  }

  isAuthenticated = sessionStorage.getItem('Authorization') != null;

  countdownConfig: CountdownConfig = {
    stopTime: environment.countdownEndDate.valueOf(),
    formatDate: moreThan24HoursDateFormatter,
  };
  showCountdown = false;
  isCountdownCompleted = new Date() > environment.countdownEndDate;
  reloader?: Subscription;
  public displayCount: number = 0;

  ngOnInit(): void {
    void (async () => {
      while (!this.showCountdown) {
        this.showCountdown = new Date() > environment.countdownStartDate;
        await new Promise((r) => setTimeout(r, 1000));
      }
    })();

    this.reloader = timer(0, environment.counterPollingTimeout).subscribe(
      () => {
        firstValueFrom(
          this.http.get<{ plasmaCount: number; bloodCount: number }>(
            `${environment.apiBasePath}/donations`
          )
        ).then((res) => {
          this.displayCount = res.bloodCount * 450 + res.plasmaCount * 750;
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.reloader?.unsubscribe();
  }

  handleCountdownEvent(event: CountdownEvent) {
    if (event.status == CountdownStatus.done) {
      this.isCountdownCompleted = true;
    }
  }

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

  registerDonation(type: 'blood' | 'plasma', element: HTMLButtonElement) {
    setTimeout(() => (window.document as any).activeElement?.blur(), 760);

    this.http
      .post(
        `${environment.apiBasePath}/register-donation/${type}`,
        {},
        {
          headers: {
            Authorization: sessionStorage.getItem('Authorization')!!,
          },
        }
      )
      .subscribe();
  }
}
