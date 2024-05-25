import {
  Component,
  computed,
  effect,
  Input,
  input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
  CountdownStatus,
} from 'ngx-countdown';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';
import { moreThan24HoursDateFormatter } from '../../countdown-utils';
import { firstValueFrom, timer } from 'rxjs';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-countdown-wrapper',
  templateUrl: './countdown-wrapper.component.html',
  styleUrl: './countdown-wrapper.component.scss',
})
export class CountdownWrapperComponent implements OnDestroy {
  showPreCountdownTimerId: number | undefined;
  showPreCountdown = false;
  preCountdownConfig = {
    leftTime: 10,
    format: 's',
  };

  showCountdown = false;
  countdownConfig: CountdownConfig = {};
  isCountdownCompleted = false;


  private readonly statusSub = this.coreService.countdown.subscribe((s) => {
    if (!s) return;

    const startDate = new Date(s.startDate);
    const endDate = new Date(s.endDate);

    this.countdownConfig = {
      stopTime: endDate.valueOf(),
      formatDate: moreThan24HoursDateFormatter,
    } as CountdownConfig;

    if (new Date() < startDate) {
      this.showCountdown = false;

      const preStartDate = startDate;
      preStartDate.setTime(startDate.getTime() - 10 * 1000);
      const now = new Date();
      if (now < preStartDate) {
        if (this.showPreCountdownTimerId) {
          console.log('clearing previously set timeout for pre-countdown');
          clearTimeout(this.showPreCountdownTimerId);
        }
        console.log('setting timeout for pre-countdown at ' + preStartDate);
        this.showPreCountdownTimerId = setTimeout(() => {
          console.log("starting pre-countdown")
          this.showPreCountdown = true;
        }, preStartDate.valueOf() - now.valueOf());
      } else {
        console.log("starting pre-countdown immediately")
        this.showPreCountdown = true;
      }
    } else {
      this.showCountdown = true;

      const now = new Date();
      this.isCountdownCompleted = now > endDate;
    }
  });

  constructor(private readonly coreService: CoreService) {}

  handlePreCountdownEvent(event: CountdownEvent) {
    if (event.status == CountdownStatus.done) {
      this.showPreCountdown = false;
      this.showCountdown = true;
    }
  }

  handleCountdownEvent(event: CountdownEvent) {
    if (event.status == CountdownStatus.done) {
      this.isCountdownCompleted = true;
    }
  }

  ngOnDestroy() {
    if(this.showPreCountdownTimerId){
      clearTimeout(this.showPreCountdownTimerId);
    }
    this.statusSub.unsubscribe();
  }
}
