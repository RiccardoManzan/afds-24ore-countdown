import {
  Component,
  computed,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
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
import { CoreService } from './services/core.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly coreService: CoreService,
    public readonly auth: AuthService,
  ) {}

  public displayCountChars: string[] = ['0'];
  private readonly statusSub = this.coreService.donations.subscribe((s) => {
    const displayCount = s ? s.bloodCount * 450 + s.plasmaCount * 750 : 0;
    this.displayCountChars = displayCount.toString().split('');
    this.animateCounter(2000);
  });
  public enableDisplayCountAnimation = false;
  private displayCountAnimationTimeout: any;

  ngOnDestroy() {
    this.statusSub.unsubscribe();
  }

  animateCounter(animationTimeoutOverride:undefined|number = undefined) {
    this.enableDisplayCountAnimation = true;
    if (this.displayCountAnimationTimeout) {
      clearTimeout(this.displayCountAnimationTimeout);
    }
    setTimeout(() => {
      this.enableDisplayCountAnimation = false;
    }, animationTimeoutOverride ?? environment.counterPollingTimeout);
  }
}
