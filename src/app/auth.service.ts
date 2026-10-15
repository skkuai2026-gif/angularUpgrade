import { Router } from '@angular/router';
import { Inject, Injectable, Injector } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { HttpClient } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import data from '../assets/config/url-config.json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isloggedIn: boolean;
  private isLogInDisclaimerReq: string;

  constructor(
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public http: HttpClient,
    private injector: Injector
  ) {
    this.isLogInDisclaimerReq = undefined;
    if (sessionStorage.getItem('applicationProperties') != undefined)
      this.isLogInDisclaimerReq = JSON.parse(sessionStorage.getItem('applicationProperties'))['LOGINDISCLAIMER'];
    this.isloggedIn =
      sessionStorage.getItem('isLoggedIn') == null
        ? false
        : sessionStorage.getItem('isLoggedIn') == undefined
        ? false
        : sessionStorage.getItem('isLoggedIn') == 'true'
        ? this.isLogInDisclaimerReq == undefined || this.isLogInDisclaimerReq == 'NO'
          ? true
          : this.isLogInDisclaimerReq == 'YES' &&
            sessionStorage.getItem('isDisclaimerInSession') != undefined &&
            sessionStorage.getItem('isDisclaimerInSession') == 'YES'
          ? true
          : false
        : false;
    // console.log(this.isloggedIn)
  }

  private get settingService(): SettingService {
    return this.injector.get(SettingService);
  }

  setLoggedInSession() {
    this.isloggedIn = true;
    sessionStorage.setItem('isLoggedIn', 'true');
    // console.log(this.isloggedIn)
    return this.isloggedIn;
  }

  // isUserLoggedIn(): boolean {
  //   this.isloggedIn =
  //     sessionStorage.getItem('isLoggedIn') == null
  //       ? false
  //       : sessionStorage.getItem('isLoggedIn') == undefined
  //       ? false
  //       : sessionStorage.getItem('isLoggedIn') == 'true'
  //       ? true
  //       : false;
  //   return this.isloggedIn;
  // }
  isUserLoggedIn(): boolean {
    this.isloggedIn =
      sessionStorage.getItem('isLoggedIn') == null
        ? false
        : sessionStorage.getItem('isLoggedIn') == undefined
        ? false
        : sessionStorage.getItem('isLoggedIn') == 'true'
        ? this.isLogInDisclaimerReq == undefined || this.isLogInDisclaimerReq == 'NO'
          ? true
          : this.isLogInDisclaimerReq == 'YES' &&
            sessionStorage.getItem('isDisclaimerInSession') != undefined &&
            sessionStorage.getItem('isDisclaimerInSession') == 'YES'
          ? true
          : false
        : false;
    return this.isloggedIn;
  }

  isRouteAuthorized(routeUrl: any): boolean {
    let isRouteAuthorized = true;
    let authorizationExternalUrl = undefined;
    if (sessionStorage.getItem('applicationProperties') != undefined) {
      authorizationExternalUrl = JSON.parse(sessionStorage.getItem('applicationProperties'))[
        'AUTHORIZEEXTERNAL_URL'
      ];
    }
    if (authorizationExternalUrl != undefined && authorizationExternalUrl == 'YES') {
      isRouteAuthorized = false;
      let userLoginData = undefined;
      if (sessionStorage.getItem('userLoginData') != undefined) {
        userLoginData = JSON.parse(sessionStorage.getItem('userLoginData'));
      }

      if (userLoginData != undefined) {
        userLoginData['menuResourceUrlList'].forEach((menuResourceUrl) => {
          if (menuResourceUrl == '/' + routeUrl || menuResourceUrl.indexOf('/*' + routeUrl) > -1)
            isRouteAuthorized = true;
        });
      }
    }
    return isRouteAuthorized;
  }

  isMenuHidden(): boolean {
    return sessionStorage.getItem('isMenuHidden') == null
      ? false
      : sessionStorage.getItem('isMenuHidden') == undefined
      ? false
      : sessionStorage.getItem('isMenuHidden') == 'true'
      ? true
      : false;
  }

  async logoutUser(): Promise<void> {
    sessionStorage.clear();
    this.isloggedIn = false;
    const url = data;
    const isOktaRequired = url[1]?.isOktaRequired;

    if (this.settingService.getApplicationMode() === 'offline') {
      localStorage.setItem('offlineLogout', 'true');

      if (isOktaRequired && this.settingService.isConnected) {
        this.oktaAuth.signOut({
          revokeRefreshToken: false,
          revokeAccessToken: true,
          postLogoutRedirectUri: self.origin + '/login',
        });
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      if (isOktaRequired) {
        await this.signOut();
      } else {
        await this.router.navigate(['/login']);
      }
    }
  }

  setDisclaimerInSession(): void {
    sessionStorage.setItem('isDisclaimerInSession', 'YES');
  }
  public async signOut(): Promise<void> {
    console.log('In async signout method');
    await this.oktaAuth.signOut();
  }
  async idleTimeoutPopMsg() {
    // Show the popup immediately
    const overlay = document.createElement('div');
    overlay.id = 'pre-alert-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: '9999',
    });

    const popup = document.createElement('div');
    popup.id = 'pre-alert-div';
    popup.innerText = 'You are not allowed\nto view this page.\nYou are redirected to the login page.';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      color: 'rgba(26, 15, 15, 0.97)',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: '10000',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      textAlign: 'center',
      maxWidth: '220px',
      lineHeight: '1.5',
      whiteSpace: 'pre-line', // makes \n appear as line breaks
    });

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';

    // Start both: sign out and delay timer
    if (this.settingService.getApplicationMode() == 'offline' && this.settingService.isConnected) {
      await Promise.all([
        this.oktaAuth.signOut({
          revokeRefreshToken: false,
          revokeAccessToken: true,
          postLogoutRedirectUri: self.origin + '/login',
        }),
        new Promise((resolve) => setTimeout(resolve, 9000)), // wait 5 seconds
      ]);
    } else {
      await Promise.all([
        this.signOut(), // performs sign-out and redirects to login
        new Promise((resolve) => setTimeout(resolve, 9000)), // wait 5 seconds
      ]);
    }

    // Once both are complete, remove popup and overlay
    popup.remove();
    overlay.remove();
    document.body.style.overflow = '';
  }
}
