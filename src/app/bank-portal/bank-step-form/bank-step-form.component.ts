import { TabItem } from './../../models/common/tab-items';
import { FieldItem } from './../../models/common/field-item';
import { PolicyService } from './../../policy/services/policy.service';
import { CreatePolicyStepFormComponent } from './../../customer-portal/create-policy-step-form/create-policy-step-form.component';
import { StepItem } from 'src/app/models/common/step-item';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from './../../quotation/services/quotation.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { ResponseIO } from 'src/app/models/responseIO';

@Component({
  selector: 'sym-bank-step-form',
  templateUrl: './bank-step-form.component.html',
  styleUrls: ['./bank-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BankStepFormComponent extends CreatePolicyStepFormComponent {
  isProductFamilySelected: boolean;
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
    super(service, route, router, location, settingService, headerService, policyService);
    this.policyService = policyService;
    this.isProductFamilySelected = false;
  }

  ngOnInit() {
    if (this.settingService.urlList != undefined && this.settingService.isLabelLoaded) {
      super.ngOnInit();
      if (this.service.id != 0) {
        this.isProductFamilySelected = true;
      } else {
        this.isProductFamilySelected = false;
      }

      setTimeout(() => {
        // console.log(this.selectedStep);
        this.settingService.loadExternalStyle('bank_styles.css');
      }, 50);
    }
  }

  protected getStepList(): StepItem[] {
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
        ['but_Back', 'but_CoverageContinue']
      ),
      new StepItem(
        2,
        'step_quoteComparison',
        [
          {
            id: 'tab_quoteComparison',
            modelList: ['Entity', 'Proposer', 'BasePlan', 'RiderList', 'PrimaryInsured'],
          },
        ],
        ['but_Back', 'but_Continue']
      ),
      // new StepItem(
      //   2,
      //   'step_quoteSummary',
      //   [
      //     {
      //       id: 'tab_premiumSummary',
      //       modelList: [
      //         'Entity',
      //         'Proposer',
      //         'BasePlan',
      //         'RiderList',
      //         'PrimaryInsured',
      //         'OutputPreferences',
      //         'ServiceSignatureList',
      //       ],
      //     },
      //   ],
      //   ['but_Back', 'but_Continue']
      // ),
      new StepItem(
        3,
        'step_PersonalInfo',
        [
          {
            id: 'tab_owner',
            modelList: [
              'PrimaryInsured',
              'Proposer',
              'BasePlan',
              'RiderList',
              'NomineeList',
              'InitialOtherPayerParty',
              'InitialPayment',
              'RenewalPayment',
              'RefundPayment',
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
      new StepItem(
        4,
        'step_Questionnaire',
        [
          {
            id: 'tab_questionnaire',
            modelList: ['Proposer', 'PartyQuestionnaireResponseList', 'BasePlan'],
          },
        ],
        ['but_Back', 'but_PolicyContinue']
      ),
      new StepItem(
        5,
        'step_requirement',
        [
          {
            id: 'tab_requirement',
            modelList: ['Proposer', 'PartyDocumentList', 'BasePlan'],
          },
        ],
        ['but_Back', 'but_PolicyContinue']
      ),
      new StepItem(
        6,
        'step_payment',
        [
          {
            id: 'tab_paymentsummary',
            modelList: ['Proposer', 'InitialOtherPayerParty', 'InitialPayment', 'BasePlan'],
          },
        ],
        ['but_Back', 'but_Pay']
      ),
    ];
    return stepList;
  }

  protected getAdditionalButtonList(): any[] {
    let additionalButtonList = [];

    if (this.isProductFamilySelected) {
      additionalButtonList.push({
        id: 'home',
        iconClass: 'fa fa-home',
        // text: 'home',
        link: '/bank-home',
      });
    }
    additionalButtonList.push({
      id: 'signOut',
      iconClass: 'fa fa-sign-out',
    });
    return additionalButtonList;
  }

  public onProductFamilySelection() {
    //Clearing the Proposer, Insured since else gives mandatory errors.
    //First time when saving only with the product these objects are not required.
    this.service.responseIO.data.Proposer = undefined;
    this.service.responseIO.data.PrimaryInsured = undefined;
    this.service.responseIO.data.Entity.productFamilyCd = this.service.responseIO.data.BasePlan.productFamilyCd;

    //remove error of first step ie. your details after family selection
    let tab = this.selectedStep.selectedTab;
    this.selectedStep.selectedTab = undefined;
    this.saveUpdatedModels(this.selectedStep);
    this.selectedStep.selectedTab = tab;
    this.isProductFamilySelected = true;
  }

  protected but_Proceed_click() {
    if (this.service.responseIO && this.service.responseIO.data) {
      this.service.responseIO.data.Entity.proposerLASame == 'YES';
      if (this.service.responseIO.data.PrimaryInsured != undefined) {
        this.service.responseIO.data.PrimaryInsured.firstname = 'bankuser';
        this.service.responseIO.data.PrimaryInsured.lastname = 'bankuser';
      }
      if (this.service.responseIO.data.Proposer != undefined) {
        this.service.responseIO.data.Proposer.genderCd = this.service.responseIO.data.PrimaryInsured.genderCd;
        this.service.responseIO.data.Proposer.dob = this.service.responseIO.data.PrimaryInsured.dob;
        this.service.responseIO.data.Proposer.firstname = 'bankuser';
        this.service.responseIO.data.Proposer.lastname = 'bankuser';
      }
    }

    super.but_Continue_click();
  }

  protected but_CoverageContinue_click() {
    if (this.service.compareQuotaionResponseIOMap.size == 0) {
      this.error('Please select at least one quotation for comparison.', undefined, true);
    } else {
      let selectedPlanResponseIO = this.service.compareQuotaionResponseIOMap.entries().next().value[1];
      if (selectedPlanResponseIO != undefined) {
        this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'unselectedRiders', null);
        if (
          this.service.responseIO.data.BasePlan.productSeq != undefined &&
          this.service.responseIO.data.BasePlan.productSeq != selectedPlanResponseIO.data.BasePlan.productSeq
        ) {
          let existingRiderList = this.service.responseIO.data.RiderList;
          this.service.responseIO.data.RiderList = [];
          if (existingRiderList != undefined && existingRiderList.length > 0) {
            existingRiderList.filter((rider) => {
              rider.selected = 'NO';
              selectedPlanResponseIO.data.RiderList.push(rider);
            });
          }
          this.service.responseIO.data.RiderList = selectedPlanResponseIO.data.RiderList;
        } else {
          this.service.responseIO.data.RiderList = [];
          this.service.responseIO.data.RiderList = selectedPlanResponseIO.data.RiderList;
        }
        this.service.responseIO.data.BasePlan = selectedPlanResponseIO.data.BasePlan;
        this.service.refreshMetaData(selectedPlanResponseIO);
      }
      super.but_Continue_click();
    }
  }

  protected step_PersonalInfo_load(stepObj: StepItem) {
    super.step_PersonalInfo_load(this.selectedStep);
    setTimeout(() => {
      // console.log(this.selectedStep);
      if (this.selectedStep != undefined) {
        if (this.policyService.responseIO && this.policyService.responseIO.data)
          this.selectedStep.resetForwardButtons();
        else {
          //clearing the names back for user to enter
          this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured, 'firstname', undefined);
          this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured, 'lastname', undefined);
          this.service.setModelFieldValue(this.service.responseIO.data.Proposer, 'firstname', undefined);
          this.service.setModelFieldValue(this.service.responseIO.data.Proposer, 'lastname', undefined);

          this.selectedStep.hideFowardButtons(['but_PolicyContinue']);
        }
      }
    }, 200);
  }

  protected step_quoteComparison_load(stepObj: StepItem) {
    if (this.service.compareQuotaionResponseIOMap.size == 0) {
      this.error('Please select quotation(s) for comparison.', undefined, false);
      if (this.selectedStep == undefined) this.selectedStep = stepObj;
      this.but_Back_click();
    }
  }

  public but_confirm_click() {
    this.saveUpdatedModels(this.selectedStep, undefined, undefined, 'but_confirm');
  }

  protected step_Coverage_load(stepObj: StepItem) {
    this.service.compareQuotaionResponseIOMap = new Map<number, ResponseIO>();
    setTimeout(() => {
      if (this.service.compareQuotaionResponseIOMap.size == 0)
        this.selectedStep.hideFowardButtons(['but_CoverageContinue']);
    }, 20);
  }

  protected dob_change(item: FieldItem) {
    item.model.age = undefined;
    this.service.computeAge(item.model);
  }

  protected baseSumAssured_change(item: FieldItem) {
    this.responseUpdated = true;
  }

  protected productTerm_change(item: FieldItem) {
    this.responseUpdated = true;
  }

  protected premiumPayingTerm_change(item: FieldItem) {
    this.responseUpdated = true;
  }

  protected paymentFrequencyCd_change(item: FieldItem) {
    this.responseUpdated = true;
  }

  public onSetApplicableProducts(isSetApplicableProducts: boolean) {
    this.responseUpdated = isSetApplicableProducts;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.policyService != undefined) this.policyService.responseIO = undefined;
    if (this.altService != undefined) this.altService.responseIO = undefined;
    this.settingService.removeExternalStyle('bank_styles.css');
    this.service.removeAdditionalData('ISQUOTESELECTED');
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
      buttonId == 'but_confirm' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      let respData: any;
      this.service.convertToEapp().subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          this.policyService.id = respData.data.Entity.policySeq;
          this.setAltService(this.policyService);
          let nextStepObj = this.stepList[this.selectedStep.index];
          let modelNameBodyList = this.getModelNameBodyList(nextStepObj.tabList[0].modelList);
          this.policyService.load(this.policyService.id, modelNameBodyList).subscribe((body) => {
            this.service.responseIO = new ResponseIO();
            this.service.responseIO = JSON.parse(JSON.stringify(body));
            this.policyService.responseIO = JSON.parse(JSON.stringify(body));
            this.setDefaultPolicyData();
            //this.saveUpdatedModels(this.selectedStep);
            //this.service.responseIO.data.Entity.step = this.policyService.responseIO.data.Entity.step;
            this.setHeader();
            this.step_PersonalInfo_load(this.selectedStep);
          });
          console.log('ConvertToEapp  successful.');
        },
        (error) => {
          console.log('ConvertToEapp failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  closeSubmitPolicyModal() {
    this.closeModal('submitPolicyModal');
    this.home_click({
      id: 'home',
      link: '/bank-home',
    });
  }
}
