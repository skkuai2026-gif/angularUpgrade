import { MenuService } from 'src/app/system-common/services/menu.service';
import { AuthService } from './../../auth.service';
import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingService } from '../services/setting.service';
import { OfflineService } from 'src/app/offline/offline.service';

import { first } from 'rxjs/operators';
import { IdleTimerService } from 'src/app/idle-timeout.service';
@Component({
  selector: 'sym-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoginComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public submitted: boolean;
  public isLoginFailed: boolean;
  public languageList;
  public useCaseList;
  public defaultLanguage: string;
  retUrl: string;
  public otpClicked: boolean;
  public loginOtpReqd: boolean;
  public otpExpiryTime: number;
  public useCase;
  public isUseCaseClicked: boolean;
  public showDisclaimer: boolean;
  public showLoader: boolean;

  constructor(
    public settingService: SettingService,
    public authService: AuthService,
    protected loginService: LoginService,
    protected router: Router,
    protected formBuilder: UntypedFormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected offlineService: OfflineService,
    protected idleTimerService: IdleTimerService
  ) {
    $(document).on('focus', '.fBox .form-control', function () {
      $(this).parent().addClass('active');
    });
    $(document).on('blur', '.fBox .form-control', function () {
      $(this).parent().removeClass('active');
    });
    this.showDisclaimer = false;
    this.loginOtpReqd = false;
    this.isUseCaseClicked = false;
    this.otpClicked = false;
    this.retUrl = 'home';
    this.submitted = false;
    this.isLoginFailed = false;
    this.showLoader = false;
  }

  async ngOnInit() {
    this.settingService.isLabelLoaded = false;
    this.loadLoginLabelValues();
    sessionStorage.clear();
    if ($('.menuClosed')[0]) {
      $('.btnLeftNav').trigger('click');
    }
    let thisQueryParamP = await this.activatedRoute.queryParamMap.pipe(first()).toPromise();
    const token = thisQueryParamP.get('token');
    // console.log(thisQueryParamP.getAll('retUrl'));
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
      this.loginToApp(undefined, undefined, undefined, token);
      return;
    }
    //check if token has been set in session from the application server
    // alert(sessionStorage.getItem('App_Auth_Token'));
    // if(sessionStorage.getItem('App_Auth_Token') != undefined)
    // {
    //     // alert(sessionStorage.getItem('App_Auth_Token'));
    //     this.loginToApp(undefined, undefined, undefined,sessionStorage.getItem('App_Auth_Token'));
    //     return;
    // }

    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['home']);
    }
    if (
      this.settingService.getApplicationMode() != undefined &&
      this.settingService.baseURL != undefined &&
      this.settingService.urlList != undefined
    ) {
      this.getAllLanuages();
    } else if (this.settingService.urlList == undefined) {
      await this.settingService.load();
      this.getAllLanuages();
    }
    // if (this.settingService.urlList != undefined) {
    //   this.loginForm = this.formBuilder.group({
    //     userId: ['', Validators.required],
    //     password: ['', Validators.required],
    //     language: ['', Validators.required],
    //     useCase: [null],
    //     // password: ['', [Validators.required, Validators.minLength(6)]],
    //   });
    // }

    if (this.settingService.getApplicationMode() == 'offline' && this.settingService.urlList != undefined) {
      this.settingService.message = undefined;
      this.loginService.isBiometricsDone = false;
      const userCredentials = this.settingService.getURLValue('USERCREDENTIALS');
      let bioMetricResult = false;
      if (this.settingService.urlList != undefined && userCredentials != undefined) {
        if (
          userCredentials['enableFingerprintAuth'] != undefined &&
          userCredentials['enableFingerprintAuth'] == 'YES'
        ) {
          // bioMetricResult = await this.offlineService.performBiometricVerification();
          // console.log('~~~bioMetricResult:', bioMetricResult);
          if (bioMetricResult) {
            this.loginService.isBiometricsDone = true;
            //   console.log('~~~userCredentials[userId]:', userCredentials['userId']);
            //   console.log('~~~userCredentials[password]:', userCredentials['password']);
            this.loginForm = this.formBuilder.group({
              userId: [userCredentials['userId'], Validators.required],
              password: [userCredentials['password'], Validators.required],
              language: [this.defaultLanguage, Validators.required],
            });
            setTimeout(() => {
              // console.log(this.selectedStep);
              this.onLoginClick();
            }, 400);
            //   this.onLoginClick();
          } else {
            this.settingService.message = 'Biometric failed.';
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
  }
  protected getLoginLabelKeyList(): string[] {
    return [
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
    ];
  }
  //Label Values to display onto the login page.
  protected loadLoginLabelValues() {
    let labelKeyList = this.getLoginLabelKeyList();
    this.loginService.getLabels(labelKeyList).subscribe(
      (response) => {
        response = JSON.parse(JSON.stringify(response));
        this.settingService.setAdditionalLabels(response['data']['labels']);
        //To load the login form after the Label Values are loaded
        if (this.defaultLanguage == undefined) this.defaultLanguage = 'EN';
        this.loginForm = this.formBuilder.group({
          userId: ['', Validators.required],
          password: ['', Validators.required],
          language: [this.defaultLanguage, Validators.required],
          useCase: [null],
          // password: ['', [Validators.required, Validators.minLength(6)]],
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('#userName').focus();
    }, 10);
    setTimeout(() => {
      if (this.settingService.urlList != undefined && document.getElementById('useCase') != undefined)
        this.getUseCaseData();
    }, 300);
  }

  // convenience getter for easy access to form fields in HTML file
  get form() {
    return this.loginForm.controls;
  }

  //set the value when language is changed. Call on change of language dropdown
  public changeLanguage(e) {
    this.loginForm.get('language').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  public onOTPActionClick(actionValue: { action: string; otp: any }) {
    //on ok button click of OTP popup,set otpClicked flag as true.
    if (actionValue.action == 'validateOTP') {
      this.otpClicked = true;
      this.showDisclaimer =
        SettingService.getApplicationPropertiesValue('LOGINDISCLAIMER') == 'YES' ? true : false;
      if (this.showDisclaimer != undefined && this.showDisclaimer) {
        this.otpClicked = false;
        return;
      }
      this.onLoginClick();
    }
  }
  public onValidateOtp(isValidOtp: boolean) {
    if (!isValidOtp) {
      this.submitted = false;
      this.otpClicked = false;
    }
  }

  //triggered when login details are submitted.
  public onLoginClick() {
    this.showLoader = true;
    // this.loginService.displayLoader(true);
    this.submitted = true;
    this.isLoginFailed = false;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.showLoader = false;
      // this.loginService.hideLoader(true);
      return;
    }
    let userId = this.loginForm.value.userId;
    let password = this.loginForm.value.password;
    let language = this.loginForm.value.language;
    let useCase = this.loginForm.value.useCase;
    //console.log(language)
    if (
      (userId != '' || userId != undefined) &&
      (password != '' || password != undefined) &&
      (language != '' || language != undefined)
    ) {
      // console.log(encryptPassword);

      this.loginToApp(userId, password, language, undefined, useCase);
    }
  }

  protected loginToApp(userId: any, password: any, language: any, token?: string, useCase?: string) {
    this.loginService.process(userId, password, language, token, useCase).subscribe(
      (data) => {
        // console.log(data);
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
                console.log('User is idle. Redirecting to login page...');
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

  getAllLanuages() {
    this.loginService.init().subscribe(
      (languageList): any => {
        // console.log('Languages: ' + JSON.stringify(languageList["data"].language));
        this.languageList = JSON.parse(JSON.stringify(languageList['data'].language));
        this.defaultLanguage = languageList['data'].languageDef;
        // if (this.defaultLanguage == undefined) this.defaultLanguage = 'EN';
        // this.loginForm = this.formBuilder.group({
        //   userId: ['', Validators.required],
        //   password: ['', Validators.required],
        //   language: [this.defaultLanguage, Validators.required],
        //   useCase: [null],
        //   // password: ['', [Validators.required, Validators.minLength(6)]],
        // });
      },
      (error) => {
        console.log('All Language list loading failed.');
        console.log('Error:', error);
        this.settingService.message = 'Please check your connection';
        this.loginService.handleError(error);
      }
    );
  }

  getUseCaseData() {
    this.loginService.getLookupData(['USECASE']).subscribe(
      (lookupList): any => {
        // console.log('Languages: ' + JSON.stringify(languageList["data"].language));
        this.useCaseList = JSON.parse(JSON.stringify(lookupList['data']['USECASE']));
        for (let i = 0; i < this.useCaseList.length; i++) {
          if (this.useCaseList[i].isDef != undefined && this.useCaseList[i].isDef == 'YES') {
            this.useCase = this.useCaseList[i];
            this.loginForm.get('useCase').setValue(this.useCase.cd);
            break;
          }
        }
      },
      (error) => {
        console.log('All use case list loading failed.');
        console.log('Error:', error);
        this.settingService.message = 'Please check your connection';
        this.loginService.handleError(error);
      }
    );
  }

  protected onReset() {
    this.submitted = false;
    if (this.loginForm != undefined) {
      this.loginForm.reset();
      this.loginForm.get('language').setValue(this.defaultLanguage, {
        onlySelf: true,
      });
    }
  }

  /**
   * This method allow copy username.
   * @returns false value by default.
   */
  public onCopy(event: Event): boolean {
    return false;
  }

  /**
   * This method allow paste username/password.
   * @returns false value by default.
   */
  public onPaste(event: Event): boolean {
    return false;
  }

  public omit_special_char(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  public showUseCase() {
    this.isUseCaseClicked = true;
  }

  public hideUseCase() {
    this.isUseCaseClicked = false;
  }
  public disagreeDisclaimerClicked(event: Event) {
    this.loginService.acceptLoginDisclaimer('NO').subscribe(
      (res: any) => {
        if (res.success === true) {
          this.showDisclaimer = false;
          this.submitted = false;
        }
      },
      (err) => {
        this.showDisclaimer = false;
        this.submitted = false;
      }
    );
  }
  public acceptDisclaimerCLicked(event: Event) {
    this.loginService.acceptLoginDisclaimer('YES').subscribe(
      (res: any) => {
        if (res.success === true) {
          this.authService.setDisclaimerInSession();
          this.authService.setLoggedInSession();
          if (this.retUrl) {
            this.router.navigate([this.retUrl]);
          } else {
            this.router.navigate(['home']);
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
}
