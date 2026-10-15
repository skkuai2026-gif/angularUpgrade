import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LeadStepFormHandlerComponent } from '../lead-step-form/lead-step-form.handler';
import { ActivatedRoute, Router } from '@angular/router';
import { StepItem } from 'src/app/models/common/step-item';
import { Location } from '@angular/common';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { LeadService } from '../services/lead.service';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { TabItem } from 'src/app/models/common/tab-items';
@Component({
  selector: 'sym-lead-insurance-step-form',
  templateUrl: './lead-insurance-step-form.component.html',
  styleUrls: ['./lead-insurance-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadInsuranceStepFormComponent extends LeadStepFormHandlerComponent implements OnInit {
  protected leadOtpOption: boolean = false;
  protected otpErrorFailed: boolean = false;
  public otpExpiryTime: number;
  public successPopup: boolean;

  constructor(
    service: LeadService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[];
    if (this.service.companyFacets != undefined)
      stepList = this.service.getStepList(this.service.companyFacets.data['LEADUIFORMAT']);
    return stepList;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.leadOtpOption = false;
    this.service.isTriggerOtpBtn = false;
    this.otpErrorFailed = false;
    this.otpExpiryTime = undefined;
    this.service.viewProposalListLeadDisplayed = false;
    this.service.viewCSAListDisplayed = false;
    this.service.viewPolicyListDisplayed = false;
    this.successPopup = false;
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'search',
        link: '/lead-search',
      },
      {
        id: 'Create Client',
      },
    ];
  }
  protected createFNA() {
    let respData: any;
    this.service.createFNA().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        {
          if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
            this.router.navigate(['csa-slgfi/' + respData.data.Entity.fnaSeq]);
          } else {
            this.router.navigate(['csa/' + respData.data.Entity.fnaSeq]);
          }
        }

        console.log('createFNA  successful.');
      },
      (error) => {
        console.log('createFNA failed.');
        console.log('Error:', error);
      }
    );
  }

  protected getMoreOptionList(): any[] {
    const userdata = this.service.getUserLoginData();
    let field13 = userdata?.['agentInfo'].field13;
    console.log('field13:', field13);
    let optionList: any[];
    optionList = [];
    if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data.Entity != undefined &&
      this.service.responseIO.data.Entity.statusCd != undefined &&
      this.service.responseIO.data.Entity.statusCd != 'COMPLETED'
    ) {
      return optionList;
    }
    if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data.LeadParty != undefined &&
      this.service.responseIO.data.LeadParty.partyTypeCd === 'INDIVIDUAL'
    ) {
      optionList.push({
        id: 'createFNA',
      });
      optionList.push({
        id: 'viewCSAList',
      });
    } else {
      optionList.push({
        id: 'createQuotation',
      });
    }
    optionList.push({
      id: 'viewProposalListLead',
    });
    optionList.push({
      id: 'viewPolicyList',
    });
    optionList.push({
      id: 'close',
    });
    if (this.settingService.getApplicationMode() == 'offline' && field13 == 'YES') {
      optionList.push({
        id: 'sendReport',
      });
    }
    return optionList;
  }

  protected viewCSAList() {
    console.log('in view csa list');
    this.service.viewCSAListDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('viewCSAList');
  }

  protected viewProposalListLead() {
    console.log('in view proposal list');
    this.service.viewProposalListLeadDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('viewProposalListLead');
  }

  protected viewPolicyList() {
    console.log('in view policy list');
    this.service.viewPolicyListDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('viewPolicyList');
  }

  public viewCSAList_click(buttonClicked: { id: string; link: string }) {
    this.viewCSAList();
  }

  public viewProposalListLead_click(buttonClicked: { id: string; link: string }) {
    this.viewProposalListLead();
  }

  public viewPolicyList_click(buttonClicked: { id: string; link: string }) {
    this.viewPolicyList();
  }

  csaPopupClosed() {
    this.service.viewCSAListDisplayed = !this.service.viewCSAListDisplayed;
  }

  proposalPopupClosed() {
    this.service.viewProposalListLeadDisplayed = !this.service.viewProposalListLeadDisplayed;
  }

  policyPopupClosed() {
    this.service.viewPolicyListDisplayed = !this.service.viewPolicyListDisplayed;
  }

  protected postProcess(): void {
    super.postProcess();
    // if (
    //   this.service.responseIO.data &&
    //   this.service.responseIO.data.LeadParty &&
    //   this.service.responseIO.data.LeadParty.PhilippinesContact &&
    //   this.service.responseIO.data.LeadParty.PhilippinesContact.contactNum != null &&
    //   this.service.responseIO.data.LeadParty.PhilippinesContact.contactNum != '' &&
    //   this.service.responseIO.data.LeadParty.AdditionalFieldsList &&
    //   this.service.responseIO.data.LeadParty.AdditionalFieldsList.length > 0 &&
    //   this.service.responseIO.data.LeadParty.AdditionalFieldsList[0].field2 !== 'OTPVERIFIED' &&
    //   // this.service.responseIO.data.LeadParty.AdditionalFieldsList[0].field1 !== 'SKIPOTP' &&
    //   !this.stepErrorPresent([0])
    // ) {
    // this.leadOtpOption = true;
    // this.openModal('leadOtpOptionPopup');
    // this.createLeadAndNotify();
    // }
    setTimeout(() => {
      if (!this.stepErrorPresent([0])) this.successPopup = true;
      else this.successPopup = false;
    }, 2000);
    setTimeout(() => {
      this.successPopup = false;
    }, 6000);
  }

  protected stepErrorPresent(stepItemIndexArr: number[]): boolean {
    let validationerrors = this.service.responseIO.validationerrors;
    let isErrorExists = false;
    if (validationerrors !== undefined) {
      for (var e = 0; e < stepItemIndexArr.length; e++) {
        let stepItem: StepItem = this.getStepList()[e];
        for (let tabItem of stepItem.tabList) {
          if (validationerrors[tabItem.id] != undefined) {
            isErrorExists = true;
            break;
          }
        }
      }
    }
    return isErrorExists;
  }

  public otpOptionClick() {
    this.closeModal('leadOtpOptionPopup');
    if (
      this.service.responseIO.data &&
      this.service.responseIO.data.LeadParty &&
      this.service.responseIO.data.LeadParty.partyId != null &&
      this.service.responseIO.data.LeadParty.partyId != '' &&
      this.service.responseIO.data.LeadParty.PhilippinesContact &&
      this.service.responseIO.data.LeadParty.PhilippinesContact.contactNum != null &&
      this.service.responseIO.data.LeadParty.PhilippinesContact.contactNum != '' &&
      this.service.responseIO.data.LeadParty.AdditionalFieldsList &&
      this.service.responseIO.data.LeadParty.AdditionalFieldsList.length > 0
    ) {
      if (this.service.responseIO.data.LeadParty.AdditionalFieldsList[0].field1 === 'SENDOTP') {
        this.createLeadAndNotify();
      }
    }
  }
  public onOTPActionClick(actionValue: { action: string; otp: any }) {
    if (actionValue.action == 'resendOTP') {
      this.createLeadAndNotify();
    } else if (actionValue.action == 'validateOTP' && actionValue.otp != null) {
      this.valiadteOTP(actionValue.otp);
    }
  }

  public onValidateOtp(isValidOtp: boolean, message?: string) {
    if (!isValidOtp) {
      this.leadOtpOption = false;
      this.service.isTriggerOtpBtn = false;
      this.otpErrorFailed = false;
      if (message != undefined) this.error(message);
    } else this.closeModalSetup();
  }

  private closeModalSetup() {
    $('#otpPopup').hide();
  }

  public createLeadAndNotify() {
    this.service
      .createLeadAndNotify(
        this.service.responseIO.data.LeadParty.PhilippinesContact.contactNum,
        this.service.responseIO.data.LeadParty.partyId,
        this.service.responseIO.data.Entity.userId,
        this.service.responseIO.data.LeadParty.PersonalEmail.emailAddress
      )
      .subscribe(
        (data) => {
          var respData = JSON.parse(JSON.stringify(data));
          // if (respData.success) {
          //   this.service.isTriggerOtpBtn = true;
          //   this.otpExpiryTime =
          //     SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME') != undefined
          //       ? parseInt(SettingService.getApplicationPropertiesValue('OTP_EXPIRY_TIME'))
          //       : 300;
          // } else {
          //   var msg = 'OTP generation failed, Please try again';
          //   if (respData.message) msg = respData.message;
          //   this.onValidateOtp(false, msg);
          // }
        }
        // (error) => {
        //   this.onValidateOtp(false, 'OTP generation failed, Please try again');
        // }
      );
  }

  public valiadteOTP(otp: string) {
    this.service
      .validateGeneratedOTP(
        otp,
        this.service.responseIO.data.LeadParty.partyId,
        this.service.responseIO.data.Entity.userId
      )
      .subscribe(
        (data) => {
          var respData = JSON.parse(JSON.stringify(data));
          if (respData.success) {
            if (
              this.service.responseIO.data &&
              this.service.responseIO.data.LeadParty &&
              this.service.responseIO.data.LeadParty.AdditionalFieldsList &&
              this.service.responseIO.data.LeadParty.AdditionalFieldsList.length > 0
            ) {
              this.service.responseIO.data.LeadParty.AdditionalFieldsList[0].field2 = 'OTPVERIFIED';
              this.but_DraftSave_click();
              this.onValidateOtp(true);
              console.log('OTP verfied succussfully');
            }
          } else {
            this.otpErrorFailed = true;
          }
        },
        (error) => {
          // this.onValidateOtp( false );
          this.otpErrorFailed = true;
        }
      );
  }
  // protected but_DraftSave_click() {
  //   super.but_DraftSave_click();
  //   console.log('draftsave click');
  // }
  protected but_DraftSave_click() {
    console.log('leadStepFOrm');
    if (
      sessionStorage.getItem('updatedfields') != undefined &&
      sessionStorage.getItem('updatedfields') != null &&
      sessionStorage.getItem('updatedfields') != '' &&
      (this.service.responseIO.data.Entity.quotationSeq != null ||
        this.service.responseIO.data.Entity.fnaSeq != null)
    ) {
      let label = this.formLabel();
      this.service.responseIO.data.Entity.leadSource = sessionStorage.getItem('updatedfields');
      this.confirm(
        `${label}`,
        () => {
          super.but_DraftSave_click();
          sessionStorage.setItem('updatedfields', '');
        },
        () => {
          this.service.responseIO.data.Entity.leadSource = '';
          super.but_DraftSave_click();
          sessionStorage.setItem('updatedfields', '');
        }
      );
    } else {
      this.service.responseIO.data.Entity.leadSource = '';
      super.but_DraftSave_click();
    }
  }
  formLabel() {
    let arrayOfFields = sessionStorage.getItem('updatedfields').split(',');
    arrayOfFields = Array.from(new Set(arrayOfFields));
    let label = this.service.getMultilingualLabel('PARTY_UPDATE_CONFIRMATION').split('{1}')[0];

    arrayOfFields.forEach((element) => {
      if (element) {
        let l1 = this.service.getMultilingualLabel(element);
        label += `\n -${l1}`;
      }
    });
    return label;
  }
  public sendReport_click() {
    this.sendReportLeadData();
  }

  protected sendReportLeadData() {
    let lead: 'Lead';
    let respData: any;
    if (this.service.responseIO.data.Entity.leadId != '') {
      this.service.getSendReport(lead, this.service.responseIO.data.Entity.leadId).subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          // if (respData !== undefined && respData.data !== undefined && respData.data.Entity.leadSeq !== null) {
          //   console.log('success response ');
          // }
          console.log('send Report Lead successful.');
        },
        (error) => {
          console.log('Send Report Lead failed.');
          console.log('Error:', error);
        }
      );
    }
  }
}
