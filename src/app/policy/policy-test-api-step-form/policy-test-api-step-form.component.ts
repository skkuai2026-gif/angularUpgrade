import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OfflineService } from 'src/app/offline/offline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/policy/services/policy.service';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PolicyStepFormComponent } from '../policy-step-form/policy-step-form.component';
import { Location } from '@angular/common';

@Component({
  selector: 'sym-policy-test-api-step-form',
  templateUrl: './policy-test-api-step-form.component.html',
  styleUrls: ['./policy-test-api-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyTestApiStepFormComponent extends PolicyStepFormComponent implements OnInit {
  public apiResponseData = null;
  public responseUpdated = false;
  public apiRequestData = { value: null };
  public scrollPosition = 0;
  @Input() restApiDataInfo: any;
  constructor(
    service: PolicyService,
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
    if (this.restApiDataInfo != undefined) {
      this.id = 7605; //hardcoded sequence from aws db
    }
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['restApiDataInfo'] && changes['restApiDataInfo'].currentValue) {
      setTimeout(() => {
        this.headerService.pageHeader = this.getPageHeader();
        this.setSelectedStepAndActiveTab();
        if (this.restApiDataInfo.screenReqdFl == 'NO') this.restApiCall(this.restApiDataInfo.apiName);
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
              'PartyQuestionnaireResponseList',
              'InitialOtherPayerParty',
              'InitialPayment',
              'RenewalOtherPayerParty',
              'RenewalPayment',
              'RefundPayment',
              'NomineeList',
              'Appointee',
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
    header.title = 'Policy : Test Api';
    if (this.restApiDataInfo != undefined) header.title = 'Policy : ' + this.restApiDataInfo.apiDesc + ' API';
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

  protected preStepSelection(nextStepObj: StepItem): void {
    // do nothing
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
    ];
  }

  async sendRequest(modifiedRequest: any) {
    let optCd = this.restApiDataInfo.apiName;
    if (modifiedRequest.value != undefined) {
      this.apiRequestData.value = modifiedRequest.value;
    }

    //in save policy api,copy response data into request data,so solve row was updated issue.
    if (optCd == 'savePolicy' || optCd == 'submitPolicy') {
      let apiRequestData = JSON.parse(this.apiRequestData.value);
      let apiResponseData = JSON.parse(this.apiResponseData);
      apiRequestData.body.FormData.Models = apiResponseData.data;
      this.apiRequestData.value = JSON.stringify(apiRequestData, null, '\t');
    }
    this.apiResponseData = undefined;
    this.apiResponseData = await this.service.sendRequest(this.apiRequestData.value, this.scrollPosition);
    //in save policy api,copy response data into service response io,so solve row was updated issue.
    if (optCd == 'savePolicy' || optCd == 'getPolicy' || optCd == 'submitPolicy') {
      this.service.responseIO = JSON.parse(this.apiResponseData);
      this.service.id = this.service.responseIO.data.Entity.id;
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

  setSelectedStepAndActiveTab() {
    if (this.selectedStep == undefined) {
      this.selectedStep = this.stepList[0];
      this.setSelectedActiveTab(this.selectedStep.tabList[0]);
    } else if (this.selectedStep.selectedTab == undefined) {
      this.setSelectedActiveTab(this.selectedStep.tabList[0]);
    }
  }
  restApiCall(selectedApiCd: string) {
    try {
      eval('this.' + selectedApiCd + '()');
    } catch (e) {
      alert('Initialization error. Please select another API and try again.' + e);
    }
  }

  successApiResponse(successResponse: Object, trimRequestReq: boolean) {
    if (trimRequestReq) this.service.trimRequest();
    this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
    this.apiResponseData = JSON.stringify(successResponse, null, '\t');
    this.openModal('apiRequest');
  }

  errorApiResponse(error: any) {
    alert(error.error);
    this.apiResponseData = undefined;
    console.log('Error:', error);
    this.openModal('apiRequest');
  }

  getQuestionnaire() {
    let modelNameListArray = ['Entity', 'PartyQuestionnaireResponseList'];
    this.service.validatePolicy(modelNameListArray, true).subscribe(
      (successResponse) => {
        //temp store questionnaire list,because after send request,it get lost from
        let tempPartyQuestionnaireResponseList =
          this.service.httpReq.body.FormData.Models.PartyQuestionnaireResponseList;
        this.service.httpReq.body.FormData.Models.PartyQuestionnaireResponseList = null;
        this.successApiResponse(successResponse, true);
        this.service.responseIO.data['PartyQuestionnaireResponseList'] = tempPartyQuestionnaireResponseList;
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  getReflexiveQuestionnaire() {
    let questionBody;
    if (this.service.reflexiveQuestionBody != undefined) questionBody = this.service.reflexiveQuestionBody;
    else {
      questionBody = {
        currDataElementCd: 'MD10',
        currPartyGuid: '1806f6902cbe1c9810a6cc180000e5b4',
        currQuestionSetCd: 'MEDICALINFOPS2',
        currResponseValue: 'YES',
      };
    }
    this.service.getReflexiveQuestionnaire(questionBody).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  getPolicy() {
    let id = this.service.responseIO != null ? this.service.responseIO.data.Entity.id : 7605;
    this.service.load(id, null).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, false);
        this.service.id = this.service.responseIO.data.Entity.id;
      },
      (error) => {
        this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
        this.errorApiResponse(error);
      }
    );
  }

  savePolicy() {
    let modelNameBodyList = this.service.getModelNameBodyList(this.getStepList()[0].tabList[0].modelList);
    this.service.process(this.service.responseIO.data.Entity.id, modelNameBodyList).subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  autoUnderwrite() {
    this.service.autoUnderwrite().subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }

  public copyToClipboard(dataElement) {
    dataElement.select();
    dataElement.setSelectionRange(0, dataElement.value.length);
  }

  onInputChange(opt) {}
  onInputFocus(event) {}

  submitPolicy() {
    this.service.submitPolicy().subscribe(
      (successResponse) => {
        this.successApiResponse(successResponse, true);
      },
      (error) => {
        this.errorApiResponse(error);
      }
    );
  }
}
