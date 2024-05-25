import {Component, computed, OnDestroy, OnInit, TemplateRef} from '@angular/core';
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
import {CoreService} from "./services/core.service";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly coreService: CoreService,
    public readonly auth: AuthService
  ) {  }

  public displayCount = computed(
    () => this.coreService.currentState()?.displayCount ?? 0
  )

}
