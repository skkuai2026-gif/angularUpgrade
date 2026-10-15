import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from 'src/app/system-common/services/base.service';
import { Observable } from 'rxjs';

@Injectable()
export class FnaService extends BaseService {
  // public fnaModel: {
  //   LeadId: any;
  //   FirstName: any;
  //   LastName: any;
  //   Age: number;
  //   DOB: String;
  //   Gender: String;
  //   Smoker: String;
  //   Mobile: number;
  //   Email: String;
  // };

  // fnaStepQuestionnaire: any[];
  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService, 'FNA');
  }
  public init(modelNameList?: string[]) {
    return this.getFNA(0, modelNameList);
  }
  public load(id?: any, modelNameList?: string[], isMetadataReqd?: boolean) {
    return this.getFNA(id, modelNameList, isMetadataReqd);
  }
  public process(id?, modelNameList?: string[]) {
    return this.httpGet('');
  }

  // TODO
  public find(executeSearch?: boolean, searchCriteriaData?: any) {
    return null;
  }
  public findForLanding(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('TrackLeadAtFNAStage', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=TrackLeadAtFNAStage`,
    //     body
    // );
  }

  private getFNA(id: number, modelNameList: any, isMetadataReqd = true) {
    let body = this.getFetchBody(modelNameList, isMetadataReqd);
    let path = this.getURLValue('FNA');
    if (id !== 0) {
      return this.httpPost(`${path}/${id}`, body);
    } else {
      return this.httpPost(`${path}`, body);
    }
  }

  createQuotation() {
    let body = {
      FetchData: {
        Models: [
          {
            ModelName: 'Entity',
          },
        ],
        isMetadataRequired: true,
        language: 'EN',
      },
    };
    if (
      this.responseIO != undefined &&
      this.responseIO.data != undefined &&
      this.responseIO.data.Entity != undefined
    ) {
      return this.httpPost(`${this.getURLValue('LEAD')}/${this.responseIO.data.Entity.leadSeq}`, body, {
        key: 'action',
        value: 'createQuotation',
      });
    }
  }
  public getSignature(): any {
    let signature = { guid: '123', status: 'N' };
    return signature;
  }
  copyFNA(id: number): Observable<Object> {
    let body = {
      FetchData: {
        isMetadataRequired: false,
        language: 'EN',
        Models: [
          {
            ModelName: 'Entity',
          },
        ],
      },
    };
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/${id}`, body, {
      key: 'action',
      value: 'copyFnaRequest',
    });
  }
  deleteCSA(id: number): Observable<Object> {
    let body = '{}';
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/${id}/deleteFNARequest`, body);
  }
}
