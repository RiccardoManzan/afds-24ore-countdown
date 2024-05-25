import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-donation-controls',
  templateUrl: './donation-controls.component.html',
  styleUrl: './donation-controls.component.scss',
})
export class DonationControlsComponent {
  @Output('submit') submitEmitter = new EventEmitter<void>();
  disabled = false;

  constructor(public readonly coreService: CoreService) {}

  registerDonation(type: 'blood' | 'plasma') {
    if (this.disabled) {
      (window.document as any).activeElement?.blur()
      return;
    }
    this.disabled = true
    setTimeout(() => (window.document as any).activeElement?.blur(), 1000);
    this.coreService.registerDonation(type);
    this.submitEmitter.emit();
    setTimeout(() => {
      this.disabled = false
    }, 1000)
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key){
      case "s":
      case "S":
        this.registerDonation('blood')
        break;
      case "p":
      case "P":
        this.registerDonation('plasma')
        break;
    }

   console.log( event.key );
  }
}
