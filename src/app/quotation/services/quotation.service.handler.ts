import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FieldItem } from 'src/app/models/common/field-item';
import { ResponseIO } from 'src/app/models/responseIO';
import { BaseService } from 'src/app/system-common/services/base.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OfflineService } from 'src/app/offline/offline.service';

export class QuotationServiceHandler extends BaseService {
  public productFacets: any;
  public companyFacets: any;

  //compareQuotaionResponseIOMap contain productSeq and response io.
  public compareQuotaionResponseIOMap = new Map<number, ResponseIO>();

  constructor(public http: HttpClient, settingService: SettingService, private offlineService: OfflineService) {
    super(http, settingService, 'QUOTATION');
    //console.log('in QuotationServiceHandler constructor');
  }

  public init(modelNameList: string[]) {
    return this.getQuotation(0, modelNameList);
  }

  public load(id: any, modelNameList: string[], isMetadataReqd?: boolean) {
    return this.getQuotation(id, modelNameList, isMetadataReqd);
  }

  public process(id: any, modelNameList: string[]) {
    return this.saveQuotation(id, modelNameList);
  }

  public find(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getQuotationSearchList(executeSearch, searchCriteriaData);
  }

  public findForLanding(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('TrackLeadInIllustrationStage', executeSearch, searchCriteriaData);
    // const body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=TrackLeadInIllustrationStage`,
    //     body
    // );
  }

  public clear() {
    super.clear();
    this.productFacets = undefined;
    this.compareQuotaionResponseIOMap = new Map();
  }

  public findByQuotationRefNum(quotationRefNum: string): Observable<Object> {
    return this.httpGet(`${this.getURLValue('QUOTATION')}?quotationRefNum=${quotationRefNum}`);
  }

  public getLeadSeq(leadId: string) {
    let body: any;
    if (leadId != null && leadId != undefined) {
      body = {
        leadId: leadId,
      };
    }
    let path = `${this.getURLValue('QUOTATION')}/getLeadSeq`;
    return this.httpPost(path, body, undefined, false);
  }

  getApplicableProducts(): Observable<Object> {
    // if (this.id == 0) {
    //   body = {
    //     FormData: {
    //       Models: this.responseIO.data,
    //     },
    //   };
    // } else {
    //   body = '{}';
    // }
    //for bank user we need filter data to be passed.
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let path =
      this.id > 0
        ? `${this.getURLValue('QUOTATION')}/${this.id}/getApplicableProducts`
        : `${this.getURLValue('QUOTATION')}/getApplicableProducts`;
    return this.httpPost(path, body);
  }

  getGenderForTitle(model: any): void {
    //TODO call gender title mapping api
    let title = model.title;
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
        // model.genderCd = respGender.data.values[ 0 ].cd;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getTitleForGender(model: any): void {
    this.setModelFieldValue(model, 'title', 'MR');
    //TODO call gender title mapping api

    // let genderCd = model.genderCd;
    // let respGender: any;
    // let body = {
    //   mappingKey: 'GenderTitle',
    //   drivingValue: genderCd,
    // };
    // this.httpPost(`${this.getURLValue('LOOKUP')}/loadMappingData`, body, undefined, false).subscribe(
    //   (body) => {
    //     respGender = JSON.parse(JSON.stringify(body));
    //     if (respGender.data.values.length == 1)
    //       this.setModelFieldValue(model, 'title', respGender.data.values[0].cd);
    //     // model.genderCd = respGender.data.values[ 0 ].cd;
    //   },
    //   (error) => {
    //     console.log('Error:', error);
    //   }
    // );
  }

  computeAge(model: any): void {
    let dob = model.dob;
    let age = model.age;
    let body = {};
    if (dob != null && dob != undefined && dob != '') {
      body = {
        dob: dob,
        referenceDt: this.responseIO.data.Entity.quotationDt,
      };
    } else if (age != null && age != undefined) {
      body = {
        age: age,
      };
    }

    //alert('calculating age for Date' + new Date(dob).getTime());
    let respCompute: any;

    //console.log(body);
    this.httpPost(`${this.getURLValue('QUOTATION')}/computeAge`, body, undefined, false).subscribe(
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

  private getQuotationSearchList(executeSearch?: boolean, searchCriteriaData?: any) {
    let insuranceTypeCd = this.getSessionStorageValue('insuranceTypeCd');
    if (insuranceTypeCd != undefined) {
      if (insuranceTypeCd == 'LIFE')
        return this.getSearchList('SearchLifeIllustration', executeSearch, searchCriteriaData);
      else if (insuranceTypeCd == 'HOME')
        return this.getSearchList('SearchHomeIllustration', executeSearch, searchCriteriaData);
      else if (insuranceTypeCd == 'TRAVEL')
        return this.getSearchList('SearchTravelIllustration', executeSearch, searchCriteriaData);
      else if (insuranceTypeCd == 'HEALTH')
        return this.getSearchList('SearchHealthIllustration', executeSearch, searchCriteriaData);
      else if (insuranceTypeCd == 'GROUPLIFE' || insuranceTypeCd == 'GROUPHEALTH')
        return this.getSearchList('SearchGroupIllustration', executeSearch, searchCriteriaData);
      else if (insuranceTypeCd == 'AUTO')
        return this.getSearchList('SearchAutoIllustration', executeSearch, searchCriteriaData);
      else return this.getSearchList('SearchIllustration_' + insuranceTypeCd, executeSearch, searchCriteriaData);
    } else {
      return this.getSearchList('SearchLifeIllustration', executeSearch, searchCriteriaData);
    }
    // let body = {};
    // return this.httpPost(
    //     `${this.getURLValue('SEARCH')}?name=SearchLifeIllustration`,
    //     body
    // );
  }

  public initWithProduct(modelNameList: any, isMetadataReqd = true) {
    let body = this.getFetchBody(modelNameList, isMetadataReqd);
    let path = this.getURLValue('QUOTATION');
    let modelNameBodyList = this.getModelNameBodyList(modelNameList);
    if (this.responseIO != null && this.responseIO != undefined) {
      if (this.settingService.getApplicationMode() === 'online') {
        body = this.getPostBody(modelNameBodyList, true);
        return this.httpPost(`${path}`, body);
      } else if (this.settingService.getApplicationMode() === 'offline') {
        return this.saveQuotation(this.id, modelNameBodyList);
      }
    }
  }

  private getQuotation(id: number, modelNameList: any, isMetadataReqd = true) {
    let body = this.getFetchBody(modelNameList, isMetadataReqd);
    let path = this.getURLValue('QUOTATION');
    let insuranceTypeCd = this.getSessionStorageValue('insuranceTypeCd');
    if (id != 0) {
      return this.httpPost(`${path}/${id}`, body);
    } else if (id == 0) {
      if (insuranceTypeCd != undefined) {
        let frmData = {
          Models: {
            Entity: {
              insuranceTypeCd: insuranceTypeCd,
            },
          },
        };
        body['FormData'] = frmData;
      }
      return this.httpPost(`${path}`, body);
    }
  }

  private saveQuotation(id, modelNameList) {
    let body = this.getPostBody(modelNameList, true);
    let path = id == 0 ? `${this.getURLValue('QUOTATION')}` : `${this.getURLValue('QUOTATION')}/${id}`;
    //alert("path: "+path);
    // console.log(JSON.stringify(body));
    console.log(body);
    //remove post request as offline is not working.
    // if (id == 0) return this.httpPut(path, body);
    // else return this.httpPost(path, body);
    return this.httpPut(path, body);
  }

  addSupplementary(): Observable<Object> {
    let body = this.getFetchFormBodyInDynamicAPI(['Entity']);
    return this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}/addSupplementary`, body);
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
        this.setItemOptions(item, respCoverageCityCd.data.values, true);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  getProductFunds(item: FieldItem, callbackMethod?): void {
    let portfolioModelCd = item.model.portfolioModelCd;
    let respFundList: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}/getProductFunds`, body).subscribe(
      (body) => {
        respFundList = JSON.parse(JSON.stringify(body));
        //let newFundList = respFundList.data.FundList;
        this.responseIO.data.BasePlan.FundList = [];
        this.responseIO.data.BasePlan.FundList = respFundList.data.FundList;
        this.refreshMetaData(respFundList);
        if (callbackMethod != undefined && typeof callbackMethod === 'function') {
          callbackMethod();
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  getPortfolioModelCd(item: FieldItem): void {
    let resPortfolioModelCd: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    this.httpPost(
      `${this.getURLValue('QUOTATION')}/${this.id}/getPortfolioModel`,
      body,
      undefined,
      false
    ).subscribe(
      (body) => {
        resPortfolioModelCd = JSON.parse(JSON.stringify(body));
        if (
          resPortfolioModelCd.data.portfolioModel != undefined &&
          resPortfolioModelCd.data.portfolioModel.length == 1
        ) {
          this.setModelFieldValue(item.model, 'portfolioModelCd', resPortfolioModelCd.data.portfolioModel[0].cd);
          this.getProductFunds(item);
        }
        this.setItemOptions(item, resPortfolioModelCd.data.portfolioModel);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  validateQuotation(modelNameListArray: any, action?: string, isMetadataRequired?: boolean): Observable<Object> {
    let modelNameList = [];
    modelNameListArray.filter((name) => {
      let modelNames = {
        ModelName: name,
      };
      modelNameList.push(modelNames);
    });
    if (isMetadataRequired == undefined) isMetadataRequired = false;

    let body = this.getPostBody(modelNameList, isMetadataRequired);
    if (action == undefined) action = 'validateQuotation';

    let path = this.id > 0 ? `${this.getURLValue('QUOTATION')}/${this.id}` : `${this.getURLValue('QUOTATION')}`;

    return this.httpPost(
      path,
      body,
      {
        key: 'action',
        value: action,
      },
      false
    );
  }

  solve(modelNameListArray: any): Observable<Object> {
    let modelNameBodyList = this.getModelNameBodyList(modelNameListArray);
    let body = this.getPostBody(modelNameBodyList);

    let path = this.id > 0 ? `${this.getURLValue('QUOTATION')}/${this.id}` : `${this.getURLValue('QUOTATION')}`;

    return this.httpPost(
      path,
      body,
      {
        key: 'action',
        value: 'solve',
      },
      false
    );
  }

  getProductTerm(item: FieldItem): void {
    let resProductTerm: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}/getProductTerm`, body, undefined, false).subscribe(
      (body) => {
        resProductTerm = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, resProductTerm.data.productTerm);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  getPremiumPayingTerm(item: FieldItem): void {
    let resPremiumPayingTerm: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    this.httpPost(
      `${this.getURLValue('QUOTATION')}/${this.id}/getPremiumPayingTerm`,
      body,
      undefined,
      false
    ).subscribe(
      (body) => {
        resPremiumPayingTerm = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, resPremiumPayingTerm.data.premiumPayingTerm);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  getApplicableRiderPlanOptions(item: FieldItem, basePlanModel: any): void {
    let resApplicablePlanOptions: any;
    let body = {
      applicablePlanOptions: item.model.applicablePlanOptions,
      basePlanProductSeq: basePlanModel.productSeq,
      riderProductSeq: item.model.productSeq,
      basePlanOptionCd: basePlanModel.productPlanOptionCd,
    };
    this.httpPost(
      `${this.getURLValue('QUOTATION')}/${this.id}/getApplicableRiderPlanOptions`,
      body,
      undefined,
      false
    ).subscribe(
      (body) => {
        resApplicablePlanOptions = JSON.parse(JSON.stringify(body));
        this.setItemOptions(item, resApplicablePlanOptions.data.planOption);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  isRidersApplicable() {
    let riderApplc = false;
    if (this.responseIO != null && this.responseIO.data != null) {
      riderApplc = true;
      if (this.productFacets != undefined && this.productFacets.data['RIDERASSOCIATION'] == undefined) {
        riderApplc = false;
      }
      if (
        this.responseIO.data.RiderList == null ||
        this.responseIO.data.RiderList == undefined ||
        (this.responseIO.data.RiderList != undefined && this.responseIO.data.RiderList.length == 0)
      ) {
        riderApplc = false;
      }
    }
    return riderApplc;
  }

  evaluateRider(modelNameList, currentRiderModel: any = null): Observable<Object> {
    let successResponse: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      FetchData: {
        isMetadataRequired: true,
        Models: this.getModelNameBodyList(modelNameList),
      },
      //currentRider: currentRiderModel.object == undefined ? currentRiderModel.id : currentRiderModel.object,
    };

    if (currentRiderModel != undefined)
      body['currentRider'] =
        currentRiderModel.object == undefined ? currentRiderModel.id : currentRiderModel.object;

    let path = this.id > 0 ? `${this.getURLValue('QUOTATION')}/${this.id}` : `${this.getURLValue('QUOTATION')}`;

    return this.httpPost(
      path,
      body,
      {
        key: 'action',
        value: 'evaluateRider',
      },
      false
    );

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
    // this.refreshMetaData(successResponse);
    //
    //         return
    //     },
    //     (error) => {
    //         console.log('Error:', error);
    //     }
    // );
  }

  addTopup(topUpTypeCd: string, model: any): void {
    let response: any;
    let fetchBody = this.getFetchBodyInDynamicAPI();
    let formDataBody = {
      topUpTypeCd: topUpTypeCd,
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let body = Object.assign(formDataBody, fetchBody);
    this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}/addTopup`, body).subscribe(
      (body) => {
        response = JSON.parse(JSON.stringify(body));
        model.push(response.data.Topup);
        // eval('this.responseIO.data.' + modelName).push(response.data.Topup);
        this.refreshMetaData(response);
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
        this.responseIO.data.WithdrawalList.push(response.data.Withdrawal);
        this.refreshMetaData(response);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getQuoteIllustration() {
    // remove id
    let OutputPreferences = this.responseIO.data.OutputPreferences;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let path = this.getURLValue('QUOTATION');
    return this.httpPost(`${path}/${this.id}/viewIllustration`, body, undefined, false);
  }

  getQuoteIllustrationPart() {
    // remove id
    let OutputPreferences = this.responseIO.data.OutputPreferences;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      isFullHTMLRequired: false,
    };
    let path = this.getURLValue('QUOTATION');
    return this.httpPost(`${path}/${this.id}/viewIllustration`, body, undefined, false);
  }

  generateIllustrationPdf() {
    let response: any;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let path = this.getURLValue('QUOTATION');
    return this.httpPost(`${path}/${this.id}/generateIllustrationPdf`, body);
  }

  sendEmail() {
    let body = this.getPostBody(this.getResponseModelNameList());
    let path = this.getURLValue('QUOTATION');
    return this.httpPost(`${path}/${this.id}/sendEmail`, body);
  }

  convertToEapp() {
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
        value: 'convertToEapp',
      },
      true
    );
  }

  refreshEapp() {
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
        value: 'refreshEapp',
      },
      true
    );
  }

  acceptIllustration(modelNameList: any[], isPostModelReq: boolean = true) {
    let body: any;
    if (isPostModelReq) {
      body = this.getPostBody(modelNameList);
    } else {
      body = {
        FetchData: {
          Models: modelNameList,
          isMetadataRequired: true,
          language: this.settingService.getSelectedLanguage(),
          //currentActiveTab: this.currentActiveTab,
        },
      };
    }
    let path = this.id > 0 ? `${this.getURLValue('QUOTATION')}/${this.id}` : `${this.getURLValue('QUOTATION')}`;

    if (this.settingService.getApplicationMode() === 'offline') {
      return this.httpPost(path, body, {
        key: 'action',
        value: 'acceptQuotationRaw',
      });
    } else if (this.settingService.getApplicationMode() === 'online') {
      return this.httpPost(path, body, {
        key: 'action',
        value: 'acceptQuotation',
      });
    }
  }

  getIllustrationValuesByFacet(isBodyReq?: boolean): Observable<Object> {
    if (isBodyReq == undefined) isBodyReq = false;
    let body = {};
    if (isBodyReq) {
      body = {
        FormData: {
          Models: this.responseIO.data,
        },
      };
    }
    return this.httpPost(`${this.getURLValue('QUOTATION')}/${this.id}/getIllustrationValuesByFacet`, body);
  }

  getProductUIFacets(productSeq): Observable<Object> {
    let body = {
      productSeq: productSeq,
    };
    let path = this.getURLValue('PRODUCT');
    return this.httpPost(`${path}/getUIFacets`, body);
  }

  getConfigFacets(productSeq: number, prdBody?: any): Observable<Object> {
    let body = prdBody;
    if (body == undefined) {
      body = {
        productSeq: productSeq,
      };
    }
    let path = this.getURLValue('PRODUCT');
    return this.httpPost(`${path}/getConfigFacets`, body);
  }

  copyQuotation(id: number): Observable<Object> {
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
    return this.httpPost(`${this.getURLValue('QUOTATION')}/${id}`, body, {
      key: 'action',
      value: 'copyQuotation',
    });
  }

  deleteQuotation(id: number): Observable<Object> {
    let body = '{}';
    return this.httpPost(`${this.getURLValue('QUOTATION')}/${id}/deleteQuotation`, body);
  }

  deleteQuotations(ids: any[]): Observable<Object> {
    let body = { ids: ids.join(',') };
    return this.httpPost(`${this.getURLValue('QUOTATION')}/deleteQuotation`, body);
  }

  public clearPartyDetails(partyModel: any): void {
    Object.keys(partyModel).forEach((key: any) => {
      // console.log(key);
      if (
        key != 'id' &&
        key != 'guid' &&
        key != 'versionID' &&
        key != 'status' &&
        key != 'roleCd' &&
        typeof partyModel[key] != 'object'
      ) {
        this.setModelFieldValue(partyModel, key, null);
      } else if (partyModel[key] != undefined && typeof partyModel[key] === 'object') {
        //this is required child model of party ie. party address
        this.clearPartyDetails(partyModel[key]);
      }
    });
  }
  generateIllustrationPdfOnID(id) {
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
    };
    let path = this.getURLValue('QUOTATION');
    return this.httpPost(`${path}/${id}/generateIllustrationPdf`, body);
  }

  public getOutputPreferences(id: number) {
    let modelNameList = ['Entity', 'OutputPreferences'];
    let body = this.getFetchBody(this.getModelNameBodyList(modelNameList), true);
    return this.httpPost(`${this.getURLValue('QUOTATION')}/${id}/getOutputPreferences`, body);
  }

  getOccupationClass(item: FieldItem, selectedOption?: any): void {
    let natureOfDuty = item.model.natureOfDuty;
    let industryCd = item.model.industryCd;
    if (natureOfDuty == 'OTHERS' || industryCd == 'OTHERS') {
      let respOccupationCd: any;
      let body = {
        onlineLookupKey: 'OCCUPATIONCLASS',
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
      this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false).subscribe(
        (body) => {
          respOccupationCd = JSON.parse(JSON.stringify(body));
          this.setItemOptions(item, respOccupationCd.data.values, true);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
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

    let body = {
      onlineLookupKey: 'PINCODECOUNTRYCITY',
      onlineFilterCond: onlineFilterCond,
      offlineLookupKey: 'PINCODECOUNTRYCITY',
      offlineFilterCond: {
        pinCode: pinCode,
        countryCd: countryCd,
        stateCd: stateCd,
      },
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

  async getQuoteIllustrationOfflineNative() {
    let OutputPreferences = this.responseIO.data.OutputPreferences;
    let body = {
      FormData: {
        Models: this.responseIO.data,
      },
      id: this.id,
    };

    let result = await this.offlineService.generateHtml(JSON.stringify(body));
    return result;
  }
}
