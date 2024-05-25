import {Component, OnDestroy} from '@angular/core';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
})
export class AdminControlsComponent implements OnDestroy{
  visible: boolean = false;

  constructor(private readonly coreService: CoreService) {}
  public mode : "manual" | "auto" | undefined
  private readonly statusSub = this.coreService.countdown.subscribe((s) => {
    this.mode = s?.mode;
    console.log(s?.mode)
  });

  ngOnDestroy() {
    this.statusSub.unsubscribe();
  }

  removeDonation(type: string) {
    this.coreService.removeDonation(type)
  }

  stopCountdown() {
    this.coreService.stopCountdown()
  }

  restartCountdown() {
    this.coreService.restartCountdown()
  }

  resumeCountdown() {
    this.coreService.resumeCountdown()
  }

  endCountdown() {
    this.coreService.endCountdown()
  }
}
