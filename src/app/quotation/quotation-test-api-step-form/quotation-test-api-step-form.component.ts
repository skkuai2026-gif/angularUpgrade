import { ResponseIO } from 'src/app/models/responseIO';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { Location } from '@angular/common';
import { QuotationStepFormHandlerComponent } from '../quotation-step-form/quotation-step-form.handler';
import { FieldItem } from 'src/app/models/common/field-item';
import { OfflineService } from '../../offline/offline.service';

@Component({
  selector: 'sym-quotation-test-api-step-form',
  templateUrl: './quotation-test-api-step-form.component.html',
  styleUrls: ['./quotation-test-api-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationTestApiStepFormComponent
  extends QuotationStepFormHandlerComponent
  implements OnInit, OnChanges
{
  options = [];
  public apiResponseData = null;
  public responseUpdated = false;
  public apiRequestData = { value: null };
  public scrollPosition = 0;
  public displayPopupApiResponse: boolean;
  @Input() restApiDataInfo: any;
  public createQuotationCallCounter = 0; //to solve guid duplication issue,create new guid if counter gretter than 1.

  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    public offlineService: OfflineService,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['restApiDataInfo'] && changes['restApiDataInfo'].currentValue) {
      setTimeout(() => {
        this.headerService.pageHeader = this.getPageHeader();
        if (this.restApiDataInfo.screenReqdFl == 'NO') this.restApiCall(this.restApiDataInfo.apiName);
        this.displayPopupApiResponse = false;
      }, 10);
    }
  }

  getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_testApiDetails',
        [
          {
            id: 'tab_basic',
            modelList: [
              'Entity',
              'BasePlan',
              'RiderList',
              'Proposer',
              'PrimaryInsured',
              'JointLife',
              'SupplementaryList',
              'InitialInvestment',
              'RegularTopup',
              'AdHocTopupList',
              'TransferTopupList',
              'WithdrawalList',
              'AdditionalFieldsList',
              'OutputPreferences',
              'EmailRequest',
              'ServiceSignatureList',
            ],
          },
        ],
        ['but_Request']
      ),
    ];

    return stepList;
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.title = 'Quotation : Test Api';
    if (this.restApiDataInfo != undefined) {
      header.title = 'Quotation : ' + this.restApiDataInfo.apiDesc + ' API';
      header.additionalInfo = '( ' + this.restApiDataInfo.apiInfoDetails + ' )';
    }
    if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data['BasePlan'] != undefined &&
      ((this.service.responseIO.data['BasePlan'].productSeq != undefined &&
        this.service.responseIO.data['BasePlan'].productSeq != null) ||
        (this.service.responseIO.data['BasePlan'].productId != undefined &&
          this.service.responseIO.data['BasePlan'].productId != null))
    ) {
      let productDesc = this.service.responseIO.data['BasePlan'].productLongName;
      header.title = header.title + ' for ' + productDesc;
    }

    return header;
  }

  protected postInit() {
    super.postInit();
    this.service.responseIO['isMetadataHelpReqd'] = true;
  }

  protected postLoad() {
    super.postLoad();
    this.service.responseIO['isMetadataHelpReqd'] = true;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
    ];
  }

  async sendRequest(tempRequest) {
    let apiName = this.restApiDataInfo.apiName;
    if (tempRequest.value != undefined) {
      this.apiRequestData.value = tempRequest.value;
    }

    //in save policy api,copy response data into request data,so solve row was updated issue.
    if (apiName == 'saveQuotation') {
      let apiRequestData = JSON.parse(this.apiRequestData.value);
      let apiResponseData = JSON.parse(this.apiResponseData);
      apiRequestData.body.FormData.Models = apiResponseData.data;
      this.apiRequestData.value = JSON.stringify(apiRequestData, null, '\t');
    } else if (apiName == 'createQuotation') {
      this.updateQuotationGuid(true);
    }
    this.apiResponseData = undefined;
    this.apiResponseData = await this.service.sendRequest(this.apiRequestData.value, this.scrollPosition);
    //in save policy api,copy response data into service response io,so solve row was updated issue.
    if (apiName == 'saveQuotation' || apiName == 'getQuotation') {
      this.service.responseIO = JSON.parse(this.apiResponseData);
      this.service.responseIO.isMetadataHelpReqd = true;
    }
  }

  but_Request_click() {
    if (this.restApiDataInfo.apiName == undefined || this.restApiDataInfo.apiName == 'null') {
      this.warn('Please select a valid Api', undefined, true);
      return;
    }
    this.restApiCall(this.restApiDataInfo.apiName);
  }

  restApiCall(selectedApiCd: string) {
    if (this.selectedStep == undefined) {
      this.selectedStep = this.stepList[0];
      this.setSelectedActiveTab(this.selectedStep.tabList[0]);
    }
    if (selectedApiCd == 'calculateIllustration' || selectedApiCd == 'generateIllustrationPdf') {
      this.service.responseIO.data['BasePlan'].productSeq = undefined;
      this.service.responseIO.data['BasePlan'].productVersion = undefined;
    }
    try {
      eval('this.' + selectedApiCd + '()');
    } catch (e) {
      this.error('Initialization error. Please select another API and try again.' + e);
    }
  }

  public onRiderPanelCollapsed(isCollapsed: boolean) {
    if (!isCollapsed) {
      this.service.evaluateRider(this.selectedStep.selectedTab.modelList).subscribe(
        (body) => {
          this.service.responseIO = JSON.parse(JSON.stringify(body));
          this.service.responseIO['isMetadataHelpReqd'] = true;
          this.responseUpdated = true;
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    } else {
      this.responseUpdated = false;
    }
  }

  public copyToClipboard(dataElement: {
    select: () => void;
    setSelectionRange: (arg0: number, arg1: any) => void;
    value: string | any[];
  }) {
    dataElement.select();
    dataElement.setSelectionRange(0, dataElement.value.length);
  }

  onInputChange(opt: any) {}
  onInputFocus(event: any) {}

  protected productSeq_change(item: FieldItem) {
    if (
      this.service.responseIO.data['BasePlan'].productSeq != undefined &&
      this.service.responseIO.data['BasePlan'].productSeq != null
    ) {
      this.service.initWithProduct(this.selectedStep.selectedTab.modelList).subscribe(
        (body) => {
          this.service.responseIO = JSON.parse(JSON.stringify(body));
          this.headerService.pageHeader = this.getPageHeader();
          this.postInit();
          console.log('Data Init successful.');
        },
        (error) => {
          console.log('Data Init failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  protected productId_change(item: FieldItem) {
    if (
      this.service.responseIO.data['BasePlan'].productId != undefined &&
      this.service.responseIO.data['BasePlan'].productId != null
    ) {
      this.service.initWithProduct(this.selectedStep.selectedTab.modelList).subscribe(
        (body) => {
          this.service.responseIO = JSON.parse(JSON.stringify(body));
          this.headerService.pageHeader = this.getPageHeader();
          this.postInit();
          console.log('Data Init successful.');
        },
        (error) => {
          console.log('Data Init failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  onChangeProductClick() {
    this.service.responseIO.data['BasePlan'].productSeq = undefined;
    this.service.responseIO.data['BasePlan'].productId = undefined;
    this.service.responseIO.data['BasePlan'].productVersion = undefined;
  }

  successApiResponse(successResponse: Object, trimRequestReq: boolean) {
    if (trimRequestReq) this.service.trimRequest();
    this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
    this.apiResponseData = JSON.stringify(successResponse, null, '\t');
    this.displayPopupApiResponse = true;
    this.openModal('apiRequest');
    if (this.restApiDataInfo != undefined && this.restApiDataInfo.screenReqdFl == 'NO') {
      this.openPopup('defaultPopup');
    }
  }

  errorApiResponse(error: any) {
    this.error(error.error);
    this.apiResponseData = undefined;
    this.displayPopupApiResponse = true;
    console.log('Error:', error);
    this.openModal('apiRequest');
  }

  occupationSearch() {
    this.service.getSearchList('SearchIndustryOccupation', true, null).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.createQuotationCallCounter = 0;
  }

  initQuotation() {
    let modelNameBodyList = this.getModelNameBodyList(this.selectedStep.selectedTab.modelList);
    this.service.init(modelNameBodyList).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  getIllustrationHtml() {
    this.service.getQuoteIllustration().subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  evaluateRider() {
    this.service.evaluateRider(this.selectedStep.selectedTab.modelList).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  createQuotation() {
    let modelNameBodyList = this.service.getModelNameBodyList(this.getStepList()[0].tabList[0].modelList);
    let id = 0;
    this.updateQuotationGuid(false);
    this.service.process(id, modelNameBodyList).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  updateQuotationGuid(isResendRequest: boolean) {
    this.createQuotationCallCounter++;
    if (this.createQuotationCallCounter > 1) {
      if (isResendRequest) {
        let apiRequestData = JSON.parse(this.apiRequestData.value);
        apiRequestData.body.FormData.Models.Entity.guid = this.service.generateGuid();
        this.apiRequestData.value = JSON.stringify(apiRequestData, null, '\t');
      } else {
        this.service.responseIO.data.Entity.guid = this.service.generateGuid();
      }
    }
  }

  saveQuotation() {
    let modelNameBodyList = this.service.getModelNameBodyList(this.getStepList()[0].tabList[0].modelList);
    let id = this.service.responseIO.data.Entity.id;
    if (id == null) id = 0;
    this.service.process(id, modelNameBodyList).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
        //updating service response io,update version id ,to solve row was updated issue.
        this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
        this.service.responseIO.isMetadataHelpReqd = true;
        this.service.id = this.service.responseIO.data.Entity.id;
        this.displayPopupApiResponse = true;
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  getProductData() {
    let productSeq = null;
    let prdBody = undefined;
    if (
      this.restApiDataInfo != undefined &&
      this.restApiDataInfo.apiRequestJSON != undefined &&
      this.restApiDataInfo.apiRequestJSON != null
    ) {
      prdBody = JSON.parse(this.restApiDataInfo.apiRequestJSON);
    } else if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data['BasePlan'] &&
      this.service.responseIO.data['BasePlan'].productSeq != null
    )
      productSeq = this.service.responseIO.data['BasePlan'].productSeq;
    else if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data['Entity'] &&
      this.service.responseIO.data['Entity'].baseProductSeq != null
    )
      productSeq = this.service.responseIO.data['Entity'].baseProductSeq;

    this.service.getConfigFacets(productSeq, prdBody).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  getApplicableProducts() {
    this.service.getApplicableProducts().subscribe(
      (successResponse) => {
        //temp store base plan since we dont want to display in request
        let tempBasePlan = this.service.httpReq.body.FormData.Models.BasePlan;
        let tempRiderList = this.service.httpReq.body.FormData.Models.RiderList;
        this.service.httpReq.body.FormData.Models.BasePlan = null;
        this.service.httpReq.body.FormData.Models.RiderList = null;
        this.service.responseIO.data['BasePlan'] = tempBasePlan;
        this.service.responseIO.data['RiderList'] = tempRiderList;
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  acceptIllustration() {
    if (this.service.responseIO.data.Entity.id == undefined) {
      this.error('Quotation needs to be saved before accept illustration.', undefined, true);
      return;
    }
    let modelNameBodyList = this.service.getModelNameBodyList(this.getStepList()[0].tabList[0].modelList);
    this.service.acceptIllustration(modelNameBodyList, false).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  convertToEapp() {
    if (this.service.responseIO.data.Entity.id == undefined) {
      this.error('Quotation needs to be saved before converting to E-app.', undefined, true);
      return;
    }
    this.service.convertToEapp().subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  getQuotation() {
    let id = this.service.responseIO.data.Entity.id;
    if (id == undefined) {
      this.error('Id is required to get Quotation.Enter valid Id.', undefined, true);
      id = 10660;
      //this.openModal('apiRequest');
      //return;
    }
    let modelNameBodyList = this.service.getModelNameBodyList(this.getStepList()[0].tabList[0].modelList);
    if (id != undefined) {
      this.service.load(id, null).subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, false);
        },
        (error) => {
          this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
          this.errorApiResponse(error);
        }
      );
    }
  }

  generateIllustrationPdf() {
    this.service.generateIllustrationPdf().subscribe(
      (successResponse) => {
        let respData = JSON.parse(JSON.stringify(successResponse));
        if (this.settingService.getApplicationMode() === 'online') {
          this.downloadOrOpenContent(respData.data.pdfFileContents, 'pdf', 'download');
        } else if (this.settingService.getApplicationMode() === 'offline') {
          this.offlineService.openPdf(respData.data.pdfFileContents);
        }
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  calculatePremium() {
    let modelNameListArray = ['BasePlan', 'RiderList'];
    this.service.validateQuotation(modelNameListArray, 'calculatePremium').subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  validateQuotation() {
    let modelNameListArray = this.selectedStep.selectedTab.modelList;
    this.service.validateQuotation(modelNameListArray).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  computeAge() {
    let body;
    if (this.restApiDataInfo != undefined && this.restApiDataInfo.apiRequestJSON != undefined)
      body = JSON.parse(this.restApiDataInfo.apiRequestJSON);
    if (body == undefined) body = { age: 21 };
    this.service
      .httpPost(`${this.settingService.getURLValue('QUOTATION')}/computeAge`, body, undefined, false)
      .subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, false);
        },
        (error) => {
          this.errorApiResponse(error);
        }
      );
  }

  getProductTerm() {
    let resProductTerm: any;
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service
      .httpPost(
        `${this.settingService.getURLValue('QUOTATION')}/${this.id}/getProductTerm`,
        body,
        undefined,
        false
      )
      .subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, true);
        },
        (error) => {
          this.errorApiResponse(error);
        }
      );
  }

  getPortfolioModelCd() {
    let resPortfolioModelCd: any;
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service
      .httpPost(
        `${this.settingService.getURLValue('QUOTATION')}/${this.id}/getPortfolioModel`,
        body,
        undefined,
        false
      )
      .subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, true);
        },
        (error) => {
          this.errorApiResponse(error);
        }
      );
  }

  getPremiumPayingTerm(): void {
    let resPremiumPayingTerm: any;
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service
      .httpPost(
        `${this.settingService.getURLValue('QUOTATION')}/${this.id}/getPremiumPayingTerm`,
        body,
        undefined,
        false
      )
      .subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, true);
        },
        (error) => {
          this.errorApiResponse(error);
        }
      );
  }

  getProductFunds(): void {
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service
      .httpPost(`${this.settingService.getURLValue('QUOTATION')}/${this.id}/getProductFunds`, body)
      .subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, true);
        },
        (error) => {
          this.errorApiResponse(error);
        }
      );
  }

  getApplicableRiderPlanOptions(): void {
    if (this.service.responseIO.data.RiderList.length > 0) {
      let body = {
        applicablePlanOptions: this.service.responseIO.data.RiderList[0].applicablePlanOptions,
        basePlanProductSeq: this.service.responseIO.data.BasePlan.productSeq,
        riderProductSeq: this.service.responseIO.data.RiderList[0].productSeq,
        basePlanOptionCd: this.service.responseIO.data.BasePlan.productPlanOptionCd,
      };
      this.service
        .httpPost(
          `${this.settingService.getURLValue('QUOTATION')}/${this.id}/getApplicableRiderPlanOptions`,
          body,
          undefined,
          false
        )
        .subscribe(
          (successResponse) => {
            this.successApiResponse(successResponse, false);
          },
          (error) => {
            this.errorApiResponse(error);
          }
        );
    }
  }

  addTopup(): void {
    let body = {};
    this.service.httpPost(`${this.settingService.getURLValue('QUOTATION')}/addTopup`, body).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  addWithdrawal(): void {
    let body = {};
    this.service.httpPost(`${this.settingService.getURLValue('QUOTATION')}/addWithdrawal`, body).subscribe(
      (successResponse: any) => {
        this.successApiResponse(successResponse, false);
      },
      (error: any) => {
        this.errorApiResponse(error);
      }
    );
  }

  addSupplementary(): void {
    let body = {};
    this.service.httpPost(`${this.settingService.getURLValue('QUOTATION')}/addSupplementary`, body).subscribe(
      (successResponse: any) => {
        this.successApiResponse(successResponse, false);
      },
      (error: any) => {
        this.errorApiResponse(error);
      }
    );
  }

  getQuotationSearchList() {
    this.service.getSearchList('SearchLifeIllustration', true, null).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  findByQuotationNum() {
    if (this.service.responseIO.data.Entity.quotationRefNum == undefined) {
      this.error('Quotation ref number is required to get Quotation.', undefined, true);
      this.service.responseIO.data.Entity.quotationRefNum = 'HOON00003274';
      //this.openModal('apiRequest');
      //return;
    }

    if (this.service.responseIO.data.Entity.quotationRefNum != undefined) {
      this.service.findByQuotationRefNum(this.service.responseIO.data.Entity.quotationRefNum).subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, false);
        },
        (error) => {
          this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
          this.errorApiResponse(error);
        }
      );
    }
  }

  getIllustrationValuesByFacet() {
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service
      .httpPost(`${this.settingService.getURLValue('QUOTATION')}/getIllustrationValuesByFacet`, body)
      .subscribe(
        (successResponse: any) => {
          this.successApiResponse(successResponse, false);
        },
        (error: any) => {
          this.errorApiResponse(error);
        }
      );
  }

  calculateIllustration() {
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service.httpPost(`${this.settingService.getURLValue('QUOTATION')}/calculateIllustration`, body).subscribe(
      (successResponse: any) => {
        this.successApiResponse(successResponse, false);
      },
      (error: any) => {
        this.errorApiResponse(error);
      }
    );
  }

  copyQuotation() {
    let id = this.service.responseIO.data.Entity.id;
    if (id == undefined) {
      this.error('Id is required to copy Quotation.Enter valid Id.', undefined, true);
      id = 10660;
      //this.openModal('apiRequest');
      //return;
    }

    if (id != undefined) {
      this.service.copyQuotation(id).subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, false);
        },
        (error) => {
          this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
          this.errorApiResponse(error);
        }
      );
    }
  }

  deleteQuotation() {
    if (this.service.responseIO.data.Entity.id == undefined) {
      this.error('Id is required to delete Quotation.Enter valid Id.', undefined, true);
      this.service.responseIO.data.Entity.id = 1111;
      //this.openModal('apiRequest');
      //return;
    }

    if (this.service.responseIO.data.Entity.id != undefined) {
      this.service.deleteQuotation(this.service.responseIO.data.Entity.id).subscribe(
        (successResponse) => {
          this.successApiResponse(successResponse, false);
        },
        (error) => {
          this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
          this.errorApiResponse(error);
        }
      );
    }
  }

  saveNgenerateIlustrationPdf() {
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service
      .httpPost(
        `${this.settingService.getURLValue('QUOTATION')}`,
        body,
        {
          key: 'action',
          value: 'saveNgenerateIlustrationPdf',
        },
        true
      )
      .subscribe(
        (successResponse: any) => {
          this.successApiResponse(successResponse, false);
        },
        (error: any) => {
          this.errorApiResponse(error);
        }
      );
  }

  sendEmail() {
    if (this.service.responseIO.data.Entity.id == undefined) {
      this.error('Quotation needs to be saved before sending Email.', undefined, true);
      return;
    }

    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service
      .httpPost(
        `${this.settingService.getURLValue('QUOTATION')}/${this.service.responseIO.data.Entity.id}/sendEmail`,
        body
      )
      .subscribe(
        (successResponse: any) => {
          this.successApiResponse(successResponse, false);
        },
        (error: any) => {
          this.errorApiResponse(error);
        }
      );
  }

  getRiderPartyList() {
    let body = {
      FormData: {
        Models: this.service.responseIO.data,
      },
    };
    this.service.httpPost(`${this.settingService.getURLValue('QUOTATION')}/getRiderPartyList`, body).subscribe(
      (successResponse: any) => {
        this.successApiResponse(successResponse, false);
      },
      (error: any) => {
        this.errorApiResponse(error);
      }
    );
  }

  targetFundValueSolver() {
    this.service.responseIO.data.Entity.currentSolverFacetId = 'TARGETFUNDVALUESOLVER';
    let modelNameListArray = ['BasePlan', 'RegularTopup'];

    this.service.solve(modelNameListArray).subscribe(
      (successResponse: any) => {
        this.successApiResponse(successResponse, false);
      },
      (error: any) => {
        this.errorApiResponse(error);
      }
    );
  }
  onPopupClosed(event) {
    this.displayPopupApiResponse = false;
  }
}
