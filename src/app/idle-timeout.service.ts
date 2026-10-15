import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { SettingService } from './system-common/services/setting.service';
import data from '../assets/config/url-config.json';

@Injectable({
  providedIn: 'root',
})
export class IdleTimerService {
  public timeoutDuration = 900000; // 15 minutes in milliseconds
  private idleTimeout;
  private lastActivityTime = Date.now();
  private idleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public idleStatus$ = this.idleSubject.asObservable();
  public settingService: SettingService;
  public authService: AuthService;
  http: any;

  // constructor(private router: Router) {
  constructor(private router: Router, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.startTracking();
  }

  configureTimeout(timeoutDuration: number): void {
    console.log('timeoutDuration', timeoutDuration);
    this.timeoutDuration = timeoutDuration;
    // this.resetIdleTimer(); // Reset the timer with the new timeout
  }

  // Start tracking user activity
  private startTracking() {
    console.log('timeoutDuration in startTracking', this.timeoutDuration);
    this.resetIdleTimer();
    this.addEventListeners();
  }

  // Reset the idle timer
  private resetIdleTimer() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    this.idleTimeout = setTimeout(() => {
      this.onIdleTimeout();
    }, this.timeoutDuration);
  }

  // Handle idle timeout (e.g., redirect to login page or log out)
  private onIdleTimeout() {
    this.idleSubject.next(true);
    sessionStorage.clear();
    const url = data;
    const isOktaRequired = url[1]?.isOktaRequired;
    setTimeout(() => {
      if (this.settingService.getApplicationMode() == 'offline') {
        if (isOktaRequired && this.settingService.isConnected) {
          this.oktaAuth.signOut({
            revokeRefreshToken: false,
            revokeAccessToken: true,
            postLogoutRedirectUri: self.origin + '/login',
          });
        } else this.router.navigate(['login']);
      } else {
        if (isOktaRequired) this.signOut();
        else this.router.navigate(['login']);
      }
    }, 100);
  }

  // Add event listeners to detect user activity
  private addEventListeners() {
    document.body.addEventListener('mousemove', () => this.onActivityDetected());
    document.body.addEventListener('keydown', () => this.onActivityDetected());
  }

  // Reset the idle timer when user activity is detected
  private onActivityDetected() {
    this.lastActivityTime = Date.now();
    this.idleSubject.next(false); // User is active
    this.resetIdleTimer();
  }

  public async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}
