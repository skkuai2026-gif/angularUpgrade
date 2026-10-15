import { QuotationService } from 'src/app/quotation/services/quotation.service';
import { HttpClient } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from 'src/app/system-common/services/base.service';
import { Observable } from 'rxjs';
import { FieldItem } from 'src/app/models/common/field-item';

export class PolicyServiceHandler extends BaseService {
  public productFacets: any;
  public companyFacets: any;
  public quotationService: QuotationService;
  public reflexiveQuestionBody: any; //Temporary variable for API testing to set the currently reflexive questionnaire api selected in request body.

  constructor(http: HttpClient, settingService: SettingService, serviceURL?: string) {
    const url = serviceURL === undefined || serviceURL === 'dummy' ? 'POLICY' : serviceURL;
    super(http, settingService, url);
  }

  public init(modelNameList: string[]) {
    return this.getPolicy(0, modelNameList);
  }

  public load(id: any, modelNameList: string[]) {
    return this.getPolicy(id, modelNameList);
  }

  public process(id: any, modelNameList: string[]) {
    return this.savePolicy(id, modelNameList);
  }

  public find(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getPolicySearchList(executeSearch, searchCriteriaData);
  }

  public findForLanding(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('TrackLeadAtEAppStage', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=TrackLeadAtEAppStage`,
    //     body
    // );
  }

  public clear() {
    super.clear();
    this.productFacets = undefined;
  }

  public setQuotationService(quotationService) {
    this.quotationService = quotationService;
  }

  private getPolicySearchList(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('SearchPolicy', executeSearch, searchCriteriaData);
    // let body = {};

    // return this.httpPost(
    //     `${this.settingService.getURLValue('SEARCH')}?name=SearchPolicy`,
    //     body
    // );
  }

  private getPolicy(id: number, modelNameList: any) {
    let body = this.getFetchBody(modelNameList, true);
    let path = this.getURLValue('POLICY');
    // console.log("path ", path);
    // console.log("modelNameList ", modelNameList);
    if (id != 0) {
      return this.httpPost(`${path}/${id}`, body, undefined, true);
    } else if (id == 0) {
      return this.httpPost(`${path}`, body);
    }
  }

  validatePolicy(modelNameListArray: any, isMetadataRequired?: boolean): Observable<Object> {
    let modelNameList = [];
    modelNameListArray.filter((name) => {
      let modelNames = {
        ModelName: name,
      };
      modelNameList.push(modelNames);
    });
    if (isMetadataRequired == undefined) isMetadataRequired = false;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      FetchData: {
        Models: modelNameList,
        isMetadataRequired: isMetadataRequired,
      },
    };

    let path = this.id > 0 ? `${this.getURLValue('POLICY')}/${this.id}` : `${this.getURLValue('POLICY')}`;

    // console.log('validate policy:-', this.responseIO.data);
    return this.httpPost(
      path,
      body,
      {
        key: 'action',
        value: 'validatePolicy',
      },
      false
    );
  }

  public async getPolicyByQuotationRefNum(quotationRefNum: string): Promise<any> {
    let path = this.getURLValue(this.serviceURL);
    //let body = this.getFetchBody(['Entity']);
    return this.httpGet(`${path}?quotationRefNum=${quotationRefNum}`, null, false, false).toPromise();
  }

  private savePolicy(id, modelNameList) {
    let body = this.getPostBody(modelNameList, true);
    let path = id == 0 ? `${this.getURLValue('POLICY')}` : `${this.getURLValue('POLICY')}/${id}`;
    console.log(body);
    return this.httpPut(path, body);
  }

  addPartyOtherIncome(partyModel: any) {
    let response: any;
    let body = { Party: partyModel };
    this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/addPartyOtherIncome `, body).subscribe(
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
  evaluateRider(currentRiderModel: any): Observable<Object> {
    let successResponse: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(['RiderList']),
      },
      currentRider: currentRiderModel.object == undefined ? currentRiderModel.id : currentRiderModel.object,
    };

    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}`, body, {
      key: 'action',
      value: 'evaluateRider',
    });

    // .subscribe(
    //     (body) => {
    //         successResponse = JSON.parse(JSON.stringify(body));
    //         let newRiderList = [];
    //         Array.prototype.push.apply(
    //             newRiderList,
    //             successResponse.data.RiderList
    //         );
    //         this.responseIO.data.RiderList = [];
    //         //newRiderList.push(successResponse.data.RiderList[0]);
    //         this.responseIO.data.RiderList = newRiderList;
    //         //assigning responseio to a new instance since ngonchanges was not getting called
    //         //and rider grid was not getting refreshed.
    //         this.responseIO = Object.assign({}, this.responseIO);
    //         console.log(
    //             'RiderList: ' +
    //                 JSON.stringify(this.responseIO.data.RiderList)
    //         );
    // this.refreshMetaData(successResponse)
    //         return
    //     },
    //     (error) => {
    //         console.log('Error:', error);
    //     }
    // );
  }

  getApplicableRiderPlanOptions(item: FieldItem, basePlanModel: any): void {
    let resApplicablePlanOptions: any;
    let body = {
      applicablePlanOptions: item.model.applicablePlanOptions,
      basePlanProductSeq: basePlanModel.productSeq,
      riderProductSeq: item.model.productSeq,
      basePlanOptionCd: basePlanModel.productPlanOptionCd,
    };
    this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/getApplicableRiderPlanOptions`, body).subscribe(
      (body) => {
        resApplicablePlanOptions = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, resApplicablePlanOptions.data.planOption);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
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
        if (respGender.data.values.length == 1) model.genderCd = respGender.data.values[0].cd;
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
        referenceDt: this.responseIO.data.Entity.proposalEntryDt,
      };
    } else if (age != null && age != undefined) {
      body = {
        age: age,
      };
    }

    //alert('calculating age for Date' + new Date(dob).getTime());
    let respCompute: any;

    //console.log(body);
    this.httpPost(`${this.getURLValue('POLICY')}/computeAge`, body, undefined, false).subscribe(
      (body) => {
        respCompute = JSON.parse(JSON.stringify(body));
        if (respCompute.data != undefined) {
          if (dob != null && dob != undefined) {
            //model.age = respCompute.data.age;
            this.setModelFieldValue(model, 'age', respCompute.data.age);
          } else if (age != null && age != undefined) {
            this.setModelFieldValue(model, 'dob', respCompute.data.dob);
          }
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  addNominee() {
    let body = this.getFetchBodyInDynamicAPI();
    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/addNominee `, body);
  }

  addInitialPaymentDetailsList(): Observable<Object> {
    let response: any;
    let body = {};
    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/addInitialPayment `, body);
  }

  addPolicyParty(partyRoleCd: string, jsonNodeName: string) {
    let body = this.getFetchBodyInDynamicAPI();
    body.addPartyRoleCd = partyRoleCd;
    body.addToNodeName = jsonNodeName;
    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/addPolicyParty `, body);
  }

  addPolicyAgent() {
    let response: any;
    let body = {};
    this.httpPost(`${this.getURLValue('POLICY')}/${this.id}/addPolicyAgent`, body).subscribe(
      (body) => {
        response = JSON.parse(JSON.stringify(body));
        let newAgentList = [];
        Array.prototype.push.apply(newAgentList, this.responseIO.data.AgentList);
        //console.log(response)
        //response.data.PolicyAgent["closeTab"] = true;
        newAgentList.push(response.data.PolicyAgent);
        //need to change the entire array instance in order to reflect in the dom
        this.responseIO.data.AgentList = [];
        this.responseIO.data.AgentList = newAgentList;
        this.refreshMetaData(response);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getReflexiveQuestionnaire(questionBody: any) {
    this.reflexiveQuestionBody = questionBody;
    let path = this.getURLValue(this.serviceURL);
    return this.httpPost(`${path}/${this.id}/getReflexiveQuestionnaire`, questionBody, undefined, false);
  }

  getEAppPreview(languageCd?: string) {
    // let OutputPreferences = this.responseIO.data.OutputPreferences;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      languageCd: languageCd,
      isFullHTMLRequired: false,
    };
    let path = this.getURLValue('POLICY');
    http: return this.httpPost(`${path}/${this.id}/eappPreview`, body);
  }

  getEAppPreviewPdf(languageCd?: string) {
    let response: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      languageCd: languageCd,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/eappPreviewPdf`, body);
  }

  // acceptPolicy(modelNameList?: string[]) {
  //   let body = {
  //     FormData: {
  //       Models: this.responseIO.data,
  //     },
  //   };
  //   if (modelNameList != undefined) body = this.getPostBody(modelNameList);
  //   return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}`, body, {
  //     key: 'action',
  //     value: 'acceptPolicyRaw',
  //   });
  // }
  acceptPolicy(modelNameList?: string[]) {
    if (this.settingService.getApplicationMode() === 'offline') {
      let body = {
        FormData: {
          Models: this.responseIO.data,
        },
      };
      if (modelNameList != undefined) body = this.getPostBody(modelNameList);
      return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}`, body, {
        key: 'action',
        value: 'acceptPolicyRaw',
      });
    } else if (this.settingService.getApplicationMode() === 'online') {
      let body = {
        FormData: {
          Models: this.responseIO.data,
        },
      };

      return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}`, body, {
        key: 'action',
        value: 'acceptPolicy',
      });
    }
  }

  editQuotation() {
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };

    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}`, body, {
      key: 'action',
      value: 'editQuotation',
    });
  }

  autoUnderwrite(isFormDataReq?: boolean, modelNameList?: string[]) {
    let body = {};
    let isFormDataRequired = isFormDataReq != undefined ? isFormDataReq : true;
    if (isFormDataRequired) {
      body = {
        FormData: {
          Models: this.responseIO.data,
        },
      };
    }
    if (modelNameList != undefined) body = this.getPostBody(modelNameList);
    return this.httpPost(`${this.getURLValue('POLICY')}/${this.id}`, body, {
      key: 'action',
      value: 'autoUnderwrite',
    });
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
        ]),
        isMetadataRequired: true,
      },
    };

    return this.httpPost(
      `${this.getURLValue('POLICY')}/${this.id}`,
      body,
      {
        key: 'action',
        value: 'policySubmitRaw',
      },
      true
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

  getStateCd(item: FieldItem): void {
    let pinCode = item.model.pinCode;
    let countryCd = item.model.countryCd;
    let respStateCd: any;
    let onlineFilterCond: any = {
      'countryStateDO.countryCd': countryCd,
    };
    let offlineFilterCond: any = {
      countryCd: countryCd,
    };
    if (pinCode != null) {
      onlineFilterCond = {
        'pincodeCityStateMapDO.pinCode': pinCode,
        'countryStateDO.countryCd': countryCd,
      };
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
    let stateCd = item.model.stateCd;
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
        stateCd: stateCd,
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

  addImage(imageContent: string, fileName: string, document: any) {
    let body = {};

    body = {
      imageContent: imageContent,
      serviceDocument: document,
      fileName: fileName,
    };

    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/addImage`, body);
  }

  getProductUIFacets(productSeq): Observable<Object> {
    let body = {
      productSeq: productSeq,
    };
    let path = this.getURLValue('PRODUCT');
    return this.httpPost(`${path}/getUIFacets`, body);
  }

  getPartyRoleList(roleCd: string, paymentInstructionTypeCd?: string): Observable<Object> {
    let body = {
      roleCd: roleCd,
      paymentInstructionTypeCd: paymentInstructionTypeCd,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/getPartyRoleList`, body);
  }

  //Used for Offline
  checkPaymentStatus(isPoll: boolean): Observable<Object> {
    let body = {
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(['InitialOtherPayerParty', 'InitialPayment']),
      },
      isPoll: isPoll,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/checkPaymentStatus`, body);
  }

  changeAllocation(): Observable<Object> {
    let body = this.getPostBody(this.getResponseModelNameList());
    let action = 'changeAllocation';

    return this.httpPost(
      `${this.getURLValue(this.serviceURL)}/${this.id}`,
      body,
      {
        key: 'action',
        value: action,
      },
      true
    );
  }

  sendPaymentLink(): Observable<Object> {
    let body = {};
    return this.httpPost(`${this.getURLValue(this.serviceURL)}/${this.id}/sendPaymentLink`, body);
  }

  getInwardPaymentInfo(inwardId: number): Observable<Object> {
    let body = { inwardId: inwardId };
    return this.httpPost(`${this.getURLValue(this.serviceURL)}/getInwardPaymentInfo`, body);
  }

  updatePolicyStatus(): Observable<Object> {
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };

    return this.httpPost(
      `${this.getURLValue('POLICY')}/${this.id}`,
      body,
      {
        key: 'action',
        value: 'updatePolicyStatus',
      },
      true
    );
  }

  createRevisedQuotation(): Observable<Object> {
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };

    return this.httpPost(
      `${this.getURLValue('POLICY')}/${this.id}`,
      body,
      {
        key: 'action',
        value: 'createRevisedQuotation',
      },
      true
    );
  }

  findByPolicyNum(policyNum: string): Observable<Object> {
    return this.httpGet(`${this.getURLValue('POLICY')}?policyNum=${policyNum}`);
  }

  findByPolicyId(policyId: string): Observable<Object> {
    return this.httpGet(`${this.getURLValue('POLICY')}/${policyId}`);
  }

  createQuotation(): Observable<Object> {
    let path = this.getURLValue('POLICY');
    let body = this.getPostBody([{ ModelName: 'Entity' }], true);
    return this.httpPost(
      `${path}`,
      body,
      {
        key: 'action',
        value: 'createQuotation',
      },
      true
    );
  }

  getPolicyTransferHistory(): Observable<Object> {
    let body = {
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(['Entity']),
      },
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/getPolicyTransferHistory`, body);
  }

  public getCompanyFacetValue(facetId: string): string {
    let facetValue: string = null;
    if (
      this.companyFacets != undefined &&
      this.companyFacets.data != undefined &&
      this.companyFacets.data[facetId] != undefined
    ) {
      facetValue = this.companyFacets.data[facetId];
    }
    return facetValue;
  }

  copyPolicyData(copiedPolicySeq: number, proposalDataToBeCopiedArray: any): Observable<Object> {
    let body = {
      copyFromPolicySeq: copiedPolicySeq,
      proposalDataToBeCopied: proposalDataToBeCopiedArray,
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/copyPolicyData`, body);
  }

  /**
   * This will call http post method for API call
   * @param serviceDocument expects the current serviceDocument
   * @param viewType expects a viewType for eg: htmlEntry, html, pdf
   * @param displayLoader is a optional param which expects boolean value to display loader.
   * @returns the observable object from the api call
   */

  eFormPreview(serviceDocument: any, viewType: string, displayLoader?: boolean): Observable<Object> {
    let body = {
      PartyDocumentFormList: this.responseIO.data['PartyDocumentFormList'],
      ServiceDocument: serviceDocument,
      viewType: viewType,
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let path = this.getURLValue('POLICY');
    return this.httpPost(`${path}/${this.id}/eFormPreview`, body, null, undefined, displayLoader);
  }
}
