import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      console.log(params)
      this.isAuthenticated = params['isAuthenticated'];
    });
  }

  isAuthenticated = false;

  registerDonation(type: 'blood' | 'plasma', element: HTMLButtonElement) {
    setTimeout(() => (window.document as any).activeElement?.blur(), 760);
  }
}
