import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../auth.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from '../services/setting.service';
import { first } from 'rxjs/operators';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'sym-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoginOtpComponent implements OnInit {
  otpRecipientAddress: { emailId: any; mobileNumber: any };
  guid: string;
  otpDetails: any;
  otpErrorFailed: boolean;
  otpDataLoaded: boolean = false;
  otpExpiryTime: number;
  RecipientEmailId: any;
  RecipientMobileNumber: any;
  isOtpLoading = false;
  constructor(
    public settingService: SettingService,
    public authService: AuthService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    public loginService: LoginService
  ) {
    this.RecipientEmailId = null;
    this.RecipientMobileNumber = null;
  }

  async ngOnInit() {
    console.log('login otp component called........');
    this.loginService.hideLoader(true);
    if (this.settingService.urlList == undefined) {
      await this.settingService.loadURLList();
    }
    if (this.settingService.urlList != undefined) {
      this.setOTPLabels();
    }
  }

  protected async getGuid() {
    sessionStorage.clear();
    let thisQueryParamP = await this.activatedRoute.queryParamMap.pipe(first()).toPromise();
    this.guid = thisQueryParamP.get('guid');

    this.loginService.getOTPRecipientData(this.guid).subscribe(
      (successResponse) => {
        let response = JSON.parse(JSON.stringify(successResponse));
        if (response) {
          if (response != undefined && response.data.recipientAddressList != undefined) {
            if (response.data.recipientAddressList.EMAIL != undefined)
              this.RecipientEmailId = response.data.recipientAddressList.EMAIL;
            if (response.data.recipientAddressList.SMS != undefined)
              this.RecipientMobileNumber = response.data.recipientAddressList.SMS;
          }
        } else {
          this.router.navigate(['policy-login-otp-redirect']);
        }
        console.log('OTP Recipient Data fetched successfully.');
        this.otpDataLoaded = true;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  protected getOTPLabelKeyList(): string[] {
    return [
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
  protected setOTPLabels() {
    let labelKeyList = this.getOTPLabelKeyList();

    let response;
    this.loginService.getLabels(labelKeyList).subscribe(
      (response) => {
        response = JSON.parse(JSON.stringify(response));
        this.settingService.setAdditionalLabels(response['data']['labels']);
        // this.generateOTP();
        // this.settingService.getLabelValue( 'otpSent' ) == '' ? 10 : 5;
        // this.getGuid();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  generateOTP(isResendOtp?: boolean) {
    this.loginService.getEncryptOTP(this.guid, isResendOtp).subscribe(
      (otpDetails) => {
        this.otpDetails = JSON.parse(JSON.stringify(otpDetails));
        if (this.otpDetails.data.recipientAddressList != undefined) {
          this.otpRecipientAddress = {
            emailId:
              this.otpDetails.data.recipientAddressList.EMAIL != undefined
                ? this.otpDetails.data.recipientAddressList.EMAIL[0]
                : null,
            mobileNumber:
              this.otpDetails.data.recipientAddressList.MOBILENUMBER != undefined
                ? this.otpDetails.data.recipientAddressList.MOBILENUMBER[0]
                : null,
          };
        }
        this.otpExpiryTime = this.otpDetails.data.OTP_EXPIRY_TIME;
        if (this.otpExpiryTime == undefined) {
          this.otpExpiryTime =
            SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME') != undefined
              ? parseInt(SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME'))
              : 60;
        }
        console.log('OTP genrated successfully.');
      },
      (error) => {
        console.log('OTP genrated failed.');
        console.log('Error:', error);
        this.loginService.handleError(error);
      }
    );
  }
  generateOTPEmail(isResendOtp?: boolean) {
    this.loginService.getEncryptOTPEmail(this.guid, isResendOtp).subscribe(
      (otpDetails) => {
        this.otpDetails = JSON.parse(JSON.stringify(otpDetails));
        if (this.otpDetails.data.recipientAddressList != undefined) {
          this.otpRecipientAddress = {
            emailId:
              this.otpDetails.data.recipientAddressList.EMAIL != undefined
                ? this.otpDetails.data.recipientAddressList.EMAIL[0]
                : null,
            mobileNumber:
              this.otpDetails.data.recipientAddressList.MOBILENUMBER != undefined
                ? this.otpDetails.data.recipientAddressList.MOBILENUMBER[0]
                : null,
          };
        }
        this.otpExpiryTime = this.otpDetails.data.OTP_EXPIRY_TIME;
        if (this.otpExpiryTime == undefined) {
          this.otpExpiryTime =
            SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME') != undefined
              ? parseInt(SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME'))
              : 60;
        }
        console.log('OTP genrated successfully.');
      },
      (error) => {
        console.log('OTP genrated failed.');
        console.log('Error:', error);
        this.loginService.handleError(error);
      }
    );
  }

  onOTPActionClick(actionValue: { action: string; otp: any; emailorsms: any }) {
    if (actionValue.action == 'resendOTP')
      if (actionValue.emailorsms == 'email') {
        this.generateOTPEmail(true);
      } else {
        this.generateOTP(true);
      }
    else if (actionValue.action == 'validateOTP') {
      if (this.isOtpLoading) {
        return;
      }
      this.isOtpLoading = true;
      this.otpErrorFailed = false;
      this.loginService
        .validateOTP(this.otpDetails.data.otpGuid, actionValue.otp, this.otpDetails.data.otpType)
        .subscribe(
          (user) => {
            this.isOtpLoading = false;
            let userDetails = JSON.parse(JSON.stringify(user));
            this.loginService.setLoginUserDetails(userDetails);
            this.settingService.setSessionStorageValue('isMenuHidden', true);
            this.authService.setLoggedInSession();
            if (SettingService.getApplicationPropertiesValue('LOGINDISCLAIMER') == 'YES') {
              this.authService.setDisclaimerInSession();
            }
            if (userDetails.data.servletPath != undefined && userDetails.data.servletPath != null) {
              this.router.navigate([userDetails.data.servletPath]);
            }
          },
          (error) => {
            console.log('otp validation failed!');
            console.log('Error:', error);
            this.isOtpLoading = false;
            this.otpErrorFailed = true;
          }
        );
    } else if (actionValue.action == 'getOTP') {
      this.generateOTP();
    } else if (actionValue.action == 'getOTPEmail') {
      this.generateOTPEmail();
    }
  }
}
