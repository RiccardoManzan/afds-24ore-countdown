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
    console.log('cooldown status', this.disabled)
    setTimeout(() => (window.document as any).activeElement?.blur(), 550);
    if (this.disabled) {
      console.log('skipping registration because of cooldown')
      return;
    }
    this.disabled = true
    this.coreService.registerDonation(type);
    this.submitEmitter.emit();
    setTimeout(() => {
      console.log('resetting cooldown')
     this.disabled = false
    }, 500)
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
