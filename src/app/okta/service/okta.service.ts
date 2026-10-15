import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/system-common/services/login.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OktaService extends LoginService {
  constructor(protected http: HttpClient, public settingService: SettingService) {
    // this.settingService.load();
    super(http, settingService);
  }

  protected handleForbiddenError(error: any): void {
    let msg =
      error.error != undefined
        ? error.error.message != undefined
          ? error.error.message
          : error.error
        : error.message;
    msg = msg.replace(/<[^>]*>|Error/g, '');
    // this.settingService.message = msg;
    // this.settingService.alertService.error(`${error.statusText}.  ${error.error}`, {
    //   autoClose: true,
    // });
    window.localStorage.setItem('ERRORMESSAGE', msg);
    this.settingService.logoutUser();
    // setTimeout(() => {
    //   this.settingService.logoutUser();
    // }, 3000);
  }

  /**
   * This handle error thrown by API calls. Based on the error status code it sets the message
   * or Redirect to login page
   * @param error expects the httperror given when the api call is failed.
   */
  public handleError(error: any): void {
    console.log('errrrrror:', error);
    // alert(`error status : ${error.url} ${error.status} ${error.statusText}`);
    switch (error.status) {
      case 401: //login
        let msg = error.error != undefined ? error.error : error.error;
        console.log('msg', msg.message);
        window.localStorage.setItem('ERRORMESSAGE', msg.message);
        try {
          if (msg) {
            const matched = msg.match(/<body[^>]*>([\s\S]*?)<\/body>/);
            console.log('matched', matched);
            msg = matched && matched.length > 1 ? matched[1] : '';
            console.log('msg 45', msg);
          }
          // alert(
          //     `${error.statusText}. Please Sign out and try again. \n ${error.error.message}`
          // );
          //this will be called when the account is locked or disabled or invalid id password or session expired.

          if (msg.indexOf('Invalid token or token expired') >= 0) {
            this.settingService.message = this.settingService.getLabelValue('SessionTimeoutErrMsg');
          } else {
            console.log('setting errormessage');
            // this.window.set
            window.localStorage.setItem('ERRORMESSAGE', msg);
            this.settingService.message = '';
          }
        } catch (e) {
          this.settingService.message = '';
        }

        this.settingService.logoutUser();
        // console.log(this.settingService.message);
        break;
      case 403: //forbidden
        //this will be called when the user does not have privilege to functionality.
        this.handleForbiddenError(error);
        break;
      case 404:
        console.log('Failed to load URL');
        break;
      case 500: //internal server error
        if (this.settingService.getApplicationMode() === 'offline') {
          alert('Internal server error. Please refresh and try again.');
        }
        this.settingService.alertService.error(
          `${error.statusText}. Please refresh and try again. \n ${
            SettingService.getApplicationPropertiesValue('ENVIRONMENT') !== 'PRODUCTION' ? error.error : ''
          }`,
          { autoClose: true }
        );
        break;
    }
  }
  public registerPinInDB(pin, reconfirmPin, userId) {
    let body = {
      userId: userId,
      pin: pin,
      reconfirmPin: reconfirmPin,
    };
    return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/registerPinForDevice`, body);
  }
}
