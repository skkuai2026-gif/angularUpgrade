import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from './setting.service';
import { BaseService } from 'src/app/system-common/services/base.service';
@Injectable({
  providedIn: 'root',
})
export class SystemCommonService extends BaseService {
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

  public loadRestApiData() {
    let body = {};
    return this.httpPost(`${this.settingService.getURLValue('RESTAPIDATA')}/getData`, body, undefined, true);
  }
}
