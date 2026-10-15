import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationServiceHandler } from './quotation.service.handler';
import { OfflineService } from 'src/app/offline/offline.service';
import { FieldItem } from 'src/app/models/common/field-item';

@Injectable()
export class QuotationService extends QuotationServiceHandler {
  constructor(http: HttpClient, settingService: SettingService, offlineService: OfflineService) {
    super(http, settingService, offlineService);
  }

  public getCSALinkSISearch(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('CSALinkProposal', executeSearch, searchCriteriaData);
  }

  csaLinkSI() {
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
    return this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}`, body, {
      key: 'action',
      value: 'linkCSA',
    });
  }

  addCSA() {
    let response: any;
    let body = {
      FetchData: {
        Models: [
          {
            ModelName: 'Entity',
          },
        ],
        isMetadataRequired: false,
        language: 'EN',
      },
    };

    let path = this.id > 0 ? `${this.getURLValue('QUOTATION')}/${this.id}` : `${this.getURLValue('QUOTATION')}`;
    return this.httpPost(
      path,
      body,
      {
        key: 'action',
        value: 'addCSA',
      },
      true
    );
  }

  viewCSA(fnaId: string) {
    let response: any;
    let body = {};
    if (fnaId != null && fnaId != undefined) {
      body = {
        fnaId: fnaId,
      };
    }

    let path = `${this.getURLValue('QUOTATION')}/viewCSA`;
    return this.httpPost(path, body, undefined, false);
  }

  viewLead(leadId: string) {
    let response: any;
    let body = {};
    if (leadId != null && leadId != undefined) {
      body = {
        leadId: leadId,
      };
    }

    let path = `${this.getURLValue('QUOTATION')}/viewLeadOnQuotation`;
    return this.httpPost(path, body, undefined, false);
  }
  getSendReport(quotationRef: any, quotationRefNum: string) {
    let response: any;
    let body = {};

    if (quotationRefNum != null && quotationRefNum != undefined) {
      body = {
        module: 'QUOTATION',
        refId: quotationRefNum,
      };
    }
    let path = `${this.getURLValue('LOGIN')}/sendData`;
    return this.httpPost(path, body, undefined, false);
  }
  getStateCd(item: FieldItem): void {
    let pinCode = item.model.pinCode;
    let countryCd = item.model.countryCd;
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
    let pinCode = item.model.pinCode;
    let countryCd = item.model.countryCd;
    let stateCd = item.model.stateCd;
    let onlineFilterCond = {};
    if (pinCode != null && pinCode !== '') {
      onlineFilterCond['pincodeCityStateMapDO.pinCode'] = pinCode;
    } else if (countryCd != null && stateCd != null) {
      onlineFilterCond['pincodeCityStateMapDO.countryCd'] = countryCd;
      onlineFilterCond['pincodeCityStateMapDO.stateCd'] = stateCd;
    }
    let offlineFilterCond: any = {
      countryCd: countryCd,
      stateCd: stateCd,
    };
    if (pinCode != null && pinCode !== '') {
      offlineFilterCond = {
        pinCode: pinCode,
        countryCd: countryCd,
        stateCd: stateCd,
      };
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
  refreshFunds(callback?: () => void): void {
    let respFundList: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}/getProductFunds`, body).subscribe(
      (body) => {
        respFundList = JSON.parse(JSON.stringify(body));
        this.responseIO.data.BasePlan.FundList = [];
        this.responseIO.data.BasePlan.FundList = respFundList.data.FundList;
        this.refreshMetaData(respFundList);
        if (callback) callback();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  addWithdrawal(): void {
    let response: any;
    let fetchBody = this.getFetchBodyInDynamicAPI();
    let formDataBody = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let body = Object.assign(formDataBody, fetchBody);
    this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}/addWithdrawal`, body).subscribe(
      (body) => {
        response = JSON.parse(JSON.stringify(body));
        response.data.Withdrawal['objName'] = 'WithdrawalList';
        this.responseIO.data.WithdrawalList.push(response.data.Withdrawal);
        this.refreshMetaData(response);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
