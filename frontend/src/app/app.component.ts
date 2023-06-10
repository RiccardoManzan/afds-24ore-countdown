import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountdownConfig, CountdownEvent, CountdownStatus } from 'ngx-countdown';
import { environment } from 'src/environments/environment.development';
import { moreThan24HoursDateFormatter } from './countdown-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private route: ActivatedRoute) {
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
    console.log(event)
    if(event.status == CountdownStatus.done){
      this.isCountdownCompleted = true
    }
  }


  registerDonation(type: 'blood' | 'plasma', element: HTMLButtonElement) {
    setTimeout(() => (window.document as any).activeElement?.blur(), 760);
  }
}
