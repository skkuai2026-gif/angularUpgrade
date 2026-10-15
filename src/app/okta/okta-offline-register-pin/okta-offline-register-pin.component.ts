import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IdleTimerService } from 'src/app/idle-timeout.service';
import { OfflineService } from 'src/app/offline/offline.service';
import { OktaService } from '../service/okta.service';
import { AuthService } from 'src/app/auth.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';
import { LoginComponent } from 'src/app/system-common/login/login.component';
import OktaAuth from '@okta/okta-auth-js';
import { first } from 'rxjs/operators';
import data from 'src/assets/config/url-config.json';

@Component({
  selector: 'sym-okta-offline-register-pin',
  templateUrl: './okta-offline-register-pin.component.html',
  styleUrls: ['./okta-offline-register-pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OktaOfflineRegisterPinComponent extends LoginComponent {
  isAuthenticated!: boolean;
  retUrl: string = 'home';
  public registerPinVar: boolean;
  public registerPinForm: UntypedFormGroup;
  public pin;
  public agentField11;
  public reconfirmPin;
  proposalVersion: any;
  company: any;
  companySUNPH: any;
  agentField13: any;
  error: any;
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
  }
  getPropMatrix() {
    this.loginService.getProposalVersion().subscribe((lookupList): any => {
      console.log('Languages: ' + JSON.stringify(lookupList['data'].proposalVersion));
      this.useCaseList = JSON.parse(JSON.stringify(lookupList['data']['proposalVersion']));
      this.proposalVersion = this.useCaseList[0]['cd'];
    });
  }

  getCompanyName() {
    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
  }

  async ngOnInit() {
    console.log('ngOninit of OktaOfflineRegisterPinComponent===');
    // const userCredentials = this.settingService.getURLValue('USERCREDENTIALS');
    // console.log("userCredentials",userCredentials);
    // this.loginForm = this.formBuilder.group({
    //   userId: [userCredentials['userId'], Validators.required],
    // });
    // console.log("loginForm",this.loginForm);
    // this.registerPinForm = this.formBuilder.group({
    //   agentField11: ['', Validators.required],
    //   agentField13: ['', Validators.required,Validators.maxLength(6)],
    //   // password: ['', [Validators.required, Validators.minLength(6)]],
    // });
    // setTimeout(() => {
    //   // this.loginService.displayLoader(true);
    //   // this.oktaLoginCallback();
    // }, 10);
  }

  protected async oktaLoginCallback() {
    console.log('oktalogincallback OktaOfflineRegisterPinComponent===');
    let thisQueryParamP = await this.activatedRoute.queryParamMap.pipe(first()).toPromise();
    console.log('thisQueryParamP', thisQueryParamP);
    const token = thisQueryParamP.get('token');
    console.log('retUrl 56', thisQueryParamP.getAll('retUrl'));
    if (thisQueryParamP.get('retUrl') != undefined) {
      this.retUrl = '';
      thisQueryParamP.getAll('retUrl').filter((url) => {
        this.retUrl += url + '/';
      });
      // this.retUrl = thisQueryParamP.get('retUrl');
    }
    console.log('retUrl', this.retUrl);
    if (token != undefined) {
      console.log(token);
      // this.settingService.logoutUser();
      this.loginToApp(undefined, undefined, undefined, token);
      return;
    }

    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['home']);
    }
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    console.log('this.isAuthenticated====offlinePIN====' + this.isAuthenticated);
    if (this.isAuthenticated) {
      const user = await this.oktaAuth.getUser();
      const accessToken = await this.oktaAuth.getAccessToken();
      setTimeout(() => {
        let userList = user.preferred_username.split('@');
        // this.loginService.displayLoader(true);
        this.loginToApp(userList[0].toUpperCase(), 'dummy', 'EN', accessToken);
        this.loginService.hideLoader(true);
        // this.settingService.logoutUser();
      }, 1);
    } else {
      this.router.navigate(['/login']);
    }
  }

  public registerPin() {
    //To Login after click on Agree Disclaimer
    // const userCredentials = this.settingService.getURLValue('USERCREDENTIALS');
    let loggedInUserId = JSON.parse(this.settingService.getSessionStorageValue('USER'));
    console.log('registerPin userCredentials', loggedInUserId);
    this.loginForm = this.formBuilder.group({
      userId: [loggedInUserId, Validators.required],
    });
    console.log('loginForm', this.loginForm);
    let pin = this.agentField11;
    let reconfirmPin = this.agentField13;
    let userId = this.loginForm.value.userId;
    console.log('Pin===', pin);
    console.log('reconfirmPin===', reconfirmPin);

    // let userId = this
    // this.pin="1234";
    if (pin != reconfirmPin) {
      alert('Please re-enter the PIN again.');
    } else {
      // this.reconfirmPin="1234"
      this.loginService.registerPinInDB(pin, reconfirmPin, userId).subscribe((response): any => {
        console.log('response after registerPin', response);
        if (response['success'] == true) {
          this.registerPinVar = true;
        } else {
          alert('Issue in Register Pin.Please Check');
        }
      });
    }
    //this.oktaLoginCallback();
  }
}
