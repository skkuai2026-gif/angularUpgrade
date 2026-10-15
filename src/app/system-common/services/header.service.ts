import { Subject } from 'rxjs';
import { PageHeader } from './../../models/common/page-header';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from './setting.service';
//import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  /**
   * JSON Object which helps to display details on the header of the page.
   */
  public pageHeader: PageHeader;
  /**
   * This holds the error count of the current displayed view.
   */
  errorCount: number;

  /**
   * Hold the detailed information of error list which needs to be displayed.
   */
  validationError: any[];
  /**
   * @ignore
   */
  isShow: boolean;
  /**
   * @ignore
   */
  private moreOptionSelected = new Subject<any>();
  /**
   * @ignore
   */
  optionsObservable = this.moreOptionSelected.asObservable();
  /**
   * @ignore
   */
  isOptionCalled: boolean;

  constructor(private http: HttpClient, private settingService: SettingService) {
    this.isOptionCalled = false;
    // router.events.subscribe((val) => {
    //   // see also
    //   if (val instanceof NavigationEnd) {
    //     console.log('router changed', val);
    //   }
    // });
  }

  public setPageDocumentTitle() {
    // alert(this.pageHeader);
    if (this.pageHeader != undefined) {
      let pageTitle = this.settingService.getLabelValue(this.pageHeader.title);

      if (this.pageHeader.refNumber != undefined && this.pageHeader.refNumber != '')
        pageTitle = pageTitle + '-' + this.pageHeader.refNumber;
      this.settingService.setPageTitle(pageTitle);
    }
  }
  /**
   * This is set validation error based on ResposeIO
   * @param validationerrors expects a JSON object to set the error list
   */
  public setValidationError(validationerrors): void {
    // console.log(validationerrors);
    this.errorCount = 0;
    this.validationError = [];
    let errorList = [];
    for (let tabId in validationerrors) {
      for (let modelGuid in validationerrors[tabId]) {
        for (let fieldCd in validationerrors[tabId][modelGuid]) {
          errorList.push(validationerrors[tabId][modelGuid][fieldCd]);
          this.errorCount++;
        }
      }
      this.validationError.push({
        name: this.settingService.getLabelValue(tabId),
        errors: errorList,
      });
      errorList = [];
    }
    //console.log(this.validationError)
  }

  /**
   * This forwards the options selected in header component
   * @param value expects a object which was selected in header
   */
  public forwardOptionSelected(value: any): void {
    this.moreOptionSelected.next(value);
  }

  /**
   * This clears all the header options and variable to default value.
   */
  public clear(): void {
    if (this.pageHeader && this.pageHeader.moreOptionList && this.pageHeader.moreOptionList.length > 0) {
      this.pageHeader.moreOptionList = [];
      this.pageHeader = undefined;
      this.isOptionCalled = false;
      this.isShow = false;
      this.moreOptionSelected.next();
    }
  }
}
