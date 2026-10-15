import { BaseComponent } from 'src/app/system-common/base/base.component';
import { BaseService } from 'src/app/system-common/services/base.service';
import { SettingService } from './../services/setting.service';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sym-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OtpComponent extends BaseComponent<BaseService> {
  /**
   * This is provided so that the current service is accesible to the component to reload .
   * e.g : QuotationService
   */
  @Input() service: BaseService;
  @Input() otpType: string;
  @Input() entityGuid: string;
  @Input() isOtpButtonReq: boolean;
  @Input() getOTP: boolean;
  @Input() triggerOTPGeneration: boolean;
  @Input() displayPopupOnly: boolean;
  @Input() otpRecipientAddress: { emailId: any; mobileNumber: any };
  @Input() otpExpiryTimeInput: number;
  @Input() otpErrorFailed: boolean;
  @Output() isValidOtp = new EventEmitter<boolean>();
  public lastOtpType: 'sms' | 'email' = 'sms';
  @Output() otpActionClicked = new EventEmitter<{ action: string; otp: any; emailorsms: any }>();
  currentOTP: any = '';
  timeLeft: string;
  remaining: number;
  otpResend: boolean;
  otpError: boolean;
  otpExpiryTime: number;
  recipientAddress = { emailId: null, mobileNumber: null };
  // public isLoaderRequired: boolean = false;
  @Input() isLoaderRequired = false;
  public otpForm: UntypedFormGroup;
  public isEmailClicked: boolean = false;
  public SMSClicked: boolean = false;
  constructor(public settingService: SettingService, protected formBuilder: UntypedFormBuilder) {
    super(null);
    this.isOtpButtonReq = true;
    this.otpError = false;
    this.otpExpiryTime =
      SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME') != undefined
        ? parseInt(SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME'))
        : 60;
  }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.getOTP = this.getOTP != undefined ? this.getOTP : false;
  }

  ngAfterViewInit() {
    if (this.getOTP == false)
      setTimeout(() => {
        $('#txtemailOTP').focus();
      }, 10);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggerOTPGeneration'] && changes['triggerOTPGeneration'].currentValue && !this.isOtpButtonReq) {
      if (this.triggerOTPGeneration) {
        this.onClickOtpbutton();
      }
    }
    if (changes['displayPopupOnly'] && changes['displayPopupOnly'].currentValue) {
      setTimeout(() => {
        $('#otpPopup').show();
        // this.timer();
      }, 10);
    }

    if (changes['otpExpiryTimeInput'] && changes['otpExpiryTimeInput'].currentValue) {
      if (this.otpExpiryTimeInput != undefined) this.otpExpiryTime = this.otpExpiryTimeInput;
      this.timer();
    }

    if (changes['otpRecipientAddress'] && changes['otpRecipientAddress'].currentValue) {
      this.recipientAddress = this.otpRecipientAddress;
    }

    if (changes['otpErrorFailed'] && changes['otpErrorFailed'].currentValue) {
      if (this.otpErrorFailed) {
        this.currentOTP = '';
        this.otpError = true;
      }
    }
  }

  return() {
    return;
  }
  onClickOtpbutton(): void {
    setTimeout(() => {
      $('#otpPopup').show();
    }, 10);
    this.generateOTP();
    this.currentOTP = '';
  }

  public timer(): void {
    this.remaining = this.otpExpiryTime;
    let extrunTimer = setInterval(() => {
      if (this.remaining >= 1) {
        this.otpResend = false;
        let minutes: any = Math.floor(this.remaining / 60);
        let seconds: any = this.remaining % 60;

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        this.timeLeft = minutes + ':' + seconds;
        this.remaining -= 1;
      } else {
        this.otpResend = true;
        clearInterval(extrunTimer);
      }
    }, 1000);
  }

  public validateOTP(): void {
    if (this.service != undefined) {
      this.service.validateOTP(this.otpType, this.entityGuid, this.currentOTP).subscribe(
        (successResponse) => {
          if (successResponse['success'] == true) {
            this.closeModalSetup();
            this.isValidOtp.emit(true);
            console.log('Validate OTP successful.');
          } else {
            // alert(successResponse['message']);
            this.validateOTPFail();
          }
        },
        (error) => {
          this.validateOTPFail();
          console.log('Validate OTP failed.');
          console.log('Error:', error);
        }
      );
    } else {
      if (this.isLoaderRequired) {
        return;
      }

      this.isLoaderRequired = true;
      this.otpActionClicked.emit({
        action: 'validateOTP',
        otp: this.currentOTP,
        emailorsms: undefined,
      });
    }
  }

  private validateOTPFail() {
    this.currentOTP = '';
    this.otpError = true;
    this.isValidOtp.emit(false);
  }

  private generateOTP(): void {
    this.timer();
    this.otpError = false;
    let otpResponse: any;
    if (this.service != undefined) {
      this.service.generateOTP(this.otpType, this.entityGuid).subscribe(
        (successResponse) => {
          otpResponse = JSON.parse(JSON.stringify(successResponse));
          if (otpResponse != undefined && otpResponse.data.recipientAddressList != undefined) {
            if (otpResponse.data.recipientAddressList.EMAIL != undefined)
              this.recipientAddress.emailId = otpResponse.data.recipientAddressList.EMAIL;
            if (otpResponse.data.recipientAddressList.SMS != undefined)
              this.recipientAddress.mobileNumber = otpResponse.data.recipientAddressList.SMS;
          }
          console.log('Generate OTP successful.');
        },
        (error) => {
          console.log('Generate OTP failed.');
          console.log('Error:', error);
        }
      );
    } else {
      if (this.lastOtpType === 'email') {
        this.otpActionClicked.emit({ action: 'resendOTP', otp: undefined, emailorsms: 'email' });
      } else {
        this.otpActionClicked.emit({ action: 'resendOTP', otp: undefined, emailorsms: 'sms' });
      }
    }
  }
  public getOTPClickEmail(): void {
    console.log('getOTPClickEmail method click');
    this.recipientAddress.mobileNumber = undefined;
    console.log('this.recipientAddress.mobileNumber:', this.recipientAddress.mobileNumber);
    this.lastOtpType = 'email';
    $('#smsotpbutton').hide();
    setTimeout(() => {
      this.timer();
    }, 100);
    console.log('getOTPClickEmail');
    this.getOTP = false;
    this.otpActionClicked.emit({ action: 'getOTPEmail', otp: undefined, emailorsms: 'email' });
    setTimeout(() => {
      $('#txtemailOTP').focus();
    }, 3500);
    this.isEmailClicked = true;
  }

  public getOTPClick(isSMS: boolean): void {
    this.lastOtpType = 'sms';
    $('#emailotpbutton').hide();
    if (isSMS) {
      setTimeout(() => {
        // if (this.SMSClicked) {
        console.log('in if condition call 19999');
        this.timer();
        this.SMSClicked = true;
        // }
      }, 100);
    }
    console.log('getOTPClick');
    this.getOTP = false;
    this.otpActionClicked.emit({ action: 'getOTP', otp: undefined, emailorsms: 'sms' });
    setTimeout(() => {
      $('#txtemailOTP').focus();
    }, 3500);
    // this.SMSClicked=true;
    this.isEmailClicked = false;
  }

  public resendOTP(): void {
    this.generateOTP();
  }

  public closeModal(): void {
    this.closeModalSetup();
    this.isValidOtp.emit(false);
  }

  private closeModalSetup() {
    this.remaining = 0;
    $('#otpPopup').hide();
  }
}
