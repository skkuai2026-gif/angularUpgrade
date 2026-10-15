import { SettingService } from 'src/app/system-common/services/setting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import * as _moment from 'moment';
import imageCompression from 'browser-image-compression';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

declare const showSpinner: any;
declare const hideSpinner: any;
declare const setScrollAndScreenHeight: any;
declare const enableScroll: any;
@Injectable({
  providedIn: 'root'
})
export class ParentService {
  public id: number;
  public httpReq: { url: string; method: string; header: any; body?: any };
  private additionalData = new Map<String, Object>();
  /**
   * @ignore
   */
  public responseFieldChanged: Subject<any> = new Subject<any>();
  /**
   * @ignore
   */
  public isFormDirty = this.responseFieldChanged.asObservable();

  static apiCallGuidList: any[];

  constructor(
    protected settingService: SettingService,
    protected http: HttpClient
  ) {
    ParentService.apiCallGuidList = [];
  }

  /**
   * This handle error thrown by API calls. Based on the error status code it sets the message
   * or Redirect to login page
   * @param error expects the httperror given when the api call is failed.
   */
  public handleError(error: any): void {
    console.log('errrrrror:', error);
    // alert(`error status : ${error.url} ${error.status} ${error.statusText}`);

    let errorCode;

    if (this.settingService.getApplicationMode() === 'offline') {
      errorCode = error.status;
    } else {
      errorCode = error.error.errorCode;
    }

    switch (errorCode) {
      case 400:
        alert(
          "Sorry, there seems to be an issue.\n\nLet's try that again (400)."
        );
        break;
      case 401: //login
        let msg = error.error != undefined ? error.error : error.message;
        // alert(
        //     `${error.statusText}. Please Sign out and try again. \n ${error.error.message}`
        // );
        //this will be called when the account is locked or disabled or invalid id password or session expired.
        try {
          if (msg.indexOf('Invalid token or token expired') >= 0) {
            this.settingService.message = this.settingService.getLabelValue(
              'SessionTimeoutErrMsg'
            );
          } else {
            this.settingService.message = '';
          }
        } catch (e) {
          console.error('Error while processing token message:', e);
          this.settingService.message = '';
        }

        this.settingService.logoutUser();
        // console.log(this.settingService.message);
        break;
      case 403: //forbidden
        //this will be called when the user does not have privilege to functionality.
        // this.handleForbiddenError(error);
        if (
          error.error.message != undefined &&
          error.error.message != 'forbidden' &&
          this.settingService.getApplicationMode() === 'offline'
        ) {
          alert(error.error.message);
        } else {
          alert(
            'Unauthorized access.\n\nFor immediate assistance, you may contact Advisor Technology Support (ATS) at:\nHotline: (02) 8-849-9439 or (02) 8-555-8888 loc. 3000\nToll-Free: 1-800-10-8884003 or 1-800-10-8884004\nEmail: PHIL-ATS@sunlife.com\n(403)'
          );
        }
        break;
      case 404:
        console.log('Failed to load URL');
        alert(
          "We couldn't find what you're looking for.\n\nFor immediate assistance, you may contact Advisor Technology Support (ATS) at:\nHotline: (02) 8-849-9439 or (02) 8-555-8888 loc. 3000\nToll-Free: 1-800-10-8884003 or 1-800-10-8884004\nEmail: PHIL-ATS@sunlife.com\n(404)"
        );
        break;
      case 408:
        alert(
          "Sorry, there seems to be an issue.\n\nLet's try that again (408)."
        );
        break;
      case 500: //internal server error
        alert(
          "Sorry, there seems to be an issue.\n\nLet's try that again (500)."
        );
        // let errorMsg =
        //   this.settingService.getLabelValue('internalServerErrorText') === 'internalServerErrorText'
        //     ? `${this.settingService.getLabelValue(error.statusText)}.${this.settingService.getLabelValue(
        //         'refreshAndTryAgain'
        //       )} `
        //     : this.settingService.getLabelValue('internalServerErrorText');
        // errorMsg +=
        //   SettingService.getApplicationPropertiesValue('APP_ENVIRONMENT') !== 'PRODUCTION'
        //     ? `\n ${error?.error}`
        //     : '';
        // this.settingService.alertService.error(errorMsg, { autoClose: true });
        break;
      case 503:
        alert(
          "Sorry, there seems to be an issue.\n\nLet's try that again (503)."
        );
        break;
      case 504: //Application server is stopped
        alert(
          "Sorry, there seems to be an issue.\n\nLet's try that again (504)."
        );
        // alert(this.settingService.getLabelValue('gatewayError'));
        break;
    }
  }

  /**
   * Override this function if you want to redirect to some other screen/url.
   */
  protected handleForbiddenError(error: any): void {
    let msg = error.error != undefined ? error.error : error.message;
    msg = msg.replace(/<[^>]*>|Error/g, '');
    this.settingService.message = msg;
    this.settingService.alertService.error(
      `${error.statusText}.  ${error.error}`,
      {
        autoClose: true
      }
    );
    // setTimeout(() => {
    //   this.settingService.logoutUser();
    // }, 3000);
  }

  /**
   * @ignore
   */
  private checkOfflineURL(url: string): string {
    if (this.settingService.getApplicationMode() === 'offline') {
      // NONFACETOFACE: In Offline Angular, upon Revoke, all the logic is there in online so the URL returned by online had policySeq instead of object so replacing the same here so that case can be open in Offline Angular
      url = url.replace(/\/([^\/]*)$/, (match, lastPart) =>
        this.id !== undefined &&
        this.id != 0 &&
        !isNaN(lastPart) &&
        lastPart !== this.id.toString()
          ? `/${this.id.toString()}`
          : match
      );
      if (
        this.id !== undefined &&
        this.id != 0 &&
        this.id.toString().indexOf('.') == -1
      )
        url = url.replace('/' + this.id.toString(), '/' + this.id + '.0');
    }
    return url;
  }
  /**
   * @ignore
   */
  private getHeader(additionalHeaders?: {
    key: string;
    value: string;
  }): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    if (
      this.settingService.getSessionStorageValue('Token') != null &&
      this.settingService.getSessionStorageValue('Token') != undefined &&
      this.settingService.getSessionStorageValue('Token') != ''
    ) {
      headers = headers.append(
        'X-Auth-Token',
        this.settingService.getSessionStorageValue('Token')
      );
    }

    if (additionalHeaders && additionalHeaders != undefined) {
      headers = headers.append(additionalHeaders.key, additionalHeaders.value);
    }
    headers = this.settingService.addCustomHeaders(headers);
    return headers;
  }

  /**
   * This will call http post method for API call
   * @param url expects a string which will be api url e.g:  'http://localhost:4200/api/login/fetchAPIURL'
   * @param body expects a JSON object according to the api expectation
   * @param additionalHeaders is a optional param which expects additional headers
   * @param loader is a optional param which expects boolean value to display loader.
   * Value is always true.. this parameter is deprecated @see this.displayLoader
   * @param displayLoader is a optional param which expects boolean value to display loader icon. Default value is true
   * @returns the observable object from the api call
   */
  public httpPost(
    url: string,
    body: any,
    additionalHeaders?: { key: string; value: string },
    loader?: boolean,
    displayLoader?: boolean
  ): Observable<Object> {
    //start the loading icon
    let headers = this.getHeader(additionalHeaders);
    url = this.checkOfflineURL(url);
    let guid = this.generateGuid();
    this.displayLoader(loader, undefined, guid, displayLoader);
    let headerData = this.getAdditionalHeaderDetails(headers);

    this.httpReq = {
      url: url,
      header: headerData, //headers.keys(),
      method: 'POST',
      body: body
    };
    //console.log(this.httpReq);
    return this.http.post(url, body, { headers: headers }).pipe(
      finalize(() => {
        // stop the loading icon
        this.hideLoader(loader, undefined, guid, displayLoader);
      }),
      catchError((err) => {
        this.hideLoader(loader, undefined, guid, displayLoader);
        this.handleError(err);
        return throwError(err);
      })
    );
  }

  protected getAdditionalHeaderDetails(headers: HttpHeaders) {
    let headerData = {};
    headers.keys().filter((opt) => {
      headerData[opt] = headers.get(opt);
    });

    return headerData;
  }

  /**
   * This will call http put method for API call
   * @param url expects a string which will be api url e.g:  'http://localhost:4200/api/login/fetchAPIURL'
   * @param body expects a JSON object according to the api expectation
   * @param additionalHeaders is a optional param which expects additional headers
   * @param loader is a optional param which expects boolean value to display loader.
   * Default value is false
   * @returns the observable object from the api call
   */
  public httpPut(
    url: string,
    body: any,
    additionalHeaders?: { key: string; value: string },
    loader?: boolean
  ): Observable<Object> {
    let headers = this.getHeader(additionalHeaders);
    url = this.checkOfflineURL(url);
    let guid = this.generateGuid();
    this.displayLoader(loader, undefined, guid);

    let headerData = this.getAdditionalHeaderDetails(headers);
    this.httpReq = {
      url: url,
      header: headerData, //headers.keys(),
      method: 'PUT',
      body: body
    };
    //console.log(this.httpReq);
    //return this.http.put(url, body, { headers: headers });
    return this.http.put(url, body, { headers: headers }).pipe(
      finalize(() => {
        // stop the loading icon
        //console.log('before hiding loader', url);
        this.hideLoader(loader, undefined, guid);
      }),
      catchError((err) => {
        this.hideLoader(loader, undefined, guid);
        this.handleError(err);
        return throwError(err);
      })
    );
  }

  /**
   * This will call http put method for API call
   * @param url expects a string which will be api url e.g:'http://localhost:4200/api/login/fetchAPIURL'
   * @param additionalHeaders is a optional param which expects additional headers
   * @param loader is a optional param which expects boolean value to display loader.
   * Default value is false
   * @returns the observable object from the api call
   */
  public httpGet(
    url: string,
    additionalHeaders?: { key: string; value: string },
    loader?: boolean,
    raiseError: boolean = true
  ): Observable<Object> {
    let headers = this.getHeader(additionalHeaders);
    url = this.checkOfflineURL(url);
    let guid = this.generateGuid();
    this.displayLoader(loader, undefined, guid);
    let headerData = this.getAdditionalHeaderDetails(headers);
    this.httpReq = {
      url: url,
      header: headerData, //headers.keys(),
      method: 'GET'
    };
    //return this.http.get(url, { headers: headers });
    return this.http.get(url, { headers: headers }).pipe(
      finalize(() => {
        // stop the loading icon
        this.hideLoader(loader, undefined, guid);
      }),
      catchError((err) => {
        this.hideLoader(loader, undefined, guid);
        if (raiseError) this.handleError(err);
        return throwError(err);
      })
    );
  }
  /**
   * @ignore
   */
  public displayLoader(
    loader: boolean,
    buttonId?: string,
    guid?: string,
    displayLoader?: boolean
  ) {
    let isFreezeReq =
      SettingService.getApplicationPropertiesValue('ISFREEZEWINDOWONAPICALL') ==
      'YES'
        ? true
        : false;
    if (buttonId != undefined) {
      this.settingService.buttonid = buttonId;
      //if button id is passed indicates it is manually called from a specific api
      //and not called by system
      this.settingService.isLoadingManualTrigger = true;
    }
    if (loader != undefined) loader = true;
    else if (displayLoader != undefined) loader = displayLoader;
    this.settingService.isAPIcallInitiated = true;
    if (loader == undefined || loader == true) {
      if (buttonId == undefined) {
        ParentService.apiCallGuidList.push(guid);
      }
      if (
        $('.preLoader:visible').length == 0 &&
        this.settingService.buttonid == undefined
      ) {
        // Checking if freezepane is true we don't call showspinner as freezepane has its own spinner, otherwise two spinner will be displayed
        if (!isFreezeReq && !this.settingService.getFreezePane()) showSpinner();
        if (isFreezeReq) this.settingService.setFreezePane(true);
      }
      if (this.settingService.buttonid != undefined) {
        if (!isFreezeReq) hideSpinner();
        if (isFreezeReq) this.settingService.setFreezePane(true);
      } else {
        if (
          ParentService.apiCallGuidList.length > 0 &&
          !isFreezeReq &&
          !this.settingService.getFreezePane()
        ) {
          showSpinner();
        }
      }
    }
  }
  /**
   * @ignore
   */
  public hideLoader(
    loader: boolean,
    buttonId?: string,
    guid?: string,
    displayLoader?: boolean
  ) {
    let isFreezeReq =
      SettingService.getApplicationPropertiesValue('ISFREEZEWINDOWONAPICALL') ==
      'YES'
        ? true
        : false;
    if (
      ParentService.apiCallGuidList.length > 0 &&
      ParentService.apiCallGuidList.includes(guid)
    ) {
      ParentService.apiCallGuidList.splice(
        ParentService.apiCallGuidList.indexOf(guid),
        1
      );
      if (
        ParentService.apiCallGuidList.length > 0 &&
        !isFreezeReq &&
        !this.settingService.getFreezePane()
      ) {
        return;
      }
    }

    this.settingService.isAPIcallInitiated = false;
    if (!this.settingService.getFreezePane()) hideSpinner();
    if (this.settingService.getFreezePane() && isFreezeReq)
      this.settingService.setFreezePane(false);
    //if button id is passed and it was manually triggered earlier then only
    //clear out the button id
    if (buttonId != undefined && this.settingService.isLoadingManualTrigger) {
      this.settingService.buttonid = undefined;
      this.settingService.isLoadingManualTrigger = false;
    } else if (
      buttonId == undefined &&
      !this.settingService.isLoadingManualTrigger
    )
      this.settingService.buttonid = undefined;
    this.responseFieldChanged.next();
    if (displayLoader != undefined) loader = displayLoader;
    if (loader == undefined || loader == null || loader == true) {
      setTimeout(() => {
        setScrollAndScreenHeight();
        this.setFieldFocusForDisabledScroll();
      }, 5);
    }
  }

  /**
   * It will return label based on the labelKey
   * @param labelKey expects the string to extract from label List e.g: 'firstname2'
   * @returns It returns a string value from the given labelKey from label List
   */
  public getMultilingualLabel(labelKey: string): string {
    return this.settingService.getLabelValue(labelKey);
  }

  /**
   * It will return label based on the labelKey
   * e.g: service.getMultilingualMessage('deleteConfirmation',[tabItem.text])
   * @param labelKey expects the string to extract from label List e.g: 'firstname2'
   * @param args expects the array of string to replace from label List e.g: '['record']'
   * @returns It returns a string value from the given labelKey from label List
   */
  public getMultilingualMessage(labelKey: string, args: string[]): string {
    let message = this.settingService.getLabelValue(labelKey);
    let argLabelValue = null;
    let start = '{';
    let end = '}';
    if (args != null) {
      for (let i = 0; i < args.length; i++) {
        argLabelValue = this.settingService.getLabelValue(args[i]);
        let tempStr = start + (i + 1) + end;
        if (argLabelValue != null) {
          message = message.replace(tempStr, argLabelValue);
        }
      }
    }
    return message;
  }

  /**
   * This converts the string to date and returns the date
   * @param dateValue expects string date value
   * @returns the converted date in Date type. if datevalue is empty it returns undefined.
   */
  public getDate(dateValue: any): Date {
    // console.log(dateValue);
    if (dateValue === null || dateValue === undefined || dateValue === '')
      return undefined;
    let momentDate: Date = null;
    if (isNaN(dateValue)) {
      let symDateFormat = SettingService.getSystemDateFormat().replace(
        'dd',
        'DD'
      );
      let momentVariable = moment(dateValue, symDateFormat);
      momentDate = momentVariable.toDate();
    } else {
      let tempDt: any = dateValue;
      momentDate = new Date(tempDt);
    }
    return momentDate;
  }

  /**
   * This converts the string to date time and returns the date time
   * @param dateValue expects string date value
   * @returns the converted date in Date type. if datetime value is empty it returns undefined.
   */
  public getDateTime(dateValue: any): Date {
    // console.log(dateValue);
    if (dateValue == null) return undefined;
    let momentDate: Date = null;
    if (isNaN(dateValue)) {
      let symDateFormat =
        SettingService.getSystemDateFormat().replace('dd', 'DD') +
        ' ' +
        SettingService.getSystemTimeFormat();
      let momentVariable = moment(dateValue, symDateFormat);
      momentDate = momentVariable.toDate();
    } else {
      let tempDt: any = dateValue;
      momentDate = new Date(tempDt);
    }
    return momentDate;
  }

  /**
   * This will return encrypted Text from given Text based on the cryptoJS library.
   * @param Text expects the string Text
   * @returns encrypted Text
   */
  protected encryptText(text: string): string {
    let encryptedText = CryptoJS.AES.encrypt(text, 'SECRETKEY');
    return encryptedText.toString();
  }

  /**
   * This will return decrypted Text from given Text based on the cryptoJS library.
   * @param Text expects the string Text
   * @returns decrypted Text
   */
  protected decryptText(text: string): string {
    let decryptText = CryptoJS.AES.decrypt(text, 'SECRETKEY');
    return decryptText.toString(CryptoJS.enc.Utf8);
  }

  /**
   * It will return user login data from sessionStorage.
   * @returns It returns user login data from sessionStorage.
   */
  public getUserLoginData(): string {
    let userLoginData = undefined;
    try {
      var storage = window.sessionStorage;
      if (storage && storage.getItem('userLoginData') != undefined) {
        userLoginData = JSON.parse(storage.getItem('userLoginData'));
      }
    } catch (e) {
      alert(
        'Cannot use the system because Third-party cookies are blocked. Kindly enable them under Browser Settings --> Cookies  and try again.'
      );
    }
    return userLoginData;
  }

  /**
   * This compress the given image
   * @param imageFile expects the image to be compressed
   * @returns compressed image
   */
  async compressImage(imageFile: any) {
    //console.log(`Original Image Size ${imageFile.size / 1024 / 1024} MB`);
    let actualSize = imageFile.size / 1024 / 1024;
    let compressedFile = undefined;
    let maxSize =
      SettingService.getApplicationPropertiesValue('IMAGEMAXSIZECOMPRESS') !=
      undefined
        ? parseInt(
            SettingService.getApplicationPropertiesValue('IMAGEMAXSIZECOMPRESS')
          )
        : 5;

    if (actualSize > maxSize) {
      let maxHeightWidth =
        SettingService.getApplicationPropertiesValue('IMAGEMAXWIDTHNHEIGHT') !=
        undefined
          ? parseInt(
              SettingService.getApplicationPropertiesValue(
                'IMAGEMAXWIDTHNHEIGHT'
              )
            )
          : 1000;
      let options = {
        maxSizeMB: maxSize,
        maxWidthOrHeight: maxHeightWidth,
        useWebWorker: true,
        alwaysKeepResolution: true
      };
      try {
        this.displayLoader(true, null);
        console.log('Start time :', new Date());
        compressedFile = await imageCompression(imageFile, options);
        console.log('end time :', new Date());
        this.hideLoader(false, null);
        // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        // console.log(`Compressed Image Size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        return compressedFile;
      } catch (error) {
        console.error(error);
      }
    }
    return compressedFile;
  }

  /**
   * To set default focus to the page's first element
   */
  public setDefaultFocus(): void {
    if (this.settingService.getApplicationMode() !== 'offline')
      this.settingService.setDefaultFocus();
  }

  /**
   * To set focus on given id
   * @param id expects a string value of a given field.
   */
  public setFieldFocusForDisabledScroll(id?: string): void {
    let idVal =
      id != undefined
        ? id
        : this.settingService.selectedFieldID != undefined
        ? this.settingService.selectedFieldID
        : null;
    this.settingService.setFieldFocusForDisabledScroll(idVal);
    enableScroll();
  }

  /**
   *  function to set, get,remove additional data
   *
   */

  public getAdditionalData(key: String): Object {
    return this.additionalData.get(key);
  }

  public addAdditionalData(key: String, additionalData: Object): void {
    this.additionalData.set(key, additionalData);
  }

  public removeAdditionalData(key: String): void {
    this.additionalData.delete(key);
  }

  public setAdditionalData(additionalData: Map<String, Object>): void {
    this.additionalData = additionalData;
  }

  /**
   * This method generate random colors each time.
   * @returns random #colors to display.
   */
  public getRandomColor() {
    // let length = 6;
    // let chars = '0123456789ABCDE';
    let hex = '#' + Math.floor(Math.random() * 15777215).toString(16);
    // while (length--) hex += chars[(Math.random() * 16) | 0];
    /**
     * Label text should not be in white or black text e.g : fundlist label :
     */
    if (hex != '#FFFFFF' && hex != '#000000') return hex;
    else this.getRandomColor();
  }

  /**
   * This method returns assigned colors.
   */
  public getColor(): any[] {
    let pieColorArray = [
      '#E78AC3',
      '#8DA0CB',
      '#FC8D62',
      '#66C2A5',
      '#875656',
      '#FFA500',
      '#008000',
      '#FFD92F',
      '#800000',
      '#008080',
      '#C90076',
      '#0000FF',
      '#FF00FF',
      '#7FFFD4',
      '#FF7F50',
      '#A52A2A',
      '#09cd09',
      '#D1D115',
      '#DC143C',
      '#800080',
      '#DDBE5C',
      '#F798A9',
      '#B69BB6',
      '#7B0A7B',
      '#808000',
      '#0E6969',
      '#8B4500',
      '#501d81',
      '#e9097d',
      '#eacc70',
      '#BF4949',
      '#B78C5F',
      '#6AA84F',
      '#85C3CC',
      '#EF8516',
      '#8C8585'
    ];
    return pieColorArray;
  }

  generateGuid() {
    return (
      this.guidCreation() +
      this.guidCreation(true) +
      this.guidCreation(true) +
      this.guidCreation()
    );
  }

  private guidCreation(s?: boolean) {
    var p = (Math.random().toString(16) + '000000000').substr(2, 8);
    return s ? '' + p.substr(0, 4) + '' + p.substr(4, 4) : p;
  }

  public getUtcDateTime(dateValue: any): number {
    console.log('getUtcDateTime', dateValue);
    if (dateValue == null) return undefined;
    let momentDate: number = null;
    if (isNaN(dateValue)) {
      let symDateFormat = SettingService.getSystemDateFormat().replace(
        'dd',
        'DD'
      );
      let momentVariable = moment.utc(
        dateValue + ' 00:00:00',
        symDateFormat + ' HH:mm:ss'
      );
      console.log('momentVariable', momentVariable.utc().unix());
      momentDate = momentVariable.unix() * 1000;
      console.log('momentDate', momentDate);
    } else {
      let tempDt: any = dateValue;
      momentDate = new Date(tempDt).getTime();
    }
    return momentDate;
  }
  public setFormDirty(isDirty: boolean) {
    this.settingService.setFormDirty(isDirty);
  }
  public getFormDirty(): boolean {
    return this.settingService.getFormDirty();
  }
}
