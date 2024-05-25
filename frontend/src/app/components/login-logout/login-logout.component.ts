import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-logout',
  templateUrl: './login-logout.component.html',
  styleUrl: './login-logout.component.scss',
})
export class LoginLogoutComponent {
  constructor(public auth: AuthService) {}
}
