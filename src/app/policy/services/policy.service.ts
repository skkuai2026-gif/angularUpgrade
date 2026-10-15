import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyServiceHandler } from './policy.service.handler';
import { FieldItem } from 'src/app/models/common/field-item';
import { CSAService } from 'src/app/csa/service/csa-service.service';
import { Observable } from 'rxjs';

@Injectable()
export class PolicyService extends PolicyServiceHandler {
  public csaService: CSAService;
  public isPolicySubmitSuccess: boolean;
  outPutPreferenceObject: any;
  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService);
  }
  public setCSAService(csaService) {
    this.csaService = csaService;
  }

  getPinCode(item: FieldItem): void {
    console.log('in getPinCode');
    // let pinCode = item.model.pinCode;
    let countryCd = item.model.countryCd == null ? '' : item.model.countryCd;
    let cityCd = item.model.cityCd == null ? '' : item.model.cityCd;
    let stateCd = item.model.stateCd == null ? '' : item.model.stateCd;
    let respPinCode: any;
    let onlineFilterCond: any = {
      'pincodeCityStateMapDO.countryCd': countryCd,
      'pincodeCityStateMapDO.cityCd': cityCd,
      'pincodeCityStateMapDO.stateCd': stateCd,
    };
    if (countryCd != null) {
      onlineFilterCond = {
        'pincodeCityStateMapDO.countryCd': countryCd,
        'pincodeCityStateMapDO.cityCd': cityCd,
        'pincodeCityStateMapDO.stateCd': stateCd,
      };
    }
    let body = {
      onlineLookupKey: 'PINCODE',
      onlineFilterCond: onlineFilterCond,
      offlineLookupKey: 'PINCODE',
      offlineFilterCond: {
        countryCd: countryCd,
        cityCd: cityCd,
        stateCd: stateCd,
      },
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false).subscribe(
      (body) => {
        respPinCode = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respPinCode.data.values, true);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  submitPolicy() {
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      FetchData: {
        Models: this.getModelNameBodyList([
          'Entity',
          'BasePlan',
          'RiderList',
          'ServiceSignatureList',
          'PartyDocumentList',
          'PolicyAdditionalFields',
          'Proposer',
        ]),
        isMetadataRequired: true,
      },
    };

    return this.httpPost(
      `${this.getURLValue('POLICY')}/${this.id}`,
      body,
      {
        key: 'action',
        value: 'policySubmit',
      },
      true
    );
  }

  getFNAId(fnaId) {
    let body = { fnaId: fnaId };
    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/getCSASeq `, body);
  }

  getStateCd(item: FieldItem): void {
    let pinCode = item.model.pinCode == null ? '' : item.model.pinCode;
    let countryCd = item.model.countryCd == null ? '' : item.model.countryCd;
    let onlineFilterCond: any = {
      'countryStateDO.countryCd': countryCd,
    };
    if (pinCode != null && pinCode !== '') {
      onlineFilterCond = {
        'pincodeCityStateMapDO.pinCode': pinCode,
        'countryStateDO.countryCd': countryCd,
      };
    }
    let offlineFilterCond: any = {
      countryCd: countryCd,
    };
    if (pinCode != null && pinCode !== '') {
      offlineFilterCond = {
        pinCode: pinCode,
        countryCd: countryCd,
      };
    }

    let body = {
      onlineLookupKey: 'PINCODESTATE',
      onlineFilterCond: onlineFilterCond,
      offlineLookupKey: 'PINCODECOUNTRYSTATE',
      offlineFilterCond: offlineFilterCond,
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false).subscribe(
      (body) => {
        let respStateCd = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respStateCd.data.values, true);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getCityCd(item: FieldItem): void {
    let pinCode = item.model.pinCode == null ? '' : item.model.pinCode;
    let countryCd = item.model.countryCd == null ? '' : item.model.countryCd;
    let stateCd = item.model.stateCd == null ? '' : item.model.stateCd;
    let onlineFilterCond = {};
    if (pinCode != null && pinCode !== '') {
      onlineFilterCond['pincodeCityStateMapDO.pinCode'] = pinCode;
    } else if (countryCd != null && stateCd != null) {
      onlineFilterCond['pincodeCityStateMapDO.countryCd'] = countryCd;
      onlineFilterCond['pincodeCityStateMapDO.stateCd'] = stateCd;
    }
    let offlineFilterCond = {};
    if (pinCode != null && pinCode !== '') {
      offlineFilterCond['pinCode'] = pinCode;
    } else if (countryCd != null && stateCd != null) {
      offlineFilterCond['countryCd'] = countryCd;
      offlineFilterCond['stateCd'] = stateCd;
    }

    let body = {
      onlineLookupKey: 'PINCODECOUNTRYCITY',
      onlineFilterCond: onlineFilterCond,
      offlineLookupKey: 'PINCODECOUNTRYCITY',
      offlineFilterCond: offlineFilterCond,
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false).subscribe(
      (body) => {
        let respCitCd = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respCitCd.data.values, true);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  generateApplicationNumber(applicationType, proposalNum) {
    // let body = {
    //   FormData: {
    //     Models: this.responseIO.data,
    //   },
    //   FetchData: {
    //     Models: this.getModelNameBodyList(['Entity','BasePlan']),
    //     isMetadataRequired: true,
    //     language: 'EN',
    //   },
    // };
    let body = {
      addtnField1: applicationType,
      userId: this.responseIO.data.Entity.userId,
      proposalNum: proposalNum,
    };
    console.log('body', body);
    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/generateApplicationNumber `, body);
    // let path = this.id > 0 ? `${this.getURLValue('POLICY')}/${this.id}` : `${this.getURLValue('POLICY')}`;
    // return this.httpPost(path, body, {
    //   key: 'action',
    //   value: 'generateApplicationNumber',
    // });
  }

  getCountryExtensionNum(item: FieldItem): void {
    console.log('getCounyryAreaCode.....');
    let countryCd = item.model.countryCd;
    let respextensionNum: any;

    let onlineFilterCond: any = {
      'fieldTargetValue.mappingKey': 'CountryAreaCd',
      'fieldTargetValue.drivingValue': countryCd,
    };
    if (countryCd != null) {
      onlineFilterCond = {
        'fieldTargetValue.mappingKey': 'CountryAreaCd',
        'fieldTargetValue.drivingValue': countryCd,
      };
    }
    let body = {
      onlineLookupKey: 'COUNTRYFILTER',
      onlineFilterCond: onlineFilterCond,
      offlineLookupKey: 'COUNTRYFILTER',
      offlineFilterCond: {
        mappingkey: 'CountryAreaCd',
        drivingValue: countryCd,
      },
    };
    this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false).subscribe(
      (body) => {
        respextensionNum = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, respextensionNum.data.values, true);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  unlock() {
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };

    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}`, body, {
      key: 'action',
      value: 'unlockPolicy',
    });
  }

  checkPaymentStatus(isPoll: boolean, source?: any): Observable<Object> {
    let body = {
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(['InitialOtherPayerParty', 'InitialPayment']),
      },
      isPoll: isPoll,
      source: source,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/checkPaymentStatus`, body);
  }
  checkEnrollNowStatus(isPoll: boolean, source?: any): Observable<Object> {
    // alert("inside checkEnrollNowStatus")
    let body = {
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(['InitialOtherPayerParty', 'InitialPayment']),
      },
      isPoll: isPoll,
      source: source,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/checkEnrollNowStatus`, body);
  }

  getPolicyTransferDetails(): Observable<Object> {
    let body = {
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(['Entity']),
      },
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/getPolicyTransferDetails`, body);
  }

  getSendReport(policyRef: any, policyNum: string) {
    let response: any;
    let body = {};

    if (policyNum != null && policyNum != undefined) {
      body = {
        module: 'POLICY',
        refId: policyNum,
      };
    }

    let path = `${this.getURLValue('LOGIN')}/sendData`;
    return this.httpPost(path, body, undefined, false);
  }
  eFormPreview(
    serviceDocument: any,
    viewType: string,
    displayLoader?: boolean,
    includeFormData: boolean = true,
    captureSign?: boolean
  ): Observable<Object> {
    let body = {
      PartyDocumentFormList: this.responseIO.data['PartyDocumentFormList'],
      ServiceDocument: serviceDocument,
      viewType: viewType,
    };

    if (includeFormData) {
      body['FormData'] = {
        Models: this.responseIO.data,
      };
    }
    if (captureSign) {
      body = {
        ...body,
        ...{
          FetchData: {
            currentActiveTab: 'tab_capture_traditionalSignature',
            currentActiveField: this.currentActiveField,
            currentActiveStep: this.currentActiveStep,
          },
        },
      };
      if (!body['FormData']) {
        body['FormData'] = {};
      }

      if (!body['FormData']['Models']) {
        body['FormData']['Models'] = {};
      }

      body['FormData']['Models']['ServiceSignatureList'] = this.responseIO.data.ServiceSignatureList;
    }
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/eFormPreview`, body, null, undefined, displayLoader);
  }
  checkForSigndPartyDocuments(): boolean {
    let hasSignedDocs: boolean = false;
    if (
      this.responseIO != undefined &&
      this.responseIO.data &&
      this.responseIO.data.ServiceSignatureList != undefined
    ) {
      for (let partySignDoc of this.responseIO.data.ServiceSignatureList) {
        if (partySignDoc.signature) {
          hasSignedDocs = true;
          break;
        }
      }
    }
    return hasSignedDocs;
  }

  getSendCPAGPaymentLink(trigger?: any): Observable<Object> {
    let body = {
      trigger: trigger,
      setModelField: 'INITIATED_CPAGEMAIL',
    };
    return this.httpPost(`${this.getURLValue(this.serviceURL)}/${this.id}/sendCPAGPaymentLink`, body);
  }
  checkPaymentStatusViaEmail(id: string, isPoll: boolean, source?: any): Observable<Object> {
    let body = {
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(['InitialOtherPayerParty', 'InitialPayment']),
      },
      isPoll: isPoll,
      source: source,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${id}/checkPaymentStatus`, body);
  }
  getAcaCheckPaymentStatus(proposalNum: any, applicationRefNum?: any): Observable<Object> {
    let body = {
      proposalNum: proposalNum,
      applicationRefNum: applicationRefNum,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/getAcaPaymentDetails`, body);
  }
  addPartyIdentity(partyModel: any, model?: any) {
    let response: any;
    let body = { Party: partyModel };
    let modelObj = null;
    this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/addPartyIdentity `, body).subscribe(
      (body) => {
        response = JSON.parse(JSON.stringify(body));
        let newList = [];
        if (model != undefined && model.modelSrcPath != undefined) {
          modelObj = this.getModel(model.modelSrcPath);
          partyModel.IdentityList = modelObj?.IdentityList;
        }
        Array.prototype.push.apply(newList, partyModel.IdentityList);
        // Response PartyIdentity objName add
        if (partyModel.IdentityList != undefined && partyModel.IdentityList.length > 0) {
          response.data.PartyIdentity['objName'] = partyModel.IdentityList[0].objName;
        }
        newList.push(response.data.PartyIdentity);
        partyModel.IdentityList = [];
        partyModel.IdentityList = newList;
        if (modelObj != undefined && modelObj.IdentityList != undefined) {
          modelObj.IdentityList = [];
          modelObj.IdentityList = newList;
        }
        this.refreshMetaData(response);
      },

      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
