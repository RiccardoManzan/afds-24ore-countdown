import { Injectable, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Subscription, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService implements OnDestroy {
  private readonly poller?: Subscription;
  public readonly donations = new BehaviorSubject<DonationsStatus | undefined>(
    {plasmaCount: 0, bloodCount: 0},
  );
  public readonly countdown = new BehaviorSubject<CountdownStatus | undefined>(
    undefined,
  );

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {
    this.poller = timer(0, environment.counterPollingTimeout).subscribe(() => {
      firstValueFrom(
        this.http.get<Status>(`${environment.apiBasePath}/state`),
      ).then((status) => {
        if (!this.equalsByValue(status.donations, this.donations.value)) {
          this.donations.next(status.donations);
        }
        if (!this.equalsByValue(status.countdown, this.countdown.value)) {
          this.countdown.next(status.countdown);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.poller?.unsubscribe();
  }

  private equalsByValue(a: any, b: any): boolean {
    if (typeof a != typeof b) return false;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length != bKeys.length && aKeys.some((k) => !bKeys.includes(k)))
      return false;
    return aKeys.every((k) => a[k] == b[k]);
  }

  registerDonation(type: 'blood' | 'plasma') {
    this.http
      .post(
        `${environment.apiBasePath}/register-donation/${type}`,
        {},
        {
          headers: {
            Authorization: this.auth.getAuthHeader(),
          },
        },
      )
      .subscribe();

    const donations = this.donations.value;
    if (type == 'blood') donations!!.bloodCount++;
    else donations!!.plasmaCount++;
    this.donations.next(donations)
  }

  removeDonation(type: string) {
    this.http
      .post(
        `${environment.apiBasePath}/remove-donation/${type}`,
        {},
        {
          headers: {
            Authorization: this.auth.getAuthHeader(),
          },
        },
      )
      .subscribe();

    const donations = this.donations.value;
    if (type == 'blood') donations!!.bloodCount--;
    else donations!!.plasmaCount--;
    this.donations.next(donations)
  }

  stopCountdown() {
    this.http
      .post(
        `${environment.apiBasePath}/countdown/stop`,
        {},
        {
          headers: {
            Authorization: this.auth.getAuthHeader(),
          },
        },
      )
      .subscribe();
  }

  restartCountdown() {
    this.http
      .post(
        `${environment.apiBasePath}/countdown/restart`,
        {},
        {
          headers: {
            Authorization: this.auth.getAuthHeader(),
          },
        },
      )
      .subscribe();
  }

  resumeCountdown() {
    this.http
      .post(
        `${environment.apiBasePath}/countdown/resume`,
        {},
        {
          headers: {
            Authorization: this.auth.getAuthHeader(),
          },
        },
      )
      .subscribe();
  }

  endCountdown() {
    this.http
      .post(
        `${environment.apiBasePath}/countdown/end`,
        {},
        {
          headers: {
            Authorization: this.auth.getAuthHeader(),
          },
        },
      )
      .subscribe();
  }
}

type DonationsStatus = { plasmaCount: number; bloodCount: number };
type CountdownStatus = { startDate: Date; endDate: Date, mode: "manual" | "auto" };
type Status = {
  donations: DonationsStatus;
  countdown: CountdownStatus;
};
