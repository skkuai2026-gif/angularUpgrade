import { HttpClient } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from 'src/app/system-common/services/base.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { Observable } from 'rxjs';

export class LeadServiceHandler extends BaseService {
  public companyFacets: any;
  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService, 'LEAD');
  }

  public init(modelNameList: string[]) {
    return this.getLead(0, modelNameList);
  }

  public load(id: any, modelNameList: string[], isMetadataReqd?: boolean) {
    return this.getLead(id, modelNameList, isMetadataReqd);
  }
  public process(id: any, modelNameList: string[]) {
    return this.saveLead(id, modelNameList);
  }

  addLeadActivity() {
    let body = {};
    return this.httpPost(`${this.getURLValue('LEAD')}/${this.id}/addLeadActivity `, body);
  }

  private getLead(id: number, modelNameList: any, isMetadataReqd = true) {
    let body = this.getFetchBody(modelNameList, isMetadataReqd);
    let path = this.getURLValue('LEAD');

    if (id !== 0) {
      return this.httpPost(`${path}/${id}`, body);
    } else {
      return this.httpPost(`${path}`, body);
    }
  }

  private saveLead(id: any, modelNameList: any) {
    let body = this.getPostBody(modelNameList, true);

    let path = id === 0 ? `${this.getURLValue('LEAD')}` : `${this.getURLValue('LEAD')}/${id}`;

    // Just for checking purpose, later will remove this
    console.log('Path is : ' + path);
    //console.log('Json format body is : ' + JSON.stringify(body));
    console.log(body);

    return this.httpPut(path, body);
  }

  closeLead(modelList?: any[], id?: number) {
    let body: any;
    let leadId: number;
    if (modelList && modelList != undefined) {
      body = {
        FetchData: {
          Models: this.getModelNameBodyList(modelList),
          isMetadataRequired: true,
          language: 'EN',
        },
      };
      leadId = this.id;
    }
    if (id && id != undefined) {
      body = {
        FetchData: {
          isMetadataRequired: true,
          language: 'EN',
        },
      };
      leadId = id;
    }
    return this.httpPost(`${this.getURLValue('LEAD')}/${leadId}`, body, {
      key: 'action',
      value: 'closeLead',
    });
  }
  public find(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getLeadSearchList(executeSearch, searchCriteriaData);
  }

  public findForLanding(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('TrackLead', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=TrackLead`,
    //     body
    // );
  }

  private getLeadSearchList(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('LeadSearchAPI', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=LeadSearchAPI`,
    //     body
    // );
  }

  getGenderForTitle(model: any): void {
    //TODO call gender title mapping api
    let title = model.titleCd;
    let respGender: any;
    let body = {
      mappingKey: 'TitleGender',
      drivingValue: title,
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadMappingData`, body, undefined, false).subscribe(
      (body) => {
        respGender = JSON.parse(JSON.stringify(body));
        if (respGender.data.values.length == 1)
          this.setModelFieldValue(model, 'genderCd', respGender.data.values[0].cd);
        // model.genderCd = respGender.data.values[0].cd;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  computeAge(model: any): void {
    let dob = model.birthDt;
    let age = model.age;
    let body = {};
    if (dob != null && dob != undefined && dob != '') {
      body = {
        dob: dob,
      };
    } else if (age != null && age != undefined) {
      body = {
        age: age,
      };
    }

    //alert('calculating age for Date' + new Date(dob).getTime());
    let respCompute: any;

    //console.log(body);
    this.httpPost(`${this.getURLValue('LEAD')}/computeAge`, body, undefined, false).subscribe(
      (body) => {
        respCompute = JSON.parse(JSON.stringify(body));
        if (respCompute.data != undefined) {
          if (dob != null && dob != undefined) {
            //model.age = respCompute.data.age;
            this.setModelFieldValue(model, 'age', respCompute.data.age);
          } else if (age != null && age != undefined) {
            this.setModelFieldValue(model, 'birthDt', respCompute.data.dob);
          }
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getRelationForGender(item: FieldItem): void {
    let genderCd = item.model.genderCd;
    let respRelation: any;
    let body = {
      mappingKey: 'RelationGender',
      drivingValue: genderCd,
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadMappingData`, body, undefined, false).subscribe(
      (body) => {
        respRelation = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respRelation.data.values);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  getNatureOfDuty(item: FieldItem, selectedOption?: any): Observable<Object> {
    let industryCd =
      selectedOption != undefined && selectedOption['industryCd'] != undefined
        ? selectedOption['industryCd']
        : item.model.industryCd != undefined
        ? item.model.industryCd
        : undefined;
    let body = {
      onlineLookupKey: 'NATUREOFDUTY',
      onlineFilterCond: {
        industryCd: industryCd,
      },
      offlineLookupKey: 'NATUREOFDUTY',
      offlineFilterCond: {
        industryCd: industryCd,
      },
    };
    return this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false);
  }
  getOccupationCd(item: FieldItem, selectedOption?: any): Observable<Object> {
    let natureOfDuty =
      selectedOption != undefined && selectedOption['natureOfDuty'] != undefined
        ? selectedOption['natureOfDuty']
        : item.model.natureOfDuty != undefined
        ? item.model.natureOfDuty
        : undefined;
    let industryCd =
      selectedOption != undefined && selectedOption['industryCd'] != undefined
        ? selectedOption['industryCd']
        : item.model.industryCd
        ? item.model.industryCd
        : undefined;
    let body = {
      onlineLookupKey: 'OCCUPATION',
      onlineFilterCond: {
        natureOfDutyCd: natureOfDuty,
        industryCd: industryCd,
      },
      offlineLookupKey: 'INDUSTRYOCCUPATION',
      offlineFilterCond: {
        natureOfDutyCd: natureOfDuty,
        industryCd: industryCd,
      },
    };
    return this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false);
  }

  getCoverageCityCd(item: FieldItem): void {
    let coverageCountryCd = item.model.coverageCountryCd;
    let respCoverageCityCd: any;
    let body = {
      mappingKey: 'CoverageCountryCity',
      drivingValue: coverageCountryCd,
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadMappingData`, body, undefined, false).subscribe(
      (body) => {
        respCoverageCityCd = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respCoverageCityCd.data.values);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getStateCd(item: FieldItem): void {
    let pinCode = item.model.pinCode;
    let countryCd = item.model.countryCd;
    let respStateCd: any;
    let onlineFilterCond: any = {
      'countryStateDO.countryCd': countryCd,
    };
    if (pinCode != null) {
      onlineFilterCond = {
        'pincodeCityStateMapDO.pinCode': pinCode,
        'countryStateDO.countryCd': countryCd,
      };
    }
    let body = {
      onlineLookupKey: 'PINCODESTATE',
      onlineFilterCond: onlineFilterCond,
      offlineLookupKey: 'PINCODECOUNTRYSTATE',
      offlineFilterCond: {
        pinCode: pinCode,
        countryCd: countryCd,
      },
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false).subscribe(
      (body) => {
        respStateCd = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respStateCd.data.values, true);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getCityCd(item: FieldItem): void {
    let pinCode = item.model.pinCode;
    let countryCd = item.model.countryCd;
    let respCitCd: any;
    let body = {
      onlineLookupKey: 'PINCODECOUNTRYCITY',
      onlineFilterCond: {
        'pincodeCityStateMapDO.pinCode': pinCode,
        'pincodeCityStateMapDO.countryCd': countryCd,
      },
      offlineLookupKey: 'PINCODECOUNTRYCITY',
      offlineFilterCond: {
        pinCode: pinCode,
        countryCd: countryCd,
      },
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false).subscribe(
      (body) => {
        respCitCd = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respCitCd.data.values, true);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  addPartyIdentity(partyModel: any) {
    let response: any;
    let body = { Party: partyModel };
    this.httpPost(`${this.getURLValue('LEAD')}/${this.id}/addPartyIdentity `, body).subscribe(
      (body) => {
        response = JSON.parse(JSON.stringify(body));
        let newList = [];
        Array.prototype.push.apply(newList, partyModel.IdentityList);
        newList.push(response.data.PartyIdentity);
        //need to change the entire array instance in order to reflect in the dom
        // let partyModelTemp = partyModel;
        // partyModel = undefined;
        // partyModel = partyModelTemp;
        partyModel.IdentityList = [];
        partyModel.IdentityList = newList;
        this.refreshMetaData(response);
      },

      (error) => {
        console.log('Error:', error);
      }
    );
  }
  addPartyOtherIncome(partyModel: any) {
    let response: any;
    let body = { Party: partyModel };
    this.httpPost(`${this.getURLValue('LEAD')}/${this.id}/addPartyOtherIncome `, body).subscribe(
      (body) => {
        response = JSON.parse(JSON.stringify(body));
        let newList = [];
        Array.prototype.push.apply(newList, partyModel.OtherIncomeList);
        newList.push(response.data.PartyOtherIncome);
        //need to change the entire array instance in order to reflect in the dom
        // let partyModelTemp = partyModel;
        // partyModel = undefined;
        // partyModel = partyModelTemp;
        partyModel.OtherIncomeList = [];
        partyModel.OtherIncomeList = newList;
        this.refreshMetaData(response);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  createQuotation() {
    let insuranceTypeCd = this.getSessionStorageValue('insuranceTypeCd');
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
    if (insuranceTypeCd != undefined) {
      this.responseIO.data.Entity.insuranceTypeCd = insuranceTypeCd;
      let frmData = {
        Models: this.responseIO.data,
      };
      body['FormData'] = frmData;
    }
    return this.httpPost(`${this.getURLValue('LEAD')}/${this.id}`, body, {
      key: 'action',
      value: 'createQuotation',
    });
  }

  createFNA() {
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
    return this.httpPost(`${this.getURLValue('LEAD')}/${this.id}`, body, {
      key: 'action',
      value: 'createFNA',
    });
  }

  getProductUIFacets(productSeq): Observable<Object> {
    let body = {
      productSeq: productSeq,
    };
    let path = this.getURLValue('PRODUCT');
    return this.httpPost(`${path}/getUIFacets`, body);
  }

  deleteLead(id: number): Observable<Object> {
    let body = '{}';
    return this.httpPost(`${this.getURLValue('LEAD')}/${id}/deleteLead`, body);
  }

  deleteLeads(ids: any[]): Observable<Object> {
    let body = { ids: ids.join(',') };
    return this.httpPost(`${this.getURLValue('LEAD')}/deleteLead`, body);
  }

  populateOCRData(imageContent: string) {
    let body = {
      ImageContent: imageContent,
      Party: this.responseIO.data.LeadParty,
    };
    let path = this.getURLValue('LEAD');
    return this.httpPost(`${path}/populateOCRData`, body, null, true);
  }
}
