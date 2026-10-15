import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { Location } from '@angular/common';
import { QuotationStepFormHandlerComponent } from './quotation-step-form.handler';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { ResponseIO } from 'src/app/models/responseIO';
import { TabItem } from 'src/app/models/common/tab-items';
import { distinctUntilChanged, take } from 'rxjs/operators';

@Component({
  selector: 'sym-quotation-step-form',
  templateUrl: './quotation-step-form.component.html',
  styleUrls: ['./quotation-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationStepFormComponent extends QuotationStepFormHandlerComponent {
  private isSubscribed = false;
  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.refNumber = this.service.responseIO.data.Entity.quotationRefNum;
    (header.title =
      this.service.responseIO?.data?.Entity.leadId != null && this.service.responseIO?.data?.Entity.leadId !== ''
        ? 'PROPOSAL'
        : 'QuickQuote'),
      (header.moreOptionList = this.getMoreOptionList());
    return header;
  }

  protected but_Accept_click() {
    //on acceptance first save the quotation and check if all errors are cleared if so
    //then go ahead and accept
    //this.saveUpdatedModels(this.selectedStep, this.selectedStep, undefined, 'but_Accept');
    this.saveUpdatedModels(this.selectedStep, undefined, undefined, 'but_AcceptPH');

    // this.confirm(
    //   this.service.getMultilingualLabel('acceptConfirmation'),
    //   () => {
    //     this.saveUpdatedModels(this.selectedStep, undefined, undefined, 'but_AcceptPH');
    //   },
    //   () => {
    //     this.service.hideLoader(true);
    //   }
    // );
  }
  protected onSaveUpdatedModels(
    body: any,
    currentStepObj: StepItem,
    nextStepObj?: StepItem,
    nextTabObj?: TabItem,
    buttonId?: string
  ) {
    super.onSaveUpdatedModels(body, currentStepObj, nextStepObj, nextTabObj, buttonId);
    //this.preStepSelection(currentStepObj);
    if (
      buttonId == 'but_AcceptPH' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      //update the step index to the next step
      //this.service.responseIO.data.Entity.step =
      //    this.selectedStep.index + 1;
      //this.service.responseIO.data.Entity.stepActionTabs = undefined;
      this.setStepActionTab(currentStepObj);
      //this.service.responseIO.data.ServiceSignatureList=undefined;
      // this.service.acceptIllustration();
      let modelNameList = this.selectedStep.selectedTab.modelList;
      let modelNameBodyList = this.getModelNameBodyList(modelNameList);
      setTimeout(() => {
        this.service.displayLoader(false, buttonId);
        this.service.acceptIllustration(modelNameBodyList).subscribe(
          (successResponse) => {
            this.postAcceptIllustration(successResponse);
            console.log(successResponse);
            this.service.responseIO = new ResponseIO();
            this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
            if (successResponse['success'] == true) {
              // openAcceptIllustrationModal();
              // this.openModal('acceptIllustrationModal');

              // console.log(this.selectedStep);
              this.selectedStep.buttonList = [];
              console.log('Accept Illustration  successful.');
              this.reloadStep(true);
              this.service.hideLoader(false, buttonId);
            } else {
              this.showErrorToast();
              this.error(successResponse['message']), undefined, true;
            }
            console.log(successResponse['message']);
          },
          (error) => {
            this.postAcceptIllustrationError(error);
            this.service.hideLoader(false, buttonId);
            console.log('Accept Illustration failed.');
            console.log('Error:', error);
          }
        );
        this.setSelectedStep(this.selectedStep);
      }, 500);
    }
  }
  protected getMoreOptionList(): any[] {
    const userdata = this.service.getUserLoginData();
    let field13 = userdata?.['agentInfo'].field13;
    console.log('field13:', field13);
    let optionList: any[];
    optionList = [];
    if (
      this.service.responseIO?.data?.Entity.leadId != null &&
      this.service.responseIO?.data?.Entity.leadId !== ''
    ) {
      optionList.push({
        id: 'viewLead',
      });
    }
    if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data.Proposer != undefined &&
      this.service.responseIO.data.Proposer.partyTypeCd === 'INDIVIDUAL' &&
      this.service.responseIO?.data?.Entity.leadId != null &&
      this.service.responseIO?.data?.Entity.leadId !== ''
    ) {
      optionList.push({
        id: 'viewCSA',
      });
    }
    if (
      this.service.responseIO &&
      !this.service.responseIO.data.Entity.isInvalid &&
      this.service.responseIO.data.Entity.isCompleted &&
      this.service.companyFacets &&
      this.service.companyFacets.data['EAPPAPPLICABLE'] &&
      this.service.companyFacets.data['EAPPAPPLICABLE'].length > 0 &&
      this.service.companyFacets.data['EAPPAPPLICABLE'] == 'YES' &&
      this.service.responseIO.data.Entity.entityStatus != 'LOCKED' &&
      this.service.responseIO.data.Entity.policySeq != null &&
      this.service.responseIO?.data?.Entity.leadId != null &&
      this.service.responseIO?.data?.Entity.leadId !== '' &&
      this.service.responseIO.data.Entity.isViewEappApplicable != 'NO'
    ) {
      optionList.push({
        id: 'viewEapp',
      });
    }
    if (this.settingService.getApplicationMode() == 'offline' && field13 == 'YES') {
      optionList.push({
        id: 'sendReport',
      });
    }
    return optionList;
  }
  public viewCSA_click(buttonClicked: { id: string; link: string }) {
    this.viewCSA();
  }

  public viewLead_click(buttonClicked: { id: string; link: string }) {
    this.viewLead();
  }
  protected viewCSA() {
    // this.router.navigate(['lead/', this.service.responseIO.data.Entity.leadSeq]);
    console.log('opening' + this.service.responseIO.data.Entity.fnaId);
    let respData: any;
    this.service.viewCSA(this.service.responseIO.data.Entity.fnaId).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (respData !== undefined && respData.data !== undefined && respData.data.fnaSeq !== null) {
          if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
            this.router.navigate(['csa-slgfi/' + respData.data.fnaSeq]);
          } else {
            this.router.navigate(['csa/' + respData.data.fnaSeq]);
          }
        }
        // alert(
        //     'Policy record ' +
        //         respData.data.Entity.policySeq +
        //         ' generated.'
        // );
        console.log('View CSA successful.');
      },
      (error) => {
        console.log('View CSA failed.');
        console.log('Error:', error);
      }
    );
  }

  protected viewLead() {
    // this.router.navigate(['lead/', this.service.responseIO.data.Entity.leadSeq]);
    console.log('opening' + this.service.responseIO.data.Entity.leadId);
    let respData: any;
    this.service.viewLead(this.service.responseIO.data.Entity.leadId).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (respData !== undefined && respData.data !== undefined && respData.data.leadSeq !== null) {
          this.router.navigate(['lead/' + respData.data.leadSeq]);
        }
        // alert(
        //     'Policy record ' +
        //         respData.data.Entity.policySeq +
        //         ' generated.'
        // );
        console.log('View Lead successful.');
      },
      (error) => {
        console.log('View Lead failed.');
        console.log('Error:', error);
      }
    );
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    if (this.queryParams != undefined && this.queryParams['view'] == 'popup') {
      return [];
    } else if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data != undefined &&
      this.service.responseIO.data.Entity.quoteStatusCd == 'INFORCE'
    ) {
      return [
        {
          id: 'home',
          link: '/home',
        },
        {
          id: 'search',
          link: '/inforce-illustration-search',
        },
        {
          id: 'createQuotation',
        },
      ];
    } else {
      return [
        {
          id: 'home',
          link: '/home',
        },
        {
          id: 'search',
          link:
            this.service.responseIO?.data?.Entity.leadId != null &&
            this.service.responseIO?.data?.Entity.leadId !== ''
              ? '/quotation-search'
              : '/quick-quotation-search',
        },
        {
          id:
            this.service.responseIO?.data?.Entity.leadId != null &&
            this.service.responseIO?.data?.Entity.leadId !== ''
              ? 'createQuotation'
              : 'QuickQuote',
        },
      ];
    }
  }
  protected preStepSelection(nextStepObj: StepItem): void {
    //for all steps if status is Accepted then remove the buttons
    if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid)
      nextStepObj.buttonList = [];
    //for step coverage details only if supplementary is selected on the Entity then have that tab
    if (nextStepObj.index == 2) {
      this.checkForSupplementaryTab(nextStepObj);
      this.checkForRiderTab(nextStepObj);
      this.checkForWithdrawal(nextStepObj);
    }
  }

  protected checkForWithdrawal(nextStepObj: StepItem): void {
    for (var i = 0; i < nextStepObj.tabList.length; i++) {
      var tabItem = nextStepObj.tabList[i];

      if (tabItem.id == 'tab_withdrawal') {
        // nextStepObj.tabList.splice(i, 1);
        if (
          (this.service.responseIO.data.BasePlan != undefined &&
            this.service.responseIO.data.BasePlan.payoutFrequencyCd == 'NOWITHDRAWAL') ||
          this.service.responseIO.data.BasePlan.payoutFrequencyCd == ''
        ) {
          tabItem.visible = false;
        } else {
          tabItem.visible = true;
        }
      }
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    const interval = setInterval(() => {
      const leadId = this.service.responseIO?.data?.Entity?.leadId;
      if (this.service.responseIO) {
        if (!leadId) {
          this.service.setModelFieldValue(this.service.responseIO?.data?.Proposer, 'lastname', '(CLIENT)');
        }
        clearInterval(interval);
      }
    }, 200);
  }

  public viewEapp_click(buttonClicked: { id: string; link: string }) {
    this.viewEapp();
  }

  protected viewEapp() {
    if (
      this.service.responseIO.data.Entity.policySeq != undefined ||
      this.service.responseIO.data.Entity.policySeq != null
    ) {
      this.router.navigate(['policy/' + this.service.responseIO.data.Entity.policySeq]);
    }
  }
  public sendReport_click() {
    this.sendReportQuotationData();
  }

  protected sendReportQuotationData() {
    let quotationRef: 'QUOTATION';
    let respData: any;
    this.service.getSendReport(quotationRef, this.service.responseIO.data.Entity.quotationRefNum).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        // if (respData !== undefined && respData.data !== undefined && respData.data.Entity.quotationRefNum !== null) {
        //   console.log('success response ')
        // }
        console.log('send Report quotation data successful.');
      },
      (error) => {
        console.log('Send Report uotation data  failed.');
        console.log('Error:', error);
      }
    );
  }
}
