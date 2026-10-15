import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { LoginComponent } from 'src/app/system-common/login/login.component';
import { LoginService } from 'src/app/system-common/services/login.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OktaService } from '../service/okta.service';
import { IdleTimerService } from 'src/app/idle-timeout.service';
import { OfflineService } from 'src/app/offline/offline.service';

@Component({
  selector: 'sym-okta-login-callback',
  templateUrl: './okta-login-callback.component.html',
  styleUrls: ['./okta-login-callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OktaLoginCallbackComponent extends LoginComponent {
  isAuthenticated!: boolean;
  retUrl: string = 'home';
  public errorMessageFromService: string = '';
  public isFirstIdleTimeout: boolean = false;

  constructor(
    protected router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    protected activatedRoute: ActivatedRoute,
    public settingService: SettingService,
    public authService: AuthService,
    protected loginService: OktaService,
    protected formBuilder: FormBuilder,
    protected offlineService: OfflineService,
    protected idleTimerService: IdleTimerService
  ) {
    super(
      settingService,
      authService,
      loginService,
      router,
      formBuilder,
      activatedRoute,
      offlineService,
      idleTimerService
    );
  }

  async ngOnInit() {
    // Option A: From localStorage
    this.errorMessageFromService = window.localStorage.getItem('ERRORMESSAGE') || '';
    console.log('errorMessageFromService', this.errorMessageFromService);

    setTimeout(() => {
      this.loginService.displayLoader(true);
      this.oktaLoginCallback();
    }, 500);
  }

  protected async oktaLoginCallback() {
    let thisQueryParamP = await this.activatedRoute.queryParamMap.pipe(first()).toPromise();
    const token = thisQueryParamP.get('token');
    console.log(thisQueryParamP.getAll('retUrl'));
    if (thisQueryParamP.get('retUrl') != undefined) {
      this.retUrl = '';
      thisQueryParamP.getAll('retUrl').filter((url) => {
        this.retUrl += url + '/';
      });
      // this.retUrl = thisQueryParamP.get('retUrl');
    }
    // console.log(this.retUrl);
    if (token != undefined) {
      // alert(token);
      // this.settingService.logoutUser();
      this.loginToApp(undefined, undefined, undefined, token);
      return;
    }

    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['home']);
      return;
    }

    const fingerprint = thisQueryParamP.get('fingerprint') === 'true';
    const agentId = thisQueryParamP.get('agentId');
    // For fingerprint login, tokens were already refreshed and stored in OktaAuth.tokenManager by okta-login.component.ts.
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    if (fingerprint && !this.isAuthenticated) {
      this.loginService.hideLoader(true);
      this.router.navigate(['/login']);
      return;
    }

    if (
      this.isAuthenticated &&
      ((this.settingService.isConnected && this.settingService.getApplicationMode() === 'offline') ||
        this.settingService.getApplicationMode() === 'online')
    ) {
      const user = await this.oktaAuth.getUser();
      const accessToken = await this.oktaAuth.getAccessToken();
      const refreshToken = await this.oktaAuth.getRefreshToken();
      let userList = '';

      setTimeout(() => {
        if (user?.preferred_username) {
          userList = user.preferred_username.split('@')[0].toUpperCase();
        } else if (user?.uid != undefined && user?.uid != null && user?.uid != '') {
          const uidValue = Array.isArray(user.uid) ? user.uid[0] : user.uid;
          userList = String(uidValue).split('@')[0].toUpperCase();
        } else {
          userList = agentId;
        }
        if (this.settingService.getApplicationMode() === 'offline') {
          this.loginToAppOffline(userList, 'dummy', 'EN', accessToken, refreshToken);
        } else {
          this.loginToApp(userList, 'dummy', 'EN', accessToken);
        }
        this.loginService.hideLoader(true);
      }, 1);
    } else {
      this.router.navigate(['/login']);
    }
  }

  protected loginToAppOffline(userId: any, password: any, language: any, token?: string, useCase?: string) {
    this.loginService.process(userId, password, language, token, useCase).subscribe(
      (data) => {
        this.offlineService.hideSplashScreen();

        this.otpExpiryTime =
          SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME') != undefined
            ? parseInt(SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME'))
            : 300;

        let userDetails = JSON.parse(JSON.stringify(data));

        if (userDetails != undefined) {
          this.loginService.setLoginUserDetails(userDetails, userId, language);

          console.log('userDetails.data', userDetails.data);

          if (userDetails.data.registered == false || userDetails.data.loginPin == '') {
            this.router.navigate(['/oktaOfflineRegisterPin']);
          }
          if (this.settingService.getApplicationMode() === 'offline' && userDetails.data.syncMandatory) {
            this.router.navigate(['sync']);
          } else {
            //check login otp required application property.
            let loginOtpReqdAppProperty = SettingService.getApplicationPropertiesValue('LOGINOTPREQD');
            //if it is value as no or undefined then also proceeds login
            if (!this.otpClicked) {
              if (loginOtpReqdAppProperty == undefined || loginOtpReqdAppProperty == 'NO') {
                this.otpClicked = true;
                this.showDisclaimer =
                  SettingService.getApplicationPropertiesValue('LOGINDISCLAIMER') == 'YES' ? true : false;
                if (this.showDisclaimer != undefined && this.showDisclaimer) {
                  this.otpClicked = false;
                }
              }
            }
            let timeout = parseInt(SettingService.getApplicationPropertiesValue('APPTIMEOUT'));
            console.log('timeout', timeout);
            this.idleTimerService.configureTimeout(timeout);
            this.idleTimerService.idleStatus$.subscribe((isIdle) => {
              if (isIdle) {
                if (isIdle && !this.isFirstIdleTimeout && this.settingService.getApplicationMode() === 'offline') {
                  this.isFirstIdleTimeout = true;
                  this.authService.idleTimeoutPopMsg();
                }
                // You can show a warning or modal here before redirecting the user
              }
            });

            //if it is value as yes then set loginOtpReqd flag as true and display otp screen.
            //this flag is used in html to display otp popup
            if (loginOtpReqdAppProperty == 'YES') {
              this.loginOtpReqd = true;
            }
            if (this.otpClicked) {
              const loginInterval = setInterval(() => {
                if (this.settingService.isLabelLoaded) {
                  this.authService.setLoggedInSession();
                  if (userDetails.data.userType == 'CUSTOMER') {
                    this.settingService.setSessionStorageValue('isMenuHidden', true);
                    this.router.navigate(['customer-home']);
                  } else if (userDetails.data.userType == 'BANK') {
                    this.settingService.setSessionStorageValue('isMenuHidden', true);
                    this.router.navigate(['bank-home']);
                  } else if (this.retUrl != null) {
                    this.router.navigate([this.retUrl]);
                  } else {
                    this.router.navigate(['home']);
                  }
                  if (this.settingService.displayNewUI()) {
                    this.settingService.isNewUIDisplayed = this.settingService.displayNewUI();
                    this.settingService.loadExternalStyle('new_ui_styles.css');
                  }
                  if (
                    sessionStorage.length > 0 &&
                    this.settingService.getSessionStorageValue('isMenuSelected') === null &&
                    $('.menuClosed:visible').length > 0
                  ) {
                    $('.btnLeftNav').trigger('click');
                  }
                  //
                  // this.settingService.loadExternalStyle(
                  //   userDetails.data.AgentId + '_styles.css',
                  //   'assets/theme/company/css'
                  // );
                  //

                  clearInterval(loginInterval);
                }
              }, 10);
            }
          }
        } else {
          this.isLoginFailed = true;
          this.onReset();
        }
        // this.showLoader = false;
        // this.loginService.hideLoader(true);
      },
      (error) => {
        this.isLoginFailed = true;
        this.onReset();

        this.loginService.handleError(error);
        this.showLoader = false;

        // this.loginService.hideLoader(true);
      }
    );
  }
}
