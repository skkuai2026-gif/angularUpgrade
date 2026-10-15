import { CustomURLEncoder } from './custom-url-encoder';
import { ParentService } from './parent.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SettingService } from './setting.service';
import { left } from '@popperjs/core';
declare const encryptValueCustom: any;
const RSA_KEY_encryptionExponent = '10001';
const RSA_KEY_modulus = '30db31542ace0f7d37a629ee5eba28cb';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends ParentService {
  public isBiometricsDone;
  constructor(protected http: HttpClient, public settingService: SettingService) {
    // this.settingService.load();
    super(settingService, http);
    this.isBiometricsDone = false;
  }

  /**
   * This will initialize and load languages
   * @returns JSON Object to load language list
   */
  public init(): Observable<Object> {
    return this.httpGet(`${this.settingService.getURLValue('LABEL')}/getAllLanguages`);
  }

  public getProposalVersion() {
    // return this.httpPost(`/api/RSloginSUNPH/validateTokeRS`, body, undefined, false);
    if (this.settingService.getApplicationMode() === 'offline') {
      return this.httpGet(`${this.settingService.getURLValue('LOGIN')}/getProposalVersion`);
    } else {
      return this.httpGet(`/api/RSloginSUNPH/getProposalVersion`);
    }
  }

  /**
   *
   * @param id expects login User ID
   * @param password expects Login User Password
   * @param language expects Language
   * this method is used to call validate login.
   */
  public process(
    userId: string,
    password: string,
    language: string,
    token?: string,
    useCase?: string
  ): Observable<Object> {
    if (this.settingService.getApplicationMode() === 'offline') {
      // return this.loginOffline(userId, password, language);
      return this.loginOffline(userId, password, language, token, useCase);
    } else {
      return this.loginOnline(userId, password, language, token, useCase);
    }
  }

  /**
   * @ignore
   */
  private loginOffline(userId: string, password: string, language: string, token?: string, useCase?: string) {
    let encryptPassword = password;
    if (this.isBiometricsDone == undefined || this.isBiometricsDone != true) {
      encryptPassword = encryptValueCustom(password, RSA_KEY_encryptionExponent, RSA_KEY_modulus);
    }

    let body = {
      userId: userId,
      regPass: encryptPassword,
      language: language,
      accessToken: token,
      refreshToken: useCase,
    };
    return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/login`, body);
  }

  /**
   * @ignore
   */
  private loginOnline(userId: string, password: string, language: string, token?: string, useCase?: string) {
    console.log('Password-', password);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    if (token != undefined) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Auth-Token': token,
        }),
      };
    }
    httpOptions.headers = this.settingService.addCustomHeaders(httpOptions.headers);
    let httpParam = new HttpParams({ encoder: new CustomURLEncoder() })
      .set('userId', this.encryptText(userId))
      .set('password', this.encryptText(password))
      .set('enc', 'YES')
      .set('login_type', 'AGENT')
      .set('language', language);
    if (useCase != undefined && useCase != '') {
      Object.assign(httpParam, httpParam.append('useCase', useCase));
    }
    //console.log('httpParam-', httpParam);
    return this.http.post(`${this.settingService.getURLValue('LOGIN')}`, httpParam, httpOptions);
  }

  /**
   *
   * @param newPassword expects new password to set
   * @param confirmPassword expects same passowrd entered in the new password from the user
   * @param oldPassword expects the old password
   * @returns
   */
  public changePassword(newPassword: string, confirmPassword: string, oldPassword: string) {
    let params = {
      confirmPassword: this.encryptText(confirmPassword),
      password: this.encryptText(newPassword),
      oldPassword: this.encryptText(oldPassword),
    };

    return this.httpPost(`${this.settingService.getURLValue('PASSWORD')}/change`, params, undefined, true);
  }

  /**
   * Set the login details in session based on the parameter passed
   * @param userDetails expects userdetail JSON with its properties.
   * @param userId expects user id from login. It's a optional parameter.
   * @param language expects the language if any. It's a optional parameter.
   */
  public setLoginUserDetails(userDetails: any, userId?: any, language?: any) {
    if (userId != undefined) {
      this.settingService.setSessionStorageValue('USER', JSON.stringify(JSON.parse(JSON.stringify(userId))));
      this.settingService.setSessionStorageValue('language', language);
    } else {
      this.settingService.setSessionStorageValue('USER', JSON.stringify(userDetails.data.UserId));
      //console.log('data of user after login:' + userDetails.data);
      this.settingService.setSessionStorageValue('language', userDetails.data.Language);
    }

    // this.settingService.getLabelValue(language);
    // console.log(this.settingService.applicationProperties)
    /**commented for committing v16 */
    // userDetails.data.ApplicationProperties['CALENDARLANG'] = 'zh-Hans';
    SettingService.applicationProperties = userDetails.data.ApplicationProperties;
    if (userDetails.data.Token && userDetails.data.Token != undefined) {
      this.settingService.setSessionStorageValue('Token', userDetails.data.Token);
    }

    this.settingService.setSessionStorageValue(
      'applicationProperties',
      JSON.stringify(JSON.parse(JSON.stringify(SettingService.applicationProperties)))
    );

    if (userDetails.data.userType != undefined) {
      this.settingService.setSessionStorageValue('userType', userDetails.data.userType);
    }
    if (userDetails.data.userLoginData != undefined) {
      this.settingService.setSessionStorageValue('userLoginData', JSON.stringify(userDetails.data.userLoginData));
    }
    this.settingService.setSessionStorageValue('firstReloadURL', false);

    // SettingService.applicationProperties['CALENDARLANG'] = 'zh-Hans';
    this.settingService.load();
  }

  /**
   * This encrypts and generate the otp for the user.
   * @param guid expects the encrypted guid
   */
  public getEncryptOTP(guid: string, isResendOtp: boolean): Observable<Object> {
    let body = {};

    if (isResendOtp != undefined) {
      body = {
        guid: guid,
        emailOrSms: 'sms',
        isResendOtp: isResendOtp,
      };
    } else {
      body = {
        guid: guid,
        emailOrSms: 'sms',
      };
    }
    return this.httpPost(`/api/RSloginSUNPH/encryptotpEmail`, body, undefined, false);
    // return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/encryptotp`, body, undefined, true);
  }
  public getEncryptOTPEmail(guid: string, isResendOtp: boolean): Observable<Object> {
    let body = {};

    if (isResendOtp != undefined) {
      body = {
        guid: guid,
        emailOrSms: 'email',
        isResendOtp: isResendOtp,
      };
    } else {
      body = {
        guid: guid,
        emailOrSms: 'email',
      };
    }
    return this.httpPost(`/api/RSloginSUNPH/encryptotpEmail`, body, undefined, false);

    // return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/encryptotpEmail`, body, undefined, true);
  }

  /**
   * Get label value of specific label keys
   * @param labelKeyList .list of label keys
   */
  public getLabels(labelKeyList: any): Observable<Object> {
    let body = {
      labelKeyList: labelKeyList,
    };
    return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/getLabels`, body, undefined, true);
  }

  /**
   * Get lookup data list of specific lookup keys
   * @param lookupKeyList .list of label keys
   */
  public getLookupData(lookupKeyList: any): Observable<Object> {
    let body = {
      lookupKeyList: lookupKeyList,
    };
    return this.httpPost(`${this.settingService.getURLValue('LABEL')}/getLookupData`, body, undefined, true);
  }

  /**
   *
   * @param otpGuid
   * @param otp
   * @param otpType
   * @returns
   */
  public validateOTP(otpGuid: any, otp: any, otpType: any) {
    let params = new HttpParams({
      fromObject: {
        otpGuid: otpGuid,
        otp: otp,
        otpType: otpType,
      },
    });
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    httpOptions.headers = this.settingService.addCustomHeaders(httpOptions.headers);
    return this.http.post(`${this.settingService.getURLValue('LOGIN')}/validateOTP`, params, httpOptions);
  }

  /**
   * This fetches the Recipient Data of the user.
   * @param guid expects the encrypted guid
   */
  public getOTPRecipientData(guid: string): Observable<Object> {
    let body = {
      guid: guid,
    };
    return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/getOTPRecipientData`, body, undefined, true);
  }
  public loginWithPin(advisorCode, pin) {
    let body = {
      advisorCode: advisorCode,
      pin: pin,
    };
    return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/loginWithPin`, body, undefined, true);
  }
  public getDisclaimerShow(agentID) {
    let body = {
      agentID: agentID,
    };
    return this.httpPost(`/api/RSloginSUNPH/disclaimerShow`, body, undefined, false);
  }
  public getResponseAndAppClose() {
    // console.log("login service.ts*******");
    if (this.settingService.getApplicationMode() === 'offline') {
      // console.log("inside***")
      return this.httpGet(`${this.settingService.getURLValue('LOGIN')}/getResponseAndAppClose`);
    }
  }
  public acceptLoginDisclaimer(acceptedResponse: string): Observable<any> {
    const body = {
      acceptedResponse: acceptedResponse,
    };
    return this.httpPost(
      `${this.settingService.getURLValue('LOGIN')}/acceptLoginDisclaimer`,
      body,
      undefined,
      true
    );
  }
}
