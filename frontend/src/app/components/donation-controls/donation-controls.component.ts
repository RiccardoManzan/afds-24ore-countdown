import { Component } from '@angular/core';
import {CoreService} from "../../services/core.service";

@Component({
  selector: 'app-donation-controls',
  templateUrl: './donation-controls.component.html',
  styleUrl: './donation-controls.component.scss'
})
export class DonationControlsComponent {
  constructor(public readonly coreService: CoreService) {
  }
}
