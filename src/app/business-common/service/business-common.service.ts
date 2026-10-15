import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from 'src/app/system-common/services/base.service';
import * as dashboardDataJSON from '../data/dashboard-data.json';
@Injectable()
export class BusinessCommonService extends BaseService {
  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService);
  }
  public init(modelNameList: string[]) {
    return null;
  }

  public load(id: any, modelNameList: string[], isMetadataReqd?: boolean) {
    return null;
  }

  public process(id: any, modelNameList: string[]) {
    return null;
  }

  public find(executeSearch?: boolean, searchCriteriaData?: any) {
    return null;
  }

  public getOccupationIndustryDutySearch(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('SearchIndustryOccupation', executeSearch, searchCriteriaData);
  }

  public getDashboardData() {
    return dashboardDataJSON;
  }

  /**
   * It will fetch the Insurance Type and Desc
   * @returns Insurance Type and Desc
   */
  public getInsuranceTypeList() {
    let body = {
      onlineLookupKey: 'INSURANCETYPE',
    };
    return this.httpPost(`${this.settingService.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false);
  }
}
