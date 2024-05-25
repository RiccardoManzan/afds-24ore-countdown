import {Component, computed, effect, Input, input, OnInit, signal} from '@angular/core';
import {CountdownComponent, CountdownConfig, CountdownEvent, CountdownStatus} from "ngx-countdown";
import {NgIf} from "@angular/common";
import {environment} from "../../../environments/environment";
import {moreThan24HoursDateFormatter} from "../../countdown-utils";
import {firstValueFrom, timer} from "rxjs";
import {CoreService} from "../../services/core.service";

@Component({
  selector: 'app-countdown-wrapper',
  templateUrl: './countdown-wrapper.component.html',
  styleUrl: './countdown-wrapper.component.scss'
})
export class CountdownWrapperComponent {

  countConfig = computed(() => {
    console.log(this.coreService.currentState())
    const startDate = new Date(this.coreService.currentState()?.countdown.startDate)
    const endDate = new Date(this.coreService.currentState()?.countdown.endDate)

    console.log(new Date() > startDate)
    return  {
      showCountdown : new Date() > startDate, //environment.countdownStartDate,
      startDate: startDate, //environment.countdownStartDate,
      countdownConfig: {
        stopTime: endDate.valueOf(), // environment.countdownEndDate.valueOf(),
        formatDate: moreThan24HoursDateFormatter,
      } as CountdownConfig
    }
  })

  isCountdownCompleted= signal(false)

  constructor(private readonly coreService: CoreService) {
    effect(() => this.coreService.currentState()
      ? new Date() > environment.countdownEndDate
      : false
    )
  }

  handleCountdownEvent(event: CountdownEvent) {
    if (event.status == CountdownStatus.done) {
      this.isCountdownCompleted.set(true)
    }
  }
}
