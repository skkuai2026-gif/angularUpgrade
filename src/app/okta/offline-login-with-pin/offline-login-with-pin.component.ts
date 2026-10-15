import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { AuthService } from 'src/app/auth.service';
import { LoginComponent } from 'src/app/system-common/login/login.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OktaService } from '../service/okta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfflineService } from 'src/app/offline/offline.service';
import { IdleTimerService } from 'src/app/idle-timeout.service';
import data from 'src/assets/config/url-config.json';

@Component({
  selector: 'sym-offline-login-with-pin',
  templateUrl: './offline-login-with-pin.component.html',
  styleUrls: ['./offline-login-with-pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OfflineLoginWithPinComponent extends LoginComponent {
  offlinePin: any;
  isAuthenticated!: boolean;
  retUrl: string = 'home';
  proposalVersion: any;
  company: any;
  companySUNPH: any;
  registerPinVar: boolean;
  advisorCode: any;
  error: any;
  resetPinVar: any;
  // loginWithPinForm: any;
  loginWithPinForm: FormGroup;
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
    this.getCompanyName();
    this.getPropMatrix();
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
    this.loginWithPinForm = this.formBuilder.group({
      offlinePin: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  //Label Values to display onto the login page.
  protected loadLoginLabelValues() {
    let labelKeyList = [
      'SessionTimeoutErrMsg',
      'SignInAccount',
      'enterValidUsername',
      'enterValidPassword',
      'selectValidLanguage',
      'reqLanguage',
      'userName',
      'password',
      'languageCd',
      'select',
      'reqUsername',
      'reqPassword',
      'otpSent',
      'regEmailMobile',
      'email',
      'but_Submit',
      'CLOSE_CONFIRMATION',
      'timeLeft',
      'invalidOtp',
      'resendOtp',
      'getOTP',
      'getOTPMessage',
      'verification',
      'accept',
      'DONOTAGREE',
      'termsandconditions',
      'DISCLAIMER',
      'NEEDNETWORKACCESS',
      'BiometricCancelled',
      'BiometricThreeAttemptsCancelled',
    ];
    this.loginService.getLabels(labelKeyList).subscribe(
      (response) => {
        console.log('response==OfflineLoginWithPinComponent=' + JSON.stringify(response));

        response = JSON.parse(JSON.stringify(response));
        this.settingService.setAdditionalLabels(response['data']['labels']);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getCompanyName() {
    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
  }
  getPropMatrix() {
    this.loginService.getProposalVersion().subscribe((lookupList): any => {
      console.log('Languages: ' + JSON.stringify(lookupList['data'].proposalVersion));
      this.useCaseList = JSON.parse(JSON.stringify(lookupList['data']['proposalVersion']));
      this.proposalVersion = this.useCaseList[0]['cd'];
    });
  }

  async ngOnInit() {
    // this.settingService.isLabelLoaded = false;
    // setTimeout(() => {
    let bioMetricResult: {
      success: boolean;
      cancelled: boolean;
    } = {
      success: false,
      cancelled: false,
    };
    setTimeout(async () => {
      this.loadLoginLabelValues();

      if (this.settingService.getApplicationMode() == 'offline' && this.settingService.urlList != undefined) {
        this.settingService.message = undefined;
        this.loginService.isBiometricsDone = false;
        const userCredentials = this.settingService.getURLValue('USERCREDENTIALS');
        // let bioMetricResult = false;
        if (this.settingService.urlList != undefined && userCredentials != undefined) {
          if (
            userCredentials['enableFingerprintAuth'] != undefined &&
            userCredentials['enableFingerprintAuth'] == 'YES'
          ) {
            bioMetricResult = await this.offlineService.performBiometricVerification();
            if (bioMetricResult.success) {
              this.loginService.isBiometricsDone = true;
              this.loginForm = this.formBuilder.group({
                userId: [userCredentials['agentId'], Validators.required],
                password: [userCredentials['agentField11'], Validators.required],
                language: [this.defaultLanguage, Validators.required],
              });
              setTimeout(() => {
                // console.log(this.selectedStep);
                this.loginWithPinBiometric();
              }, 400);
              //   this.onLoginClick();
            } else if (bioMetricResult.cancelled) {
              this.settingService.message = 'Biometric authentication cancelled.';
              confirm(this.settingService.getLabelValue('BiometricCancelled'));

              // alert('Biometric authentication was cancelled. Please use your user id and password to continue.');
            } else {
              this.settingService.message = 'Biometric authentication failed.';
              confirm(this.settingService.getLabelValue('BiometricThreeAttemptsCancelled'));

              // alert('Biometric authentication was unsuccessful after 3 attempts. Please log in using your User ID and password.' );
            }
          }
        }
      } else {
        this.loginForm = this.formBuilder.group({
          userId: ['', Validators.required],
          password: ['', Validators.required],
          language: ['', Validators.required],
          // password: ['', [Validators.required, Validators.minLength(6)]],
        });
      }

      // setTimeout(() => {
      //   this.loginService.displayLoader(true);
      // this.oktaLoginCallback();
    }, 100);
    console.log('isLabelLoaded=22=' + this.settingService.isLabelLoaded);
  }
  public loginWithPinBiometric() {
    let userId = this.loginForm.value.userId;
    let password = this.loginForm.value.password;
    let language = this.loginForm.value.language;
    let useCase = this.loginForm.value.useCase;
    if (
      (userId != '' || userId != undefined) &&
      (password != '' || password != undefined) &&
      (language != '' || language != undefined)
    ) {
      this.loginService.loginWithPin(userId, password).subscribe(
        (body) => {
          if (body['success'] == true) {
            this.registerPinVar = true;
            this.settingService.reloadLabels();
            // this.showLoader = false;
            // this.oktaLoginCallback();
          } else {
            this.isLoginFailed = true;
            this.onReset();
            this.error = body['message'];
            this.loginService.handleError(body['message']);
            this.showLoader = false;
          }
        },
        (error) => {
          this.isLoginFailed = true;
          this.onReset();
          console.log('Login with Pin failed.');
          console.log('Error:', error);
          this.loginService.handleError(error);
          this.showLoader = false;
        }
      );
    }
  }

  public loginWithPin() {
    // alert("logging in with pin"+this.offlinePin);
    // this.loginService.displayLoader(true);
    this.loginService.loginWithPin(this.advisorCode, this.offlinePin).subscribe(
      (body) => {
        if (body['success'] == true) {
          this.registerPinVar = true;
          this.settingService.reloadLabels();
          // this.showLoader = false;
          // this.oktaLoginCallback();
        } else {
          this.isLoginFailed = true;
          this.onReset();
          this.error = body['message'];
          this.loginService.handleError(body['message']);
          this.showLoader = false;
        }
      },
      (error) => {
        this.isLoginFailed = true;
        this.onReset();
        console.log('Login with Pin failed.');
        console.log('Error:', error);
        this.loginService.handleError(error);
        this.showLoader = false;

        // this.loginService.hideLoader(true);
      }
    );
    // this.oktaLoginCallback();
  }

  public resetPin() {
    this.resetPinVar = true;

    // this.authService.logoutUser();
  }
  public acceptDisclaimerCLicked(event: Event) {
    this.loginService.acceptLoginDisclaimer('YES').subscribe(
      (res: any) => {
        if (res.success === true) {
          this.authService.setDisclaimerInSession();
          this.otpClicked = true;
          // this.authService.setLoggedInSession();

          if (this.loginService.isBiometricsDone === true) {
            if (this.retUrl) {
              this.loginWithPinOffline(this.loginForm.value.userId, 'dummy', 'EN');
            } else {
              this.loginWithPinOffline(this.loginForm.value.userId, 'dummy', 'EN');
            }
          } else {
            if (this.retUrl) {
              this.loginWithPinOffline(this.advisorCode, 'dummy', 'EN');
            } else {
              this.loginWithPinOffline(this.advisorCode, 'dummy', 'EN');
            }
          }
        } else {
          this.settingService.logoutUser();
        }
      },
      (err) => {
        this.settingService.logoutUser();
        console.error('API error:', err);
      }
    );
  }

  protected loginWithPinOffline(userId: any, password: any, language: any, token?: string, useCase?: string) {
    this.loginService.process(userId, password, language, token, useCase).subscribe(
      (data) => {
        console.log(data);
        this.otpExpiryTime =
          SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME') != undefined
            ? parseInt(SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME'))
            : 300;
        let userDetails = JSON.parse(JSON.stringify(data));

        // console.log(JSON.stringify(userDetails));
        if (userDetails != undefined) {
          this.loginService.setLoginUserDetails(userDetails, userId, language);
          if (this.settingService.getApplicationMode() === 'offline' && userDetails.data.syncMandatory) {
            console.log('Login successful and redirecting to sync');
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
                console.log('showdiscalimer', this.showDisclaimer);
                if (this.showDisclaimer != undefined && this.showDisclaimer) {
                  this.otpClicked = false;
                }
              }
            }
            let timeout = parseInt(SettingService.getApplicationPropertiesValue('APPTIMEOUT'));
            this.idleTimerService.configureTimeout(timeout);
            this.idleTimerService.idleStatus$.subscribe((isIdle) => {
              if (isIdle && !this.isFirstIdleTimeout && this.settingService.getApplicationMode() === 'offline') {
                this.isFirstIdleTimeout = true;
                this.authService.idleTimeoutPopMsg();
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
                    console.log('return to ' + this.retUrl);
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
                  // console.log(userDetails.data.AgentId);
                  // this.settingService.loadExternalStyle(
                  //   userDetails.data.AgentId + '_styles.css',
                  //   'assets/theme/company/css'
                  // );
                  // console.log(this.settingService.applicationProperties)
                  console.log('Login successful.');
                  clearInterval(loginInterval);
                }
              }, 10);
            }
          }
        } else {
          this.isLoginFailed = true;
          this.onReset();
          this.error = 'Login Failed.Please try again.';
        }
        // this.showLoader = false;
        // this.loginService.hideLoader(true);
      },
      (error) => {
        this.isLoginFailed = true;
        this.onReset();
        console.log('Login failed.');
        console.log('Error:', error);
        this.loginService.handleError(error);
        this.showLoader = false;

        // this.loginService.hideLoader(true);
      }
    );
  }
}
