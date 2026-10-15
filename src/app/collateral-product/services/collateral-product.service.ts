import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/system-common/services/base.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Injectable()
export class CollateralProductService extends BaseService {
  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService, 'COLLATERAL');
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

  getCollateralRenderLevelList(level?: string) {
    let body = {};
    if (level != undefined && level != null) {
      body = {
        FetchData: {
          isMetadataRequired: false,
        },
        levelCd: level,
      };
    } else {
      body = {
        FetchData: {
          isMetadataRequired: false,
        },
      };
    }
    return this.httpPost(`${this.getURLValue(this.serviceURL)}/getCollateralRenderLevelList `, body);
  }
}
