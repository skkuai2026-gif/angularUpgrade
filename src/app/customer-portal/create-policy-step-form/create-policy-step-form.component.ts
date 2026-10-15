import { TabItem } from 'src/app/models/common/tab-items';
import { FieldItem } from './../../models/common/field-item';
import { ResponseIO } from './../../models/responseIO';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from 'src/app/quotation/services/quotation.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { Location } from '@angular/common';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { PolicyService } from 'src/app/policy/services/policy.service';
import { QuotationStepFormHandlerComponent } from 'src/app/quotation/quotation-step-form/quotation-step-form.handler';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';

@Component({
  selector: 'sym-create-policy-step-form',
  templateUrl: './create-policy-step-form.component.html',
  styleUrls: ['./create-policy-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreatePolicyStepFormComponent extends QuotationStepFormHandlerComponent {
  isProductSelected: boolean;
  isTriggerOtpBtn: boolean;
  isTriggerAadharOtpBtn: boolean;
  isPolicySubmitted: boolean;
  previousEmailId: string;
  isSuitabilityAnalysisDisplayed: boolean;
  analysisText: string;
  isOutputPreferenceReq: boolean;
  public fullNameText: string = '';
  public productNameText: string = '';
  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService,
    public policyService: PolicyService
  ) {
    super(service, route, router, location, settingService, headerService);
    this.policyService = policyService;
    this.isTriggerOtpBtn = false;
    this.isTriggerAadharOtpBtn = false;
    this.settingService.loadExternalStyle('customer_styles.css');
    this.isPolicySubmitted = false;
    this.isSuitabilityAnalysisDisplayed = false;
    this.analysisText = 'Help me select a Product';
    this.isOutputPreferenceReq =
      SettingService.getApplicationPropertiesValue('ISOUTPUTPREFERENCESREQ') == 'YES' ? true : false;
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.service.id != 0) {
      this.isProductSelected = true;
    } else {
      this.isProductSelected = false;
    }
  }

  protected async postLoad(nextStepObj?: StepItem) {
    super.postLoad();
    await this.resetStep(nextStepObj);
    if (
      this.policyService.responseIO != undefined &&
      !this.isPolicySubmitted &&
      this.policyService.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS'
    ) {
      this.isPolicySubmitted = true;
      this.setSelectedStep(this.stepList[this.stepList.length - 1], null);
      this.but_PolicySubmit_click();
    }
  }
  protected async resetStep(nextStepObj: StepItem) {
    let quotationRefNum: string = this.service.responseIO.data.Entity.quotationRefNum;
    let isPolicyStep: boolean = true;
    if (
      nextStepObj != undefined &&
      (nextStepObj.id == 'step_yourDetails' ||
        nextStepObj.id == 'step_Coverage' ||
        nextStepObj.id == 'step_quoteSummary')
    )
      isPolicyStep = false;
    if (
      quotationRefNum != undefined &&
      this.service.responseIO.data.Entity.quoteStatusCd != 'PENDING' &&
      isPolicyStep
    ) {
      try {
        let body = await this.policyService.getPolicyByQuotationRefNum(quotationRefNum);
        this.policyService.responseIO = JSON.parse(JSON.stringify(body));
        this.policyService.id = this.policyService.responseIO.data.Entity.id;
        if (this.policyService.responseIO.data.Entity.step != 0)
          this.service.responseIO.data.Entity.step = this.policyService.responseIO.data.Entity.step;
        this.setAltService(this.policyService);
        this.setHeader();
      } catch (e) {
        //console.log('catch block getPolicyByQuotationRefNum');
      }
    }
    if (!isPolicyStep) this.setAltService(undefined);
  }

  protected getStepList(): StepItem[] {
    return this.getCustomStepList();
  }
  protected getCustomStepList(): StepItem[] {
    let customStepList: StepItem[] = this.getInitialStepList();
    let stepIndex = customStepList.length - 1;
    if (
      this.service.productFacets &&
      this.service.productFacets.data &&
      this.service.productFacets.data['PRODUCTQUESTIONSETGROUP'] != undefined
    ) {
      let step = new StepItem(
        ++stepIndex,
        'step_Questionnaire',
        [
          {
            id: 'tab_questionnaire',
            modelList: ['Proposer', 'PartyQuestionnaireResponseList', 'BasePlan'],
          },
        ],
        ['but_Back', 'but_PolicyContinue']
      );
      customStepList.push(step);
    }

    if (
      this.service.productFacets &&
      this.service.productFacets.data &&
      this.service.productFacets.data['NBREQUIRMENTS'] != undefined
    ) {
      let step = new StepItem(
        ++stepIndex,
        'step_requirement',
        [
          {
            id: 'tab_requirement',
            modelList: ['Proposer', 'PartyDocumentList', 'BasePlan'],
          },
        ],
        ['but_Back', 'but_PolicyContinue']
      );
      customStepList.push(step);
    }
    let step = new StepItem(
      ++stepIndex,
      'step_payment',
      [
        {
          id: 'tab_paymentsummary',
          modelList: ['Proposer', 'InitialOtherPayerParty', 'InitialPayment', 'BasePlan'],
        },
      ],
      ['but_Back', 'but_Pay']
    );
    customStepList.push(step);
    return customStepList;
  }
  protected getInitialStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_yourDetails',
        [{ id: 'tab_basic', modelList: ['Entity', 'Proposer', 'PrimaryInsured', 'BasePlan'] }],
        ['but_Proceed']
      ),
      new StepItem(
        1,
        'step_Coverage',
        [
          {
            id: 'tab_plan',
            modelList: [
              'Proposer',
              'PrimaryInsured',
              'BasePlan',
              'InitialInvestment',
              'RegularTopup',
              'AdHocTopupList',
              'TransferTopupList',
              'WithdrawalList',
              'RiderList',
            ],
          },
          {
            id: 'tab_rider',
            modelList: ['RiderList'],
            visible: false,
          },
        ],
        ['but_Back', 'but_Continue']
      ),
      new StepItem(
        2,
        'step_quoteSummary',
        [
          {
            id: 'tab_premiumSummary',
            modelList: [
              'Entity',
              'Proposer',
              'BasePlan',
              'RiderList',
              'PrimaryInsured',
              'OutputPreferences',
              'ServiceSignatureList',
            ],
          },
        ],
        ['but_Back', 'but_confirm']
      ),
      new StepItem(
        3,
        'step_PersonalInfo',
        [
          {
            id: 'tab_owner',
            modelList: [
              'Proposer',
              'BasePlan',
              'RiderList',
              'NomineeList',
              'InitialOtherPayerParty',
              'InitialPayment',
            ],
          },
          {
            id: 'tab_nominee',
            modelList: ['NomineeList'],
            visible: false,
          },
        ],
        ['but_Back', 'but_PolicyContinue']
      ),
    ];
    return stepList;
  }

  protected postProcess() {
    super.postProcess();
    setTimeout(() => {
      this.mergeStepList();
    }, 800);
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    if (this.service.responseIO != undefined) {
      if (this.service.responseIO.data.Proposer != undefined)
        this.fullNameText = this.getStringValue(this.service.responseIO.data.Proposer.fullName);
      if (
        this.service.responseIO.data.BasePlan != undefined &&
        this.service.responseIO.data.BasePlan.productLongName != undefined &&
        this.service.responseIO.data.BasePlan.productFamilyCd != undefined
      )
        this.productNameText =
          this.service.getFieldLookupDesc(this.service.responseIO.data.BasePlan, 'productFamilyCd') +
          ' ' +
          this.service.responseIO.data.BasePlan.productLongName;
      // header.title =
      //   this.settingService.getLabelValue('Welcome') +
      //   ' ' +
      //   this.getStringValue(this.service.responseIO.data.Proposer.fullName) +
      //   ' ! ';
      // if (
      //   this.service.responseIO.data.BasePlan != undefined &&
      //   this.service.responseIO.data.BasePlan.productId != undefined
      // ) {
      //   header.additionalInfo =
      //     ' to ' + this.getStringValue(this.service.responseIO.data.BasePlan.productLongName);
      // }
    }
    header.additionalButtonList = this.getAdditionalButtonList();
    return header;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return undefined;
  }

  protected getAdditionalButtonList(): any[] {
    let additionalButtonList = [];

    if (this.isProductSelected) {
      additionalButtonList.push({
        id: 'home',
        iconClass: 'fa fa-home',
        // text: 'home',
        link: '/customer-home',
      });
    }
    additionalButtonList.push({
      id: 'signOut',
      iconClass: 'fa fa-sign-out',
    });
    return additionalButtonList;
  }
  protected postInit() {
    super.postInit();
  }

  public onStepChanged(nextStepObj: StepItem) {
    if (
      nextStepObj.id == 'step_yourDetails' ||
      nextStepObj.id == 'step_Coverage' ||
      nextStepObj.id == 'step_quoteSummary'
    )
      this.setAltService(undefined);
    super.onStepChanged(nextStepObj);
  }
  protected step_Coverage_load(stepObj: StepItem) {
    // alert(stepObj.id);
    // console.log(this.service.responseIO);

    setTimeout(() => {
      // console.log(this.selectedStep);
      if (
        (this.service.responseIO.data.BasePlan.productPlanOptionCd == undefined ||
          this.service.responseIO.data.BasePlan.productPlanOptionCd == null) &&
        this.service.responseIO.lookups['PLANOPTION'] != undefined &&
        this.service.responseIO.lookups['PLANOPTION'].length > 0 &&
        this.selectedStep != undefined
      ) {
        this.selectedStep.hideFowardButtons();
      }
    }, 200);
  }

  protected step_yourDetails_load(stepObj: StepItem) {
    if (this.service.responseIO.data.Entity.proposerLASame == undefined)
      this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'proposerLASame', 'YES');
    this.previousEmailId =
      this.service != undefined &&
      this.service.responseIO != undefined &&
      this.service.responseIO.data != undefined &&
      this.service.responseIO.data.Proposer != undefined
        ? this.service.responseIO.data.Proposer.emailAddress
        : undefined;
  }

  protected step_PersonalInfo_load(stepObj: StepItem) {
    // alert(stepObj.id);
    if (
      this.policyService.responseIO &&
      (this.policyService.responseIO.data.NomineeList == null ||
        this.policyService.responseIO.data.NomineeList.length == 0)
    ) {
      this.addNominee();
    }
  }

  protected step_payment_load(stepObj: StepItem) {
    setTimeout(() => {
      // console.log(this.selectedStep);
      if (
        (this.policyService.responseIO.data.Entity.statusCd == 'SUBMITTED' ||
          this.policyService.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS') &&
        this.selectedStep != undefined
      ) {
        this.selectedStep.hideFowardButtons();
      }
    }, 200);
  }
  public onPrdSelection() {
    //Clearing the Proposer, Insured since else gives mandatory errors.
    //First time when saving only with the product these objects are not required.
    this.service.responseIO.data.Proposer = undefined;
    this.service.responseIO.data.PrimaryInsured = undefined;
    //set selectedTab as undefined,it doesn't want to show basic tab error because visiting baisc tab first time
    let selectedTab = this.selectedStep.selectedTab;
    this.selectedStep.selectedTab = undefined;
    this.saveUpdatedModels(this.selectedStep);
    //set back that selected tab as screen load issue occur.
    this.selectedStep.selectedTab = selectedTab;
    this.isProductSelected = true;
  }

  protected but_confirm_click() {
    let respData: any;
    this.service.convertToEapp().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        this.policyService.id = respData.data.Entity.policySeq;
        this.setAltService(this.policyService);
        let nextStepObj = this.stepList[this.selectedStep.index + 1];
        let modelNameBodyList = this.getModelNameBodyList(nextStepObj.tabList[0].modelList);
        this.policyService.load(this.policyService.id, modelNameBodyList).subscribe((body) => {
          this.service.responseIO = new ResponseIO();
          this.service.responseIO = JSON.parse(JSON.stringify(body));
          this.policyService.responseIO = JSON.parse(JSON.stringify(body));
          this.setDefaultPolicyData();
          this.saveUpdatedModels(this.selectedStep, nextStepObj, undefined);
          this.service.responseIO.data.Entity.step = this.policyService.responseIO.data.Entity.step;
          this.setHeader();
        });
        console.log('ConvertToEapp  successful.');
      },
      (error) => {
        console.log('ConvertToEapp failed.');
        console.log('Error:', error);
      }
    );
  }

  onDownloadPDFClick(event) {
    if (this.isOutputPreferenceReq) {
      if (this.service.responseIO.data.OutputPreferences != undefined) {
        this.service.responseIO.data.OutputPreferences.field1 = 'CHARTILLUSTRATION';
        this.service.responseIO.data.OutputPreferences.field2 = 'POLICYYEAR';
        this.service.responseIO.data.OutputPreferences.field3 = 'YES';
        this.service.responseIO.data.OutputPreferences.field4 = 'YES';
        this.service.responseIO.data.OutputPreferences.field5 = 'YES';
        this.service.responseIO.data.OutputPreferences.languageCd = 'EN';
        this.service.setUpdated(this.service.responseIO.data.OutputPreferences);
      }
    }
    this.downloadPDF();
  }

  downloadPDF() {
    let respData: any;
    this.service.generateIllustrationPdf().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (this.settingService.isRhosimulator === true || this.settingService.getApplicationMode() === 'online') {
          this.downloadOrOpenContent(
            respData.data.pdfFileContents,
            'pdf',
            this.service.responseIO.data.Entity.quotationRefNum != undefined
              ? this.service.responseIO.data.Entity.quotationRefNum
              : 'download'
          );
        } else {
          //open pdf in offline
          //this.offlineService.openPdf(respData.data.pdfFileContents);
        }
      },
      (error) => {
        console.log('PDF Generate failed.');
        console.log('Error:', error);
      }
    );
  }

  protected but_PolicyContinue_click() {
    this.setAltService(this.policyService);
    let nextStepObj = this.stepList[this.selectedStep.index + 1];
    if (this.selectedStep.id == 'step_PersonalInfo') {
      this.setDefaultPolicyData();
      this.setPaymentInfo();
      //After setting the nominee data hardcode that the nominee tab is visited since
      //this tab is not actually present but we need to set it to see the validation errors.
      this.setVisitedTabs('tab_nominee');
    }
    this.saveUpdatedModels(this.selectedStep, nextStepObj);
    this.service.responseIO.data.Entity.step = this.policyService.responseIO.data.Entity.step;
    this.setHeader();
  }

  protected setPaymentInfo() {
    this.policyService.responseIO.data.InitialPayment.InitialPaymentDetailsList[0].paymentMethodCd = 'IPG';
    this.policyService.setUpdated(this.policyService.responseIO.data.InitialPayment);
    this.policyService.setUpdated(this.policyService.responseIO.data.InitialPayment.InitialPaymentDetailsList[0]);
    if (this.policyService.responseIO.data.RenewalPayment != undefined) {
      this.policyService.responseIO.data.RenewalPayment.paymentMethodCd = 'CHEQUE';
      this.policyService.responseIO.data.RefundPayment.paymentMethodCd = 'CHEQUE';
      this.policyService.setUpdated(this.policyService.responseIO.data.RenewalPayment);
      this.policyService.setUpdated(this.policyService.responseIO.data.RefundPayment);
    }
  }

  protected but_PolicySubmit_click() {
    this.setAltService(this.policyService);
    this.saveUpdatedModels(this.selectedStep, this.selectedStep, undefined, 'but_PolicySubmit');
    this.setHeader();
  }

  protected but_Pay_click() {
    document.forms['paymentGatewayForm'].submit();
  }

  public onAddNominee(event) {
    //alert("add supplementary");
    this.addNominee();
  }
  public onDeleteNominee(tabItem) {
    //alert("delete supplementary " +index );
    this.confirm(this.service.getMultilingualMessage('deleteConfirmation', [tabItem.text]), () => {
      tabItem.visible = false;
      if (tabItem.id == 'appointee') {
        this.service.setDeleted(this.service.responseIO.data.Appointee);
      } else {
        this.service.setDeleted(this.service.responseIO.data.NomineeList[tabItem.index]);
      }
    });
  }
  public addNominee() {
    this.policyService.addNominee().subscribe(
      (body) => {
        let response: any;
        response = JSON.parse(JSON.stringify(body));
        // response.data.Nominee['deleteCheck'] = true;
        let newNomineeList = [];
        Array.prototype.push.apply(newNomineeList, this.policyService.responseIO.data.NomineeList);
        //set nominee first record as set updated...because it delete after continue.
        if (
          this.policyService.responseIO.data.NomineeList == null ||
          this.policyService.responseIO.data.NomineeList.length == 0
        ) {
          this.policyService.setUpdated(response.data.Nominee);
          //TODO move setting default percentage logic to java side.
          response.data.Nominee.percentage = 100;
        }
        response.data.Nominee.partySameAsCd = 'OTHER';
        response.data.Nominee.nomineeTypeCd = 'PRIMARY';
        newNomineeList.push(response.data.Nominee);
        //need to change the entire array instance in order to reflect in the dom
        this.policyService.responseIO.data.NomineeList = [];
        this.policyService.responseIO.data.NomineeList = newNomineeList;
        this.policyService.refreshMetaData(response);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getRiderTotalPremium() {
    let totalRiderPremium: number;
    totalRiderPremium = 0;
    if (this.service.responseIO.data && this.service.responseIO.data['RiderList']) {
      this.service.responseIO.data['RiderList'].filter((rider) => {
        // console.log(rider);
        if (rider.selected == 'YES') {
          // console.log(rider.modalPremium);
          totalRiderPremium += rider.modalPremium;
        }
      });
    }
    return totalRiderPremium;
  }

  public signOut_click(buttonClicked: { id: string; link: string }) {
    this.settingService.logoutUser();
  }

  public home_click(buttonClicked: { id: string; link: string }) {
    this.service.responseIO = undefined;
    this.isProductSelected = false;
    this.previousEmailId = undefined;
    this.settingService.reloadCurrentRoute(buttonClicked.link);
  }

  protected but_Proceed_click() {
    this.saveUpdatedModels(this.selectedStep, undefined, undefined, 'but_Proceed');
  }

  protected onSaveUpdatedModels(
    body: any,
    currentStepObj: StepItem,
    nextStepObj?: StepItem,
    nextTabObj?: TabItem,
    buttonId?: string
  ) {
    super.onSaveUpdatedModels(body, currentStepObj, nextStepObj, nextTabObj, buttonId);
    if (
      buttonId == 'but_Proceed' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      if (this.previousEmailId != this.service.responseIO.data.Proposer.emailAddress) {
        this.isTriggerOtpBtn = true;
      } else {
        this.but_Continue_click();
      }
    } else if (
      buttonId == 'but_PolicySubmit' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      this.policyService.responseIO.data.Entity.stepActionTabs = undefined;
      //this.service.responseIO.data.Entity.versionID = this.policyService.responseIO.data.Entity.versionID;
      this.policyService.submitPolicy().subscribe(
        (successResponse) => {
          if (successResponse['success'] == true) {
            this.policyService.responseIO = new ResponseIO();
            this.policyService.responseIO = JSON.parse(JSON.stringify(successResponse));
            // this.openModal('submitPolicyModal');
            // console.log(this.selectedStep);
            this.selectedStep.buttonList = [];
            this.setSelectedStep(this.selectedStep);
            this.headerService.pageHeader = this.getPageHeader();
            // console.log('submit api response ' + successResponse);
            console.log('Policy submit successful.');
          } else {
            // alert(successResponse['message']);
          }
          console.log(successResponse['message']);
          this.openModal('submitPolicyModal');
        },
        (error) => {
          console.log('Policy submit failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  public onValidateOtp(isValidOtp: boolean) {
    if (isValidOtp) {
      this.isTriggerOtpBtn = false;
      this.but_Continue_click();
    }
  }

  closeSubmitPolicyModal() {
    this.closeModal('submitPolicyModal');
    this.home_click({
      id: 'home',
      link: '/customer-home',
    });
  }
  public onSuitabilityAnalysisClick(id) {
    this.isSuitabilityAnalysisDisplayed = !this.isSuitabilityAnalysisDisplayed;
    setTimeout(() => {
      this.openModal(id);
    }, 10);
  }

  closeSuitabilityAnalysis(text: string) {
    this.isSuitabilityAnalysisDisplayed = !this.isSuitabilityAnalysisDisplayed;
    this.analysisText = text;
  }

  setHeader() {
    this.headerService.pageHeader = this.getPageHeader();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.settingService.removeExternalStyle('customer_styles.css');
  }

  protected pinCode_change(item: FieldItem) {
    this.policyService.setModelFieldValue(item.model, 'stateCd', null);
  }
  protected countryCd_change(item: FieldItem) {
    this.policyService.setModelFieldValue(item.model, 'stateCd', null);
  }

  protected cityCd_focus(item: FieldItem) {
    this.policyService.getCityCd(item);
  }

  protected stateCd_focus(item: FieldItem) {
    this.policyService.getStateCd(item);
  }

  public onVerifyButtonClick() {
    this.isTriggerAadharOtpBtn = true;
  }

  public onValidateAadharOtp(isValidOtp: boolean) {
    this.isTriggerAadharOtpBtn = false;
  }

  protected setDefaultPolicyData() {
    //set aadhar indentity details for aadhar context
    if (
      this.policyService.responseIO.data.Proposer.IdentityList != undefined &&
      this.policyService.responseIO.data.Proposer.IdentityList[0].identityTypeCd == undefined
    ) {
      this.policyService.responseIO.data.Proposer.IdentityList[0].identityTypeCd = 'AADHAR';
      this.policyService.setUpdated(this.policyService.responseIO.data.Proposer.IdentityList[0]);
    }
  }
  public proposerLASame_change(item: FieldItem) {
    if (item.model[item.fieldCd] == 'NO') {
      //Clearing party details on the basis of facet.
      let partyModel = this.service.responseIO.data['PrimaryInsured'];
      if (
        this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_CUSTOMER'] &&
        this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_CUSTOMER'] == 'YES'
      )
        partyModel = this.service.responseIO.data['Proposer'];
      this.service.clearPartyDetails(partyModel);
    }
  }
}
