import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from 'src/app/system-common/services/base.service';
import { Observable } from 'rxjs';
import { FieldItem } from 'src/app/models/common/field-item';

@Injectable()
export class CSAService extends BaseService {
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
  isRPQApplicable = false;
  fundRiskClassLabel: string;
  public isRiskFundApplicableFlag: boolean = false;
  public csaLinkSISearchDisplayed: boolean;
  public viewProposalListDisplayed: boolean = false;
  fundRiskClass: string;
  // fnaStepQuestionnaire: any[];
  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService, 'FNAREQUEST');
  }
  public init(modelNameList?: string[]) {
    return this.getFNA(0, modelNameList);
  }
  public load(id?: any, modelNameList?: string[], isMetadataReqd?: boolean) {
    return this.getFNA(id, modelNameList, isMetadataReqd);
  }
  public process(id?, modelNameList?: string[]) {
    return this.saveLead(id, modelNameList);
  }

  private saveLead(id: any, modelNameList: any) {
    let body = this.getPostBody(modelNameList, true);

    let path = id === 0 ? `${this.getURLValue('FNAREQUEST')}` : `${this.getURLValue('FNAREQUEST')}/${id}`;

    // Just for checking purpose, later will remove this
    console.log('Path is : ' + path);
    //console.log('Json format body is : ' + JSON.stringify(body));
    console.log(body);

    return this.httpPut(path, body);
  }

  public getCSALinkSISearch(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('ProposalLinkCSA', executeSearch, searchCriteriaData);
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

  // TODO
  // public find(executeSearch?: boolean, searchCriteriaData?: any) {
  //   return null;
  // }
  public findForLanding(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('SearchFNARequest', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=TrackLeadAtFNAStage`,
    //     body
    // );
  }

  public find(executeSearch?: boolean, searchCriteriaData?: any) {
    console.log('in find');
    return this.getCSASearchList(executeSearch, searchCriteriaData);
  }

  private getCSASearchList(executeSearch?: boolean, searchCriteriaData?: any) {
    console.log('in getcsasearchlist');
    return this.getSearchList('SearchFNARequest', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=LeadSearchAPI`,
    //     body
    // );
  }
  getQuotationSearchList(executeSearch?: boolean, searchCriteriaData?: any) {
    console.log('in getQuotationSearchList');
    return this.getSearchList('SearchLifeIllustration', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=LeadSearchAPI`,
    //     body
    // );
  }

  private getFNA(id: number, modelNameList: any, isMetadataReqd = true) {
    let body = this.getFetchBody(modelNameList, isMetadataReqd);
    let path = this.getURLValue('FNAREQUEST');
    if (id !== 0) {
      return this.httpPost(`${path}/${id}`, body);
    } else {
      return this.httpPost(`${path}`, body);
    }
  }

  viewLead(leadId: string) {
    let response: any;
    let body = {};
    if (leadId != null && leadId != undefined) {
      body = {
        leadId: leadId,
      };
    }

    let path = `${this.getURLValue('FNAREQUEST')}/viewLeadOnFNA`;
    return this.httpPost(path, body, undefined, false);
  }

  linkSI() {
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
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
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/${this.id}`, body, {
      key: 'action',
      value: 'linkSI',
    });
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
      return this.httpPost(`${this.getURLValue('FNAREQUEST')}/${this.id}`, body, {
        key: 'action',
        value: 'createQuotation',
      });
    }
  }

  getRPQFunds(agentID: any, item: FieldItem) {
    let body = {};
    let rpqScore = this.responseIO.data.LeadRPQ.rpqScore;
    if (rpqScore != null && rpqScore != undefined) {
      body = {
        agentID: agentID,
      };
      let response: any;
      this.httpPost(`${this.getURLValue('FNAREQUEST')}/getRPQFunds`, body, undefined, false).subscribe(
        (body) => {
          response = JSON.parse(JSON.stringify(body));
          if (response.data != undefined) {
            this.setItemOptions(item, response.data.values);
          }
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }

  computeRiskScore(rpqScore: number): Observable<any> {
    console.log('compute Risk Score');
    let body = rpqScore != null ? { rpqScore } : {};
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/getFundRisk`, body, undefined, false);
  }

  getCSAPreview(policyId) {
    // let OutputPreferences = this.responseIO.data.OutputPreferences;
    console.log('this.responseIO.data.policyId', policyId);
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      proposalNum: policyId,
    };
    let path = this.getURLValue('FNAREQUEST');
    http: return this.httpPost(`${path}/${this.id}/viewFNAPreview`, body);
  }

  getCSAPreviewPdf() {
    let response: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let path = this.getURLValue('FNAREQUEST');
    return this.httpPost(`${path}/${this.id}/CSAPreviewPdf`, body);
  }

  public getSignature(): any {
    let signature = { guid: '123', status: 'N' };
    return signature;
  }

  closeCSA(modelList?: any[], id?: number) {
    let body: any;
    let fnaId: number;
    if (modelList && modelList != undefined) {
      body = {
        FetchData: {
          Models: this.getModelNameBodyList(modelList),
          isMetadataRequired: true,
          language: 'EN',
        },
      };
      fnaId = this.id;
    }
    if (id && id != undefined) {
      body = {
        FetchData: {
          isMetadataRequired: true,
          language: 'EN',
        },
      };
      fnaId = id;
    }
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/${fnaId}`, body, {
      key: 'action',
      value: 'closeCSA',
    });
  }

  deleteCSA(id: number): Observable<Object> {
    let body = '{}';
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/${id}/deleteFNARequest`, body);
  }
  getpopulateFundListbasisRiskProfile(fundRiskClassLabel: any, rpqScore: number): Observable<Object> {
    let body = {
      fundRiskClassLabel: fundRiskClassLabel,
      rpqScore: rpqScore,
    };
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/populateFundListbasisRiskProfile`, body);
  }
  selectFundListOptionWithoutIndiviual(selected): Observable<Object> {
    let body = {
      selected: selected,
    };
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/fundListOptionWithoutIndiviual`, body);
  }
  getRiskFundApplicable(agentID): Observable<Object> {
    let body = {
      agentID: agentID,
    };
    return this.httpPost(`${this.getURLValue('FNAREQUEST')}/isRiskFundApplicable`, body);
  }

  getSendReport(fnaRef: any, fnaId: string) {
    let response: any;
    let body = {};

    if (fnaId != null && fnaId != undefined) {
      body = {
        module: 'FNAREQUEST',
        refId: fnaId,
      };
    }

    let path = `${this.getURLValue('LOGIN')}/sendData`;
    return this.httpPost(path, body, undefined, false);
  }
}
