import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { CSASLGFIStepFormComponent } from '../csa-slgfi-step-form/csa-slgfi-step-form.component';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';

@Component({
  selector: 'sym-csa-slgfi-test-api-step-form',
  templateUrl: './csa-slgfi-test-api-step-form.component.html',
  styleUrls: ['./csa-slgfi-test-api-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSASLGFITestApiStepFormComponent extends CSASLGFIStepFormComponent implements OnInit {
  public apiResponseData = null;
  public responseUpdated = false;
  public apiRequestData = { value: null };
  public scrollPosition = 0;
  public displayPopupApiResponse: boolean;
  @Input() restApiDataInfo: any;
  public createCSACallCounter = 0; //to solve guid duplication issue,create new guid if counter gretter than 1.

  constructor(
    service: CSASLGFIService,
    route: ActivatedRoute,
    public router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
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

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.title = 'CSA : Test Api';
    if (this.restApiDataInfo != undefined) header.title = 'CSA : ' + this.restApiDataInfo.apiDesc + ' API';
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

  getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_testApiDetails',
        [
          {
            id: 'tab_basic',
            modelList: [
              'FNAParty',
              'FNARequestAdditionalAllList',
              'FNAFundList',
              'LeadRPQ',
              'ServiceSignatureList',
            ],
          },
        ],
        ['but_Request']
      ),
    ];

    return stepList;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['restApiDataInfo'] && changes['restApiDataInfo'].currentValue) {
      setTimeout(() => {
        console.log(this.restApiDataInfo.screenReqdFl);
        this.headerService.pageHeader = this.getPageHeader();
        if (this.restApiDataInfo.screenReqdFl == 'NO') this.restApiCall(this.restApiDataInfo.apiName);
        this.displayPopupApiResponse = false;
      }, 10);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  async sendRequest(tempRequest) {
    let apiName = this.restApiDataInfo.apiName;
    if (tempRequest.value != undefined) {
      this.apiRequestData.value = tempRequest.value;
    }

    //in save CSA api,copy response data into request data,so solve row was updated issue.
    if (apiName == 'saveCSA') {
      let apiRequestData = JSON.parse(this.apiRequestData.value);
      let apiResponseData = JSON.parse(this.apiResponseData);
      apiRequestData.body.FormData.Models = apiResponseData.data;
      this.apiRequestData.value = JSON.stringify(apiRequestData, null, '\t');
    } else if (apiName == 'createCSA') {
      //this.updateCSAGuid(true);
    }
    this.apiResponseData = undefined;
    this.apiResponseData = await this.service.sendRequest(this.apiRequestData.value, this.scrollPosition);
    //in save CSA api,copy response data into service response io,so solve row was updated issue.
    if (apiName == 'saveCSA' || apiName == 'getCSA') {
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
    try {
      eval('this.' + selectedApiCd + '()');
    } catch (e) {
      this.error('Initialization error. Please select another API and try again.' + e);
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

  initCSA() {
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

  getCSA() {
    let id = undefined;
    if (this.service.responseIO != undefined) id = this.service.responseIO.data.Entity.id;
    if (id == undefined || id == null || id == '') {
      this.error('Id is required to get CSA. Enter valid Id.', undefined, true);
      id = 2366;
    }
    let modelNameBodyList = this.service.getModelNameBodyList(this.getStepList()[0].tabList[0].modelList);
    if (id != undefined || id != null || id != '') {
      this.service.load(id, null).subscribe(
        (successResponse) => {
          console.log('success: ', successResponse);
          this.successApiResponse(successResponse, false);
        },
        (error) => {
          console.log('error: ', error);
          this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
          this.errorApiResponse(error);
        }
      );
    }
  }

  computeRiskScoreClick() {
    this.saveCSA;
  }
  saveCSA() {
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

  onPopupClosed(event) {
    this.displayPopupApiResponse = false;
  }

  getCSAHtml() {
    if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data != undefined &&
      this.service.responseIO.data.Entity != undefined
    ) {
      this.service.id = this.service.responseIO.data.Entity.id;
    }
    this.service.getCSAPreview().subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  createQuotation() {
    if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data != undefined &&
      this.service.responseIO.data.Entity != undefined
    ) {
      this.service.id = this.service.responseIO.data.Entity.id;
    }
    this.service.createQuotation().subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }
}
