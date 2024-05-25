import {Injectable, OnDestroy, signal} from '@angular/core';
import {firstValueFrom, Subscription, timer} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CoreService implements  OnDestroy {


  private readonly poller?: Subscription;
  public readonly currentState = signal<any|undefined>( undefined )

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {
    this.poller = timer(0, environment.counterPollingTimeout).subscribe(
      () => {
        firstValueFrom(
          this.http.get<{
            donations:{ plasmaCount: number; bloodCount: number }
            countdown: {
              startDate: Date,
              endDate: Date
            }
          }>(
            `${environment.apiBasePath}/state`
          )
        ).then((res) => {
          this.currentState.set({
            ...res,
            displayCount : res.donations.bloodCount * 450 + res.donations.plasmaCount * 750, //should be moved in the viewer component
          })
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.poller?.unsubscribe();
  }

  registerDonation(type: 'blood' | 'plasma', element: HTMLButtonElement) {
    setTimeout(() => (window.document as any).activeElement?.blur(), 760);

    this.http
      .post(
        `${environment.apiBasePath}/register-donation/${type}`,
        {},
        {
          headers: {
            Authorization: this.auth.getAuthHeader(),
          },
        }
      )
      .subscribe();
  }

}
