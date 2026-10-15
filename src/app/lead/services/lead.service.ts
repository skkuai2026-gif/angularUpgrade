import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { LeadServiceHandler } from './lead.service.handler';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { MenuService } from 'src/app/system-common/services/menu.service';
import { LoginService } from 'src/app/system-common/services/login.service';

@Injectable()
export class LeadService extends LeadServiceHandler {
  constructor(http: HttpClient, settingService: SettingService, public loginService: LoginService) {
    super(http, settingService);
  }

  public viewCSAListDisplayed: boolean = false;
  public viewProposalListLeadDisplayed: boolean = false;
  public viewPolicyListDisplayed: boolean = false;
  public isTriggerOtpBtn: boolean = false;

  getCSASearchList(executeSearch?: boolean, searchCriteriaData?: any) {
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

  getPolicySearchList(executeSearch?: boolean, searchCriteriaData?: any) {
    console.log('in getPolicySearchList');
    return this.getSearchList('SearchPolicy', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=LeadSearchAPI`,
    //     body
    // );
  }

  getPinCode(item: FieldItem): void {
    console.log('in getPinCode');
    // let pinCode = item.model.pinCode;
    let countryCd = item.model.countryCd;
    let respPinCode: any;
    let onlineFilterCond: any = {
      'pincodeCityStateMapDO.countryCd': countryCd,
    };
    if (countryCd != null) {
      onlineFilterCond = {
        'pincodeCityStateMapDO.countryCd': countryCd,
      };
    }
    let body = {
      onlineLookupKey: 'PINCODE',
      onlineFilterCond: onlineFilterCond,
      offlineLookupKey: 'PINCODE',
      offlineFilterCond: {
        countryCd: countryCd,
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

  createLeadAndNotify(mobileNumber: string, partyId: string, userId: string, emailId: string) {
    let body = {
      mobileNumber: mobileNumber,
      partyId: partyId,
      userId: userId,
      emailId: emailId,
    };
    let path = this.getURLValue('LEAD');
    return this.httpPost(`${path}/${this.id}/createLeadAndNotify`, body);
  }

  validateGeneratedOTP(otp: string, partyId: string, userId: string) {
    let body = {
      otp: otp,
      partyId: partyId,
      userId: userId,
    };
    let path = this.getURLValue('LEAD');
    return this.httpPost(`${path}/${this.id}/validateGeneratedOTP`, body);
  }
  loadRedemptionCode(refreshReqiured: any, userId: any) {
    let body = {
      refresh: refreshReqiured,
      agentID: userId,
    };
    let path = `${this.getURLValue('LEAD')}/generateRedemptionCode`;
    return this.httpPost(path, body, undefined, false);
  }
  getSendReport(lead: any, leadId: string) {
    let response: any;
    let body = {};

    if (leadId != null && leadId != undefined) {
      body = {
        module: 'LEAD',
        refId: leadId,
      };
    }

    let path = `${this.getURLValue('LOGIN')}/sendData`;
    return this.httpPost(path, body, undefined, false);
  }
  loadLead(leadID) {
    let body = {
      FetchData: {
        Models: [
          {
            ModelName: 'LeadParty',
          },
        ],
        isMetadataRequired: true,
        language: 'EN',
      },
    };
    return this.httpPost(`${this.getURLValue('LEAD')}/${leadID}`, body);
  }
  downloadClientAction(ids: any) {
    let body = {
      selectedIds: ids,
    };
    return this.httpPost(`${this.getURLValue('LEAD')}/downloadClientAction`, body);
  }
  searchClient(executeSearch?: boolean, searchCriteriaData?: any) {
    if (searchCriteriaData == undefined) {
      searchCriteriaData = {
        'SearchLeadDO.fullName': null,
        'SearchLeadDO.lastName2': null,
      };
    }
    let body = {
      executeSearch: executeSearch == undefined || executeSearch == null || executeSearch ? true : executeSearch,
      searchCriteriaData,
    };
    // console.log(JSON.stringify(body));
    // return this.httpPost(`${this.getURLValue('SEARCH')}?name=${name}`, body);
    return this.httpPost(`${this.getURLValue('LEAD')}/searchClient`, body);
  }
}
