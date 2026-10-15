import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// import * as data from '../../../assets/config/url-config.json';
import data from '../../../assets/config/url-config.json';
import * as offlineConfig from '../../offline/offline-config.json';
import { DatePipe } from '@angular/common';
import { AlertService } from './alert.service';
import { Title } from '@angular/platform-browser';
import { CustomFormatPipe } from '../pipe/custom-format.pipe';
import { setLanguage } from '@ui5/webcomponents-base/dist/config/Language.js';
declare const hideLoader: any;
declare const isMobileCheck: any;
declare const isLandscapeMode: any;
declare const setDefaultFocus: any;
declare const setScrollFocus: any;
// declare const loadScrollbar: any;

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  public isConnected!: boolean;
  public isOktaLogin!: boolean;
  public baseURL;
  private commonLabels;
  public urlList;
  public static applicationProperties;
  private mode;
  public isRhosimulator;
  public buttonid;
  public isLoadingManualTrigger: boolean;
  public message;
  public isNewUIDisplayed: boolean;
  public isLabelLoaded: boolean;
  private isFreezePane: boolean;
  public selectedFieldID: string;
  private windowWidth;
  private windowHeight;
  private zoomResolution;
  private static injector: Injector;
  isLoadLabelsInvoked;
  isAPIcallInitiated: boolean;
  private baseURLDetails: any;
  OfflineConfigs: any;
  private static appTitle: string;
  private isFormDirty: boolean;
  private sym_error_seperator: string;

  constructor(
    private http: HttpClient,
    public router: Router,
    public authService: AuthService,
    public datepipe: DatePipe,
    public alertService: AlertService,
    public customFormatPipe: CustomFormatPipe,
    private titleService: Title
  ) {
    this.isLoadLabelsInvoked = false;
    this.isNewUIDisplayed = false;
    this.isLabelLoaded = false;
    this.isFreezePane = false;
    SettingService.appTitle = this.titleService.getTitle();
    this.isFormDirty = false;
  }

  async loadBasicDetails() {
    const url: any = (data as any).default ?? data;
    this.baseURLDetails = url[0];
    this.OfflineConfigs = offlineConfig;
    await this.loadInit();
  }

  /**
   * This is a async call which initalize the application loading the baseURL, urlList, commonLabels, and applicationProperties.
   */
  public async init() {
    /**
     * Uncomment the below to use in v14 and above
     */
    await this.loadBasicDetails();
    /**
     * Comment the below to use in v10
     */
    // this.baseURLDetails = data[0];
    // this.loadInit();
  }
  /**
   * This is a async call which initalize the application loading the baseURL, urlList, commonLabels, and applicationProperties.
   */
  public async loadInit() {
    // this.baseURLDetails = data[0];
    this.OfflineConfigs = offlineConfig;
    this.isRhosimulator = this.OfflineConfigs.isRhosimulator;
    this.mode = this.baseURLDetails.applicationMode;

    if (this.OfflineConfigs.isRhosimulator === true || this.baseURLDetails.applicationMode === 'online') {
      this.baseURL = this.baseURLDetails.baseURL;
      await this.load();
    }
  }

  /**
   *  This is a async call which loads the application's urlList, commonLabels, and applicationProperties
   */
  async load(): Promise<void> {
    this.urlList = await this.loadURLList();

    this.commonLabels = await this.loadLabels();
    // this.commonLabels = undefined;
    if (
      sessionStorage.length != 0 &&
      this.getSessionStorageValue('applicationProperties') !== undefined &&
      this.getSessionStorageValue('applicationProperties') != null &&
      this.getSessionStorageValue('applicationProperties') != '{}'
    ) {
      SettingService.applicationProperties = JSON.parse(this.getSessionStorageValue('applicationProperties'));
      if (this.displayNewUI() && !this.isCustomerPortal()) {
        this.isNewUIDisplayed = this.displayNewUI();
        this.loadExternalStyle('new_ui_styles.css');
      }
      // if (SettingService.getApplicationPropertiesValue('SYM_WEB_TITLE') != undefined)
      //   this.titleService.setTitle( SettingService.getApplicationPropertiesValue( 'SYM_WEB_TITLE' ) );
    } else {
      //this.router.navigate(['login']);
    }
    // if (
    //   sessionStorage.length != 0 &&
    //   this.getSessionStorageValue('userLoginData') !== undefined &&
    //   this.getSessionStorageValue('userLoginData') != null &&
    //   this.getSessionStorageValue('userLoginData') != '{}'
    // ) {
    //   this.loadExternalStyle(
    //     JSON.parse(this.getSessionStorageValue('userLoginData'))['AgentId'] + '_styles.css',
    //     'assets/theme/company/css'
    //   );
    // }
    let language: string;
    if (SettingService.applicationProperties != undefined)
      language =
        SettingService.applicationProperties != undefined &&
        SettingService.applicationProperties['CALENDARLANG'] != undefined
          ? SettingService.applicationProperties['CALENDARLANG']
          : 'en';

    if (language != undefined && language != 'en') {
      setLanguage(language);
      // Removed in v17. Testing is pending for all calendar types
      // if (this.settingService.getSessionStorageValue('firstReloadURL') === 'false') {
      //   this.settingService.setSessionStorageValue('firstReloadURL', true);
      //   window.location.reload();
      // }
    }
  }

  /**
   * This is a async call which load the urlList
   * @returns JSON object which contains key value pair for urlList.
   */
  async loadURLList(): Promise<any[]> {
    try {
      let fetchController = 'login';
      if (this.baseURLDetails != undefined && this.baseURLDetails.applicationMode === 'offline') {
        fetchController = 'AgentReg';
      }
      let headers =
        // sessionStorage.getItem('Token') != null &&
        // sessionStorage.getItem('Token') != undefined &&
        // sessionStorage.getItem('Token') != ''
        //     ? new HttpHeaders()
        //           .set('Content-Type', 'application/json')
        //           .set('Accept', 'application/json')
        //           .set('X-Auth-Token', sessionStorage.getItem('Token'))
        // :
        new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');

      headers = this.addCustomHeaders(headers);
      let response = await this.http
        .get(`${this.baseURLDetails.baseURL}${fetchController}/fetchAPIURL`, {
          headers: headers,
        })
        .toPromise();
      return response['data'].restAPIURL;
    } catch (error) {
      await this.settingshandleErrors(error);
    }
  }

  /**
   * @ignore
   */
  private async settingshandleErrors(error: any, isLogOutReq?: boolean) {
    if (
      this.urlList == null ||
      this.urlList == undefined ||
      (this.urlList != undefined && this.urlList.length == 0)
    ) {
      if (this.baseURLDetails.applicationMode === 'online') {
        this.message = 'Please check your connection';
      }
      if (this.baseURLDetails != undefined && this.baseURLDetails.applicationMode === 'offline') {
        await this.load();
      }
    }

    isLogOutReq = isLogOutReq == undefined ? true : isLogOutReq;
    hideLoader();
    console.log('errrrrror:', error);
    switch (error.status) {
      case 401:
        let msg = error.error != undefined ? error.error : error.message;
        msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
        if (msg.indexOf('Invalid token or token expired') >= 0) {
          this.message = this.getLabelValue('SessionTimeoutErrMsg');
        } else {
          this.message = '';
        }

        if (isLogOutReq) this.logoutUser();
        // console.log(this.settingService.message);
        break;
      case 403:
        if (error.error.message == 'Invalid token or token expired') {
          this.message = this.getLabelValue('SessionTimeoutErrMsg');
        } else {
          this.message = '';
        }
        if (isLogOutReq) this.logoutUser();

        break;
      case 404:
        this.message = 'Failed to load URL';
        break;
      case 500: //internal server error
        alert(`${error.statusText}. Please refresh and try again. \n ${error.error}`);
        break;
      case 504:
        // if (error.error.message == 'Invalid token or token expired') {
        this.message = error.statusText + '. Error occured while trying to reach proxy';
        // } else {
        //   this.message = '';
        // }
        isLogOutReq = true;
        break;
    }
  }

  /**
   *
   * @param pageTitle Set the title of the web browser for the current page
   */
  public setPageTitle(pageTitle: string): void {
    let finalPageTtl =
      pageTitle == undefined || pageTitle == ''
        ? SettingService.appTitle
        : SettingService.appTitle + ' - ' + pageTitle;
    this.titleService.setTitle(finalPageTtl);
  }
  /**
   * It will return url from the urlList based on the urlKey
   * @param urlKey expects the string to extract from urlList e.g: 'LABEL'
   * @returns It returns a string value from the given urlKey from urlList
   */
  public getURLValue(urlKey: string): string {
    let url = '';
    if (this.urlList == undefined) {
      // console.log(this);
      setTimeout(() => {
        this.load();
        if (this.urlList != undefined) {
          url = this.urlList[urlKey];
          return url;
        }
      }, 25);

      return '';
    }
    url = this.urlList[urlKey];
    return url;
  }

  private async loadLabels(selectedLanguage?: string): Promise<any[]> {
    //for online invoke this api only if token is present since gives error otherwise
    //for offline token is not required
    let invokeAPI = false;
    if (this.mode === 'offline' || this.getSessionStorageValue('Token') != undefined) invokeAPI = true;
    if (invokeAPI) {
      try {
        let headers: HttpHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');
        if (this.getSessionStorageValue('Token') != undefined) {
          headers = headers.append('X-Auth-Token', this.getSessionStorageValue('Token'));
        }
        headers = this.addCustomHeaders(headers);
        let lang = selectedLanguage != undefined ? selectedLanguage : this.getLanguageSelected();
        let response = null;
        if (lang != undefined && lang != null) {
          response = await this.http
            .get(`${this.getURLValue('LABEL')}?lang=` + lang, {
              headers: headers,
            })
            .toPromise();
        } else {
          response = await this.http
            .get(`${this.getURLValue('LABEL')}`, {
              headers: headers,
            })
            .toPromise();
        }
        if (selectedLanguage != undefined) {
          this.setSessionStorageValue('language', selectedLanguage);
        }
        if (response['data'] != undefined) {
          this.isLabelLoaded = true;
        }
        return response['data'].labels as any[];
      } catch (error) {
        await this.settingshandleErrors(error);
      }
    }
  }

  /**
   * It will return label from the commonLabels based on the labelKey
   * @param labelKey expects the string to extract from commonLabels e.g: 'firstname2'
   * @param isActualLabelValReq expects booelan value to get actual label value not label key
   * @returns It returns a string value from the given labelKey from commonLabels
   */
  public getLabelValue(labelKey: string, isActualLabelValReq?: boolean): string {
    isActualLabelValReq = isActualLabelValReq != undefined ? isActualLabelValReq : false;
    if ((this.commonLabels == undefined || this.commonLabels == null) && !this.isLoadLabelsInvoked) {
      this.reloadLabels();
    }
    let labelValue = '';

    labelValue = this.commonLabels == undefined ? '' : this.commonLabels[labelKey];
    // console.log(this.commonLabels);
    if (!isActualLabelValReq) {
      if (labelValue == '' || labelValue == undefined) labelValue = labelKey;
    }
    return labelValue;
  }

  /**
   * This reloads the labels.
   */
  async reloadLabels() {
    this.isLoadLabelsInvoked = true;
    this.commonLabels = await this.loadLabels();
  }

  /**
   * This logout's the current user.
   */
  public async logoutUser() {
    if (this.displayNewUI()) this.removeExternalStyle('new_ui_styles.css');
    if (this.isCustomerPortal()) this.removeExternalStyle('customer_styles.css');
    if (
      sessionStorage.length != 0 &&
      this.getSessionStorageValue('userLoginData') !== undefined &&
      this.getSessionStorageValue('userLoginData') != null &&
      this.getSessionStorageValue('userLoginData') != '{}'
    )
      this.removeExternalStyle(
        JSON.parse(this.getSessionStorageValue('userLoginData'))['AgentId'] + '_styles.css'
      );
    if (this.mode == 'online') {
      this.logoutOnline().subscribe(
        (successResponse) => {
          this.authService.logoutUser();
          this.setPageTitle('');
          console.log(successResponse);
          this.isLabelLoaded = false;
        },
        (error) => {
          this.authService.logoutUser();
          this.settingshandleErrors(error, false);
          // alert(`${error.statusText}. Error signing out. ${error.message} `);
          console.log('Error:', error);
        }
      );
    } else {
      this.authService.logoutUser();
    }
  }

  private logoutOnline(): Observable<Object> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Token', this.getSessionStorageValue('Token'));
    let body = {};
    return this.http.post(`${this.getURLValue('LOGIN')}/signOut`, body, {
      headers: headers,
    });
  }

  /**
   * This will return the selected language, string from session storage
   * @returns a string that is selected at the login.
   */
  public getSelectedLanguage(): string {
    return this.getSessionStorageValue('language');
  }

  /**
   * It will return applicationProperty fromt the applicationProperties based on the applicationKey
   * @param applicationKey expects the string to extract from applicationProperties e.g: 'dateformat'
   * @returns It returns a string value from the given applicationKey from applicationProperties
   */
  public static getApplicationPropertiesValue(applicationKey: string): string {
    //if undefined then get from session .. if not in session then get from API.
    if (SettingService.applicationProperties == undefined || SettingService.applicationProperties == null) {
      //this.router.navigate(['login']);
      try {
        var storage = window.sessionStorage;
        if (storage && storage.getItem('applicationProperties') != undefined) {
          SettingService.applicationProperties = JSON.parse(storage.getItem('applicationProperties'));
        }
      } catch (e) {
        alert(
          'Cannot use the system because Third-party cookies are blocked. Kindly enable them under Browser Settings --> Cookies  and try again.'
        );
      }
    }

    let applicationValue = undefined;

    //applicationValue = JSON.parse(SettingService.applicationProperties)[applicationKey];
    if (SettingService.applicationProperties != undefined)
      applicationValue = SettingService.applicationProperties[applicationKey];
    //alert(applicationKey + ': ' + applicationValue);
    // if (applicationValue == '' || applicationValue == undefined) applicationValue = applicationKey;
    return applicationValue;
  }

  /**
   * This will return the selected language, string from session storage
   * @returns a string that is selected at the login or default value 'EN'
   */
  getLanguageSelected(): string {
    return sessionStorage.length != 0 &&
      this.getSessionStorageValue('language') !== undefined &&
      this.getSessionStorageValue('language') != null
      ? this.getSessionStorageValue('language')
      : 'EN';
  }

  async setLanguage(selectedLanguage: string) {
    this.commonLabels = await this.loadLabels(selectedLanguage);
  }

  /**
   * This will set session variable based on the key.
   * @param key expects a value which will be the key to setItem in session variable.
   * @param value to be set in the said key in session storage
   */
  setSessionStorageValue(key: string, value: any): void {
    sessionStorage.setItem(key, value);
  }

  /**
   * This will get session variable based on the key.
   * @param key expects a value which will be the key to getItem from session variable.
   */
  getSessionStorageValue(key: string): any {
    return sessionStorage.length != 0 &&
      sessionStorage.getItem(key) !== undefined &&
      sessionStorage.getItem(key) != null
      ? sessionStorage.getItem(key)
      : undefined;
  }

  /**
   * This will remove session variable based on the key.
   * @param key expects a value which will be the key to remove Item in session variable.
   */
  removeSessionStorage(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * This check if the app is opened in mobile or dekstop.
   * @returns boolean value. It returns true if its opened in mobile else it will return false.
   */
  public isMobileViewRendered(): boolean {
    // console.log(isMobileCheck());
    let isLandscape = isLandscapeMode();
    let isMobile = isMobileCheck();
    // if (isMobile && !isLandscape) {
    //   return true;
    // }
    // console.log(isLandscape);
    if (isMobile) {
      return true;
    }
    return false;
    // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  /**
   * This check if the app is opened in mobile or dekstop.
   * @returns boolean value. It returns true if its opened in mobile and is in landscape mode
   * else it will return false.
   */
  public isLandScapeViewRendered(): boolean {
    // console.log(isMobileCheck());
    let isLandscape = isLandscapeMode();
    let isMobile = isMobileCheck();
    if (isMobile && isLandscape) {
      return true;
    }
    return false;
  }

  /**
   * This checks if the user is logged in or not.
   * @returns boolean value true or false.
   */
  isUserLoggedIN(): boolean {
    return this.authService.isUserLoggedIn();
  }

  /**
   * This checks if the menu is hidden or displayed.
   * @returns boolean value true or false.
   */
  isMenuHidden(): boolean {
    return this.authService.isMenuHidden();
  }

  /**
   * This refresh the page with-out reloading the page
   */
  reloadCurrentRoute(url?: any): void {
    let currentUrl = url != undefined && url != '' ? url : this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
      // console.log(currentUrl);
    });
  }

  /**
   * This set additional labels
   * @param labels list of key and value needs to be passed here.
   */
  async setAdditionalLabels(labels: any) {
    if (this.urlList == undefined || this.commonLabels == undefined) {
      await this.load();
    }
    setTimeout(() => {
      this.commonLabels = labels;
    }, 5);
  }

  /**
   * This returns the current system formatted date
   * @param dateObj expects the date object
   * @returns formatted string based on the system date
   */
  public getDateFormatted(dateObj: Date): string {
    let symDateFormat = SettingService.getApplicationPropertiesValue('dateformat');
    return this.datepipe.transform(dateObj, symDateFormat);
  }

  /**
   * This method checks if given css file exists or not.
   * @param fileName expects file name in string format. e.g: customer
   * @returns true if file exists else returns false.
   */
  private checkCSSFileExists(fileName: string, path?: string): Observable<boolean> {
    return this.http
      .get(path != undefined ? `${path}/${fileName}` : `assets/theme/css/${fileName}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        map(() => {
          return true;
        }),
        catchError((_error) => {
          return of(false);
        })
      );
  }

  /**
   * This loads css file dynamically
   * @param fileName expects the file name. e.g: customer_styles.css
   */
  public loadExternalStyle(fileName: string, path?: string) {
    let file = fileName.toLowerCase();
    this.checkCSSFileExists(file, path).subscribe(
      (data) => {
        if (data) {
          const head = document.getElementsByTagName('head')[0];
          let themeLink = document.getElementById(file) as HTMLLinkElement;
          if (themeLink) {
            themeLink.href = file;
          } else {
            const style = document.createElement('link');
            style.id = file;
            style.rel = 'stylesheet';
            style.href = `${file}`;
            head.appendChild(style);
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * This checks if user logged in customer or not.
   * @returns true if usertype is CUSTOMER, default vlaue is false.
   */
  isCustomerPortal(): boolean {
    return this.getSessionStorageValue('userType') != undefined &&
      (this.getSessionStorageValue('userType') == 'CUSTOMER' || this.getSessionStorageValue('userType') == 'BANK')
      ? true
      : false;
  }

  /**
   * This checks if user logged in bank user or not.
   * @returns true if usertype is BANK, default vlaue is false.
   */
  isBankPortal(): boolean {
    return this.getSessionStorageValue('userType') != undefined &&
      this.getSessionStorageValue('userType') == 'BANK'
      ? true
      : false;
  }

  /**
   * Refresh or reloads the scroll applied.
   * @param classname expects a class name where custom scroll is applied. e.g: '.scrollDiv'
   */
  // loadScroll(classname?: string) {
  //   setTimeout(() => {
  //     loadScrollbar($(classname != undefined ? classname : '.scrollDiv'));
  //   }, 20);
  // }

  removeExternalStyle(fileName: string) {
    let file = fileName.toLowerCase();
    $('link[rel=stylesheet][href~="' + file + '"]').remove();
  }

  /**
   * This checks if application property has UI_FIELD_DISPLAY_NEW with value 'YES'.
   * @returns true if UI_FIELD_DISPLAY_NEW is "YES", default vlaue is false.
   */
  displayNewUI(): boolean {
    return SettingService.getApplicationPropertiesValue('UI_FIELD_DISPLAY_NEW') != undefined &&
      SettingService.getApplicationPropertiesValue('UI_FIELD_DISPLAY_NEW') == 'YES'
      ? true
      : false;
  }

  /**
   * This method expects HTML infused text and removes all the tags.
   * @param htmlString expects string value with HTML tags
   * @returns plain string is returned with removed HTML tags from the string.
   */
  public extractHTML(htmlString: string): string {
    htmlString = htmlString.replace(/(<([^>]+)>)/gi, '');
    htmlString = htmlString.replace('&amp;', ' ').replace('&quot;', ' ');

    return htmlString;
  }

  /**
   * Sets Default focus to the first field available
   */
  public setDefaultFocus(): void {
    if (this.getApplicationMode() !== 'offline') setDefaultFocus();
  }

  /**
   * Set focus on a given ID directly
   * @param id expects string vlaue
   */
  public setFieldFocusForDisabledScroll(id?: string): void {
    let idVal = id != undefined ? id : this.selectedFieldID != undefined ? this.selectedFieldID : null;
    setScrollFocus(idVal);
    this.selectedFieldID = undefined;
  }
  /**
   * Adds custom headers_ from urlconfig.json
   * @param headers - Existing headers to which custom headers needs to be appended
   * @returns - the header object with custom header properties added
   */
  public addCustomHeaders(headers: HttpHeaders): HttpHeaders {
    if (this.baseURLDetails.addtnlHeader != undefined) {
      Object.keys(this.baseURLDetails.addtnlHeader).forEach((newkey) => {
        headers = headers.append(newkey, this.baseURLDetails.addtnlHeader[newkey]);
      });
    }
    return headers;
  }

  public getFreezePane(): boolean {
    return this.isFreezePane;
  }

  public setFreezePane(freezePane: boolean): void {
    this.isFreezePane = freezePane;
  }
  /**
   * when we resize window, it will return the window width and height.
   * @returns - Numeric value.
   */
  public getZoomResolution(): number {
    return this.zoomResolution;
  }
  public getWindowWidth(): number {
    return this.windowWidth;
  }

  public getWindowHeight(): number {
    return this.windowHeight;
  }
  /**
   * when we resize window, it will set the window width and height.
   */
  public setWindowWidth(window, width?: number): void {
    this.zoomResolution = ((window.outerWidth - 10) / window.innerWidth) * 100;
    this.windowWidth = window.innerWidth;
    if (width != undefined) {
      this.windowWidth = width;
    }
  }

  public setWindowHeight(height: number): void {
    this.windowHeight = height;
  }

  getApplicationMode(): string {
    return this.mode;
  }

  /**
   * Static method to get the default System Date format
   * @returns default date format in string value
   */
  static getSystemDateFormat(): string {
    var dateFormat = 'DD/MM/YYYY';
    let dateFormatA = SettingService.getApplicationPropertiesValue('dateformat');
    //need to replace with capital since date picker expects it that way
    if (dateFormatA != undefined) dateFormat = dateFormatA;
    return dateFormat;
  }

  /**
   * Static method to get the default System Time format
   * @returns default time format in string value
   */
  static getSystemTimeFormat(): string {
    var timeFormat = 'HH:mm:ss';
    let timeFormatA = SettingService.getApplicationPropertiesValue('timeformat');
    //need to replace with capital since date picker expects it that way
    if (timeFormatA != undefined) timeFormat = timeFormatA.replace('hh', 'HH');
    return timeFormat;
  }

  static getInjector(): Injector {
    return this.injector;
  }

  static setInjector(inject: Injector): void {
    this.injector = inject;
  }
  public setFormDirty(isDirty: boolean) {
    this.isFormDirty = isDirty;
  }
  public getFormDirty(): boolean {
    return this.isFormDirty;
  }

  public getSymErrorSeperator(): string {
    this.sym_error_seperator = this.getLabelValue('sym_error_seperator');
    if (this.sym_error_seperator == 'sym_error_seperator') this.sym_error_seperator = ';';
    return this.sym_error_seperator;
  }
}
