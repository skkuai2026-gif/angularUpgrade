import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { Location } from '@angular/common';
import { PolicyStepFormHandlerComponent } from './policy-step-form.handlers';
import { StepItem } from 'src/app/models/common/step-item';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PageHeader } from 'src/app/models/common/page-header';
import { TabItem } from 'src/app/models/common/tab-items';
import { ResponseIO } from 'src/app/models/responseIO';

@Component({
  selector: 'sym-policy-step-form',
  templateUrl: './policy-step-form.component.html',
  styleUrls: ['./policy-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyStepFormComponent extends PolicyStepFormHandlerComponent {
  public isCSAPreviewApplicable: boolean = false;
  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  protected getStepList(): StepItem[] {
    let stepList = [
      new StepItem(
        0,
        'step_completeDataEntry',
        [
          {
            id: 'tab_basic',
            isSelected: true,
            modelList: [
              'Entity',
              'BasePlan',
              'RiderList',
              'InitialInvestment',
              'RegularTopup',
              'AdHocTopupList',
              'TransferTopupList',
              'WithdrawalList',
              'AdditionalFieldsList',
            ],
          },
          {
            id: 'tab_owner',
            isSelected: false,
            modelList: ['Proposer', 'AdditionalFieldsList'],
          },
          {
            id: 'tab_primary',
            isSelected: false,
            modelList: ['PrimaryInsured'],
          },
          {
            id: 'tab_joint',
            isSelected: false,
            modelList: ['JointLife'],
          },
          {
            id: 'tab_supplementary',
            isSelected: false,
            modelList: ['SupplementaryList'],
          },
          {
            id: 'tab_nominee',
            isSelected: false,
            modelList: ['NomineeList', 'Appointee'],
          },
          {
            id: 'tab_payment',
            isSelected: false,
            modelList: [
              'InitialOtherPayerParty',
              'InitialPayment',
              'RenewalOtherPayerParty',
              'RenewalPayment',
              'RefundPayment',
            ],
          },
          {
            id: 'tab_questionnaire',
            isSelected: false,
            modelList: ['PartyQuestionnaireResponseList'],
          },
        ],
        ['but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        1,
        'step_requirement',
        [
          {
            id: 'tab_requirement',
            modelList: ['PartyDocumentList'],
          },
        ],
        ['but_Back', 'but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        2,
        'step_previewEApp',
        [
          {
            id: 'tab_illustration',
            modelList: ['ServiceSignatureList'],
          },
        ],
        ['but_Back', 'but_DraftSave', 'but_Accept']
      ),
      new StepItem(
        3,
        'step_payment',
        [
          {
            id: 'tab_paymentsummary',
            modelList: ['InitialOtherPayerParty', 'InitialPayment'],
          },
        ],
        ['but_Back', 'but_PaymentDone']
      ),
    ];
    let tabList = [];
    let tab;

    tab = {
      id: 'tab_agentSharing',
      isSelected: false,
      modelList: ['AgentList'],
    };
    tabList.push(tab);
    // }
    tabList.push({
      id: 'tab_agentDeclaration',
      modelList: ['AgentQuestionnaireResponseList'],
    });
    let step = new StepItem(4, 'step_agentDeclaration', tabList, ['but_DraftSave', 'but_Submit']);
    stepList.push(step);

    let step5 = new StepItem(
      5,
      'step_submitStatus',
      [
        {
          id: 'tab_uwCustomerInput',
          modelList: [
            'Entity',
            'PartyDocumentList',
            'BasePlan',
            'RiderList',
            'ServiceSignatureList',
            'MultiLifeList',
          ],
        },
      ],
      ['but_Back', 'but_DraftSave', 'but_submitStatus']
    );
    stepList.push(step5);

    return stepList;
  }

  protected but_DraftSave_click() {
    super.but_DraftSave_click();
  }
  protected but_Accept_click() {
    // this.copyQuotationandCSASignIntoPolicySign();
    super.but_Accept_click();
  }
  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.additionalInfo = this.service.responseIO.data.Entity.productId;
    if (
      this.service.responseIO.data.Entity.policyNum != null &&
      this.service.responseIO.data.Entity.policyNum != ''
    ) {
      header.refNumber = this.service.responseIO.data.Entity.policyNum;
      header.title = 'Policy';
    } else if (
      this.service.responseIO.data.Entity.proposalNum != null &&
      this.service.responseIO.data.Entity.proposalNum != ''
    ) {
      header.refNumber = this.service.responseIO.data.Entity.proposalNum;
      header.title = 'ProposalHeader';
    }
    header.moreOptionList = this.getMoreOptionList();
    return header;
  }

  protected getMoreOptionList(): any[] {
    const userdata = this.service.getUserLoginData();
    let field13 = userdata?.['agentInfo'].field13;
    console.log('field13:', field13);
    let optionList: any[];
    optionList = [];
    optionList.push({
      id: 'viewQuotation',
    });
    if (
      this.service.companyFacets != undefined &&
      this.service.companyFacets.data != undefined &&
      this.service.companyFacets.data.NONFACETOFACE === 'YES' &&
      this.settingService.getSessionStorageValue('userType') === 'AGENT' &&
      this.service.responseIO != undefined &&
      this.service.responseIO.data.Entity.allocatedToRole !== undefined &&
      this.service.responseIO.data.Entity.allocatedToRole !== null &&
      this.service.responseIO.data.Entity.statusCd === 'COMPLETED'
    ) {
      // if (this.service.responseIO.data.Entity.allocatedToRole === 'AGENT') {
      //   optionList.push({
      //     id: 'transferToCustomer',
      //   });
      // } else if (this.service.responseIO.data.Entity.allocatedToRole !== 'AGENT') {
      //   optionList.push({
      //     id: 'revoke',
      //   });
      // }
      if (
        (this.service.responseIO.data.Entity.uwDecisionCd !== undefined &&
          this.service.responseIO.data.Entity.uwDecisionCd !== null &&
          this.service.responseIO.data.Entity.uwDecisionCd !== '' &&
          this.service.responseIO.data.Entity.uwDecisionCd === 'APPROVED') ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTSUCCESS'
      )
        optionList.push({
          id: 'transferToCustomerFlow',
        });
      if (
        (this.service.responseIO.data.Entity.uwDecisionCd !== undefined &&
          this.service.responseIO.data.Entity.uwDecisionCd !== null &&
          this.service.responseIO.data.Entity.uwDecisionCd !== '' &&
          this.service.responseIO.data.Entity.uwDecisionCd === 'APPROVED') ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTSUCCESS'
      )
        optionList.push({
          id: 'viewClientTransferStatusFlow',
        });
    }
    //If policy is LOCKED (isInvalid = true) , when policy is submitted(isCompleted= true), show edit quotation button
    let showEditQuotation: boolean =
      this.service.responseIO != undefined &&
      (!this.service.responseIO.data.Entity.isEditQuotation || this.service.responseIO.data.Entity.isInvalid)
        ? // (this.service.responseIO.data.Entity.allocatedToRole != 'AGENT')
          false
        : true;

    if (showEditQuotation && this.service.responseIO.data.Entity.allocatedToRole == 'AGENT') {
      optionList.push({
        id: 'editQuotation',
      });
    }

    if (
      this.service.responseIO.data.Entity.statusCd !== undefined &&
      this.service.responseIO.data.Entity.statusCd !== null &&
      this.service.responseIO.data.Entity.statusCd === 'ACCEPTED'
    )
      optionList.push({
        id: 'unlock',
      });
    let showCopyProposalData: boolean =
      (this.service.responseIO.data.Entity.statusCd !== undefined &&
        this.service.responseIO.data.Entity.statusCd !== null &&
        this.service.responseIO.data.Entity.statusCd === 'PENDING') ||
      (this.service.responseIO.data.Entity.statusCd === 'COMPLETED' &&
        this.service.responseIO.data.Entity.allocatedToRole == 'AGENT')
        ? true
        : false;

    if (showCopyProposalData) {
      optionList.push({
        id: 'copyProposalData',
      });
    }
    if (this.settingService.getApplicationMode() == 'offline' && field13 == 'YES') {
      optionList.push({
        id: 'sendReport',
      });
    }
    return optionList;
  }

  protected copyQuotationandCSASignIntoPolicySign() {
    // console.log(
    //   'before this.service.csaService.responseIO.data.ServiceSignatureList',
    //   this.service.csaService.responseIO.data.ServiceSignatureList
    // );
    // console.log('before policy service', this.service.responseIO.data);
    if (this.service.csaService != undefined) {
      if (this.service.csaService.responseIO != undefined) {
        const policySignList = this.service.responseIO.data.ServiceSignatureList;
        const csaSignList = this.service.csaService.responseIO.data.ServiceSignatureList;

        console.log('before policySignList', policySignList);
        console.log('before csaSignList', csaSignList);

        const newServiceSignMap = new Map<string, any>();

        // Add all items from the policy list into the map (by guid)
        policySignList.forEach((item) => {
          newServiceSignMap.set(item.guid, item);
        });

        // FIX: Merge CSA list with ID and status preservation
        csaSignList.forEach((csaSignature: any) => {
          if (newServiceSignMap.has(csaSignature.guid)) {
            const existing = newServiceSignMap.get(csaSignature.guid);
            // Preserve existing DB ID and status
            csaSignature.id = existing.id ?? csaSignature.id;
            csaSignature.status = existing.status ?? csaSignature.status;
          }
          newServiceSignMap.set(csaSignature.guid, csaSignature);
          console.log('newServiceMap::::310', newServiceSignMap);
        });

        // Replace the list
        this.service.responseIO.data.ServiceSignatureList = Array.from(newServiceSignMap.values());

        console.log('after CSA service', this.service.csaService.responseIO);
        console.log('after policy service', this.service.responseIO.data);
      }
    }

    if (this.service.quotationService != undefined) {
      if (this.service.quotationService.responseIO != undefined) {
        //Clone the current ServiceSignatureList
        const policySignList = this.service.responseIO.data.ServiceSignatureList;
        const quotationSignList = this.service.quotationService.responseIO.data.ServiceSignatureList;

        const newServiceSignMap = new Map<string, any>();
        //Add all items from the original list into the map (by guid)
        policySignList.forEach((item) => {
          newServiceSignMap.set(item.guid, item);
        });
        //Merge quotation list into the map
        quotationSignList.forEach((quotationSignature: any, i: number) => {
          if (newServiceSignMap.has(quotationSignature.guid)) {
            // If guid exists, update the quotation list with the newer value
            quotationSignList[i] = newServiceSignMap.get(quotationSignature.guid);
          } else {
            // If not, add this item to the new list
            newServiceSignMap.set(quotationSignature.guid, quotationSignature);
          }
        });
        // Replace the list
        this.service.responseIO.data.ServiceSignatureList = [];
        this.service.responseIO.data.ServiceSignatureList = Array.from(newServiceSignMap.values());
        // this.service.responseIO.data.ServiceSignatureList = newServiceSignList;
        console.log('after quotation service:::::::::::::::', this.service.quotationService.responseIO);
        console.log('after policy service', this.service.responseIO.data);
      }
    }
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      // {
      //   id: 'E-Application',
      //   link: '/policy-insurance-type',
      // },
      {
        id: 'search',
        link: '/policy-search',
      },
      {
        id: 'Policy',
      },
    ];
  }

  protected unlock_click(buttonClicked: { id: string; link: string }) {
    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'step', 0);
    this.confirm(
      this.service.getMultilingualLabel('unlockConfirmMsg'),
      () => {
        this.service.unlock().subscribe(
          (successResponse) => {
            this.service.reloadCurrentRoute();
            this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
            console.log('Unlock EAPP successful.');
            let prevStepObj = this.stepList[0];
            console.log('Unlock EAPP successful3333333.', prevStepObj);
            this.onStepChanged(prevStepObj);
          },
          (error) => {
            console.log('Unlock EAPP failed.');
            console.log('Error:', error);
          }
        );
      },
      () => {
        this.service.hideLoader(true);
      }
    );
  }

  protected viewQuotation_click(buttonClicked: { id: string; link: string }) {
    this.router.navigate(['quotation/' + this.service.responseIO.data.Entity.quotationSeq]);
    // let url = 'quotation/' + this.service.responseIO.data.Entity.quotationSeq + '?view=popup';
    // super.showWindow(url, 100, 300);
  }
  protected postProcess(): void {
    super.postProcess();
    if (
      !this.isInvalidMessage &&
      this.service.responseIO.data.Entity.isInvalid &&
      this.service.responseIO.data.Entity.invalidReason != null
    ) {
      // console.log('policystepform 430')
      this.error(this.service.responseIO.data.Entity.invalidReason);
      this.isInvalidMessage = true;
    }
    const visitedTabs = this.service.responseIO.data.Entity.visitedTabs || '';
    const currentActiveTab = this.service.currentActiveTab || '';
    const requiredTabs = ['tab_underWriting', 'tab_csaIllustration', 'tab_illustration', 'tab_siIllustration'];
    if (this.service?.responseIO?.data?.Proposer?.partyTypeCd === 'ORGANIZATION') {
      requiredTabs.splice(requiredTabs.indexOf('tab_csaIllustration'), 1);
    }
    const allTabsVisited =
      requiredTabs.every((tab) => visitedTabs.includes(tab) || currentActiveTab === tab) &&
      this.service?.responseIO?.data?.Entity?.uwDecisionCd !== 'DECLINED';
    const signatureTabVisited =
      visitedTabs.includes('tab_f2fSignature') || currentActiveTab === 'tab_f2fSignature';
    if (this.selectedStep?.tabList) {
      for (var i = 0; i < this.selectedStep.tabList.length; i++) {
        var tabItem = this.selectedStep.tabList[i];

        if (tabItem.id == 'tab_f2fSignature') {
          tabItem.visible = allTabsVisited;
        }
      }
    }
    setTimeout(() => {
      this.showHideAcceptBtn(allTabsVisited && signatureTabVisited);
    }, 0);
  }

  protected preProcess(): boolean {
    let shouldSave: boolean = true;
    //As summary tab is readonly there is no need to save but just load the next tab while moving
    //out of this tab

    if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid) {
      //submitted cases should not be edited and saved just viewed hence return false
      shouldSave = false;
    } else if (
      (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTFAILED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS' ||
        this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT') &&
      (this.selectedStep.id == 'step_completeDataEntry' || this.selectedStep.id == 'step_previewEApp')
    ) {
      shouldSave = false;
    } else if (
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT' &&
      (this.selectedStep.id == 'step_payment' || this.selectedStep.id == 'step_agentDeclaration')
    ) {
      shouldSave = false;
    } else if (
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' &&
      this.selectedStep.id == 'step_payment'
    ) {
      // shouldSave = false;
    }
    // if (this.selectedStep.id == 'step_previewEApp') {
    //   this.copyQuotationandCSASignIntoPolicySign();
    // }
    return shouldSave;
  }

  protected postLoad() {
    super.postLoad();

    if (this.selectedStep != undefined && this.selectedStep.id == 'step_previewEApp') {
      this.checkForCSAPreviewApplicable(this.selectedStep);
    }

    const visitedTabs = this.service.responseIO.data.Entity.visitedTabs || '';
    const currentActiveTab = this.service.currentActiveTab || '';
    const requiredTabs = ['tab_underWriting', 'tab_csaIllustration', 'tab_illustration', 'tab_siIllustration'];
    if (this.service?.responseIO?.data?.Proposer?.partyTypeCd === 'ORGANIZATION') {
      requiredTabs.splice(requiredTabs.indexOf('tab_csaIllustration'), 1);
    }
    const allTabsVisited =
      requiredTabs.every((tab) => visitedTabs.includes(tab) || currentActiveTab === tab) &&
      this.service?.responseIO?.data?.Entity?.uwDecisionCd !== 'DECLINED';
    const signatureTabVisited =
      visitedTabs.includes('tab_f2fSignature') || currentActiveTab === 'tab_f2fSignature';

    if (this.selectedStep?.tabList) {
      for (var i = 0; i < this.selectedStep.tabList.length; i++) {
        var tabItem = this.selectedStep.tabList[i];

        if (tabItem.id == 'tab_f2fSignature') {
          tabItem.visible = allTabsVisited;
        }
      }
    }

    setTimeout(() => {
      this.showHideAcceptBtn(allTabsVisited && signatureTabVisited);
    }, 0);
  }

  public showHideAcceptBtn(show: boolean): void {
    const button = document.getElementById('but_Accept') as HTMLButtonElement | null;

    if (!button) {
      console.warn('Accept button not found');
      return;
    }
    button.disabled = !show;
  }
  protected checkForCSAPreviewApplicable(nextStepObj: StepItem): void {
    console.log('calling checkforcsapreview');
    for (var i = 0; i < nextStepObj.tabList.length; i++) {
      var tabItem = nextStepObj.tabList[i];
      console.log('checkForCSAPreviewApplicable', nextStepObj);
      if (tabItem.id == 'tab_csaIllustration') {
        if (
          this.service &&
          this.service.responseIO &&
          this.service.responseIO.data &&
          this.service.responseIO.data.Proposer !== undefined &&
          this.service.responseIO.data.Proposer.partyTypeCd !== 'ORGANIZATION'
        ) {
          console.log('partyTypeCd', this.service.responseIO.data.Proposer.partyTypeCd);
          this.isCSAPreviewApplicable = true;
          tabItem.visible = true;
          break;
        } else {
          this.isCSAPreviewApplicable = false;
          tabItem.visible = false;
          break;
        }
      }
    }
  }
  protected setSelectedActiveTab(nextTabObj: TabItem): void {
    console.log('setSelectedActiveTab', this.isCSAPreviewApplicable);
    if (!this.isCSAPreviewApplicable && nextTabObj.id == 'tab_csaIllustration') {
      this.selectedStep.tabList.filter((tab) => {
        if (tab.id === 'tab_siIllustration') {
          tab.isSelected = true;
          nextTabObj = tab;
          this.selectedStep.selectedTab = nextTabObj;
        }
      });
    }
    super.setSelectedActiveTab(nextTabObj);
  }
  protected preStepSelection(nextStepObj: StepItem): void {
    // super.preStepSelection(nextStepObj);
    var paymentCallBack = window.localStorage.getItem('PAYMENTCALLBACK');
    if (paymentCallBack !== undefined && paymentCallBack !== null && paymentCallBack == 'BASIC') {
      window.localStorage.setItem('PAYMENTCALLBACK', undefined);
      this.service.displayLoader(true);
      this.setSelectedStep(nextStepObj);
      let prevStepObj = this.stepList[0];
      console.log('payment to 1st step succcessfull---', prevStepObj);
      this.onStepChanged(prevStepObj);
    }
    if (nextStepObj.id == 'step_previewEApp') {
      this.checkForCSAPreviewApplicable(nextStepObj);
    }
    //for all steps if status is Accepted then remove the buttons
    if (this.service.responseIO.data.Entity.statusCd == 'SUBMITTED' && nextStepObj.id != 'step_submitStatus') {
      if (nextStepObj.id == 'step_agentDeclaration') nextStepObj.buttonList = ['but_Continue'];
      else nextStepObj.buttonList = [];
    } else if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid)
      nextStepObj.buttonList = [];
    else if (
      (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS') &&
      nextStepObj.id == 'step_completeDataEntry'
    )
      nextStepObj.buttonList = [];
    else if (
      (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS') &&
      nextStepObj.id == 'step_previewEApp'
    )
      nextStepObj.buttonList = ['but_Continue'];
    else if (
      (this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTFAILED') &&
      nextStepObj.id == 'step_payment'
    )
      nextStepObj.buttonList = ['but_Back'];
    else if (
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT' &&
      nextStepObj.id != 'step_submitStatus'
    ) {
      if (nextStepObj.id == 'step_agentDeclaration') nextStepObj.buttonList = ['but_Continue'];
      else nextStepObj.buttonList = [];
    }

    //for step coverage details only if supplementary is selected on the Entity then have that tab
    if (nextStepObj.id == 'step_completeDataEntry') {
      this.checkForJointLifeTab(nextStepObj);
      this.checkForSupplementaryTab(nextStepObj);
      this.checkForRiderTab(nextStepObj);
      this.checkForNomineeTab(nextStepObj);
      this.checkForInsuredTab(nextStepObj);
    }
  }

  public onStepChanged(nextStepObj: StepItem) {
    if (
      this.service &&
      this.service.responseIO &&
      this.service.responseIO.data &&
      this.service.responseIO.data.Entity &&
      this.service.responseIO.data.Entity.statusCd &&
      (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTFAILED') &&
      nextStepObj.id == 'step_requirement'
    )
      nextStepObj.buttonList = ['but_Back', 'but_DraftSave', 'but_Continue'];
    super.onStepChanged(nextStepObj);
  }

  protected but_Complete_click() {
    this.service.changeAllocation().subscribe(
      (responseIO) => {
        // alert( responseIO[ 'message' ] );
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
        //this.service.reloadCurrentRoute();
        this.selectedStep.buttonList = [];
        this.headerService.pageHeader = this.getPageHeader();
        this.router.navigate(['policy-customer-complete']);
      },
      (error) => {
        console.log('Transfer to customer failed.');
        console.log('Error:', error);
      }
    );
  }
  setCustomStepStatus(stepItem: StepItem): void {
    if (
      this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTFAILED' ||
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS'
    ) {
      let stepItemIndexArr = [0, 1, 2];
      if (stepItemIndexArr.includes(stepItem.index)) stepItem.status = 'completed';
      else if (stepItem.index > this.selectedStep.index) stepItem.status = 'pending';
    } else if (this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE') {
      let stepItemIndexArr = [0, 1, 2, 3];
      if (stepItemIndexArr.includes(stepItem.index)) stepItem.status = 'completed';
      else if (stepItem.index > this.selectedStep.index) stepItem.status = 'pending';
    } else if (
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT' ||
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED'
    ) {
      let stepItemIndexArr = [0, 1, 2, 3, 4, 5];
      if (stepItemIndexArr.includes(stepItem.index)) stepItem.status = 'completed';
      else if (stepItem.index > this.selectedStep.index) stepItem.status = 'pending';
    } else {
      super.setCustomStepStatus(stepItem);
    }
  }

  protected continueWithWarning(): boolean {
    let isContinueWithWarning = false;
    if (this.service.companyFacets != undefined && this.service.companyFacets.data.NONFACETOFACE === 'YES') {
      //Agent should not be able to Accept without clearing all warnings of step 0,1,2.
      //for that check in validation error having error or not
      if (this.selectedStep.id == 'step_previewEApp' || this.selectedStep.id == 'step_eSignature') {
        let validationerrors = this.service.responseIO.validationerrors;
        let isErrorExists = false;
        let stepItemIndexArr = [0, 1];
        for (var e = 0; e < stepItemIndexArr.length; e++) {
          let stepItem: StepItem = this.getStepList()[e];
          for (let tabItem of stepItem.tabList) {
            if (validationerrors != undefined && validationerrors[tabItem.id] != undefined) {
              isErrorExists = true;
              break;
            }
          }
          if (isErrorExists) break;
        }
        if (!isErrorExists) isContinueWithWarning = true;
      } else {
        //in case of non face to face,agent and customer both can be continue with warning only ////step 0 and 1.
        let stepItemIndexArr = [0, 1];
        if (
          stepItemIndexArr.includes(this.selectedStep.index) &&
          this.service.responseIO.data.Entity.allocatedToPartyGuid != undefined &&
          this.service.responseIO.data.Entity.allocatedToPartyGuid != ''
        )
          isContinueWithWarning = true;
      }
    }
    return isContinueWithWarning;
  }

  protected but_Continue_click() {
    this.service.hideLoader(false, 'but_Continue');
    super.but_Continue_click();
  }
  public sendReport_click() {
    this.sendReportPolicyData();
  }

  protected sendReportPolicyData() {
    let respData: any;
    let policyRef: 'policyRef';
    if (this.service.responseIO.data.Entity.proposalNum) {
      this.service.getSendReport(policyRef, this.service.responseIO.data.Entity.proposalNum).subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          // if (respData !== undefined && respData.Entity.policyNum !== undefined && respData.Entity.policyNum !== null) {
          //   console.log('success response ');
          // }
          console.log('send Report policy data successful.');
        },
        (error) => {
          console.log('Send Report policy data failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  protected but_Submit_click() {
    let policyAdditionalFields = this.service.responseIO.data.PolicyAdditionalFields;
    if (policyAdditionalFields) {
      let rating = policyAdditionalFields.field22;
      let comment = policyAdditionalFields.field19;
      if (
        rating !== null &&
        rating !== undefined &&
        rating !== '' &&
        Number(rating) <= 3 &&
        (!comment || comment.trim() === '')
      ) {
        this.error(this.settingService.getLabelValue('Advisory_Feedback_Popup'));
        this.service.hideLoader(true);
        return;
      }
    }
    super.but_Submit_click();
  }
  postSubmitPolicyError(error: any) {
    this.service.isPolicySubmitSuccess = false;
    console.log('702 policyerror  ' + this.service.isPolicySubmitSuccess);
    this.service.hideLoader(true, 'but_Submit');
    this.service.reloadCurrentRoute();
  }

  protected viewClientTransferStatusFlow_click(buttonClicked: { id: string; link: string }) {
    if (this.service.getFieldLookupSize(this.service.responseIO.data.Entity, 'allocationPartyGuidList') > 0) {
      setTimeout(() => {
        PolicyStepFormHandlerComponent.transferToCustomerPopup = true;
        this.openModal('policytransferToCustomerView');
      }, 100);
    } else {
      this.error('No clients are available for transfer', undefined, true);
    }
  }
}
