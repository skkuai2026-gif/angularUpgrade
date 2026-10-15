import { PageHeader } from '../../models/common/page-header';
import { StepItem } from '../../models/common/step-item';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from './../../system-common/services/setting.service';
import { BreadCrumb } from './../../models/common/bread-crumb';
import { FieldItem } from 'src/app/models/common/field-item';
// import { CSAStepFormHandlerComponent } from './csa-step-form.handler';

@Component({
  selector: 'sym-csa-slgfi-step-form',
  templateUrl: './csa-slgfi-step-form.component.html',
  styleUrls: ['./csa-slgfi-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSASLGFIStepFormComponent extends BaseStepFormComponent<CSASLGFIService> {
  isRPQApplicable = false;
  previewShow = false;
  searchCriteriaforProposal: any;
  public csaLinkSISearchDisplayed: boolean;
  constructor(
    service: CSASLGFIService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
    // this.addLink = '/csa';
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'search',
        link: '/csa-slgfi-search',
      },
      {
        id: 'Create CSA',
      },
    ];
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.refNumber = this.service.responseIO.data.Entity.fnaNum;
    header.title = 'CSA';
    // if (this.service.responseIO.data.Entity.statusCd == 'COMPLETED') {
    header.moreOptionList = this.getMoreOptionList();
    // }
    return header;
  }

  protected getStepList(): StepItem[] {
    return this.getCustomStepList();
  }

  proposalPopupClosed() {
    this.service.viewProposalListDisplayed = !this.service.viewProposalListDisplayed;
  }

  protected getMoreOptionList(): any[] {
    const userdata = this.service.getUserLoginData();
    let field13 = userdata?.['agentInfo'].field13;
    console.log('field13:', field13);
    let optionList: any[];
    optionList = [];
    optionList.push({
      id: 'viewLead',
    });
    if (this.settingService.getApplicationMode() == 'offline' && field13 == 'YES') {
      optionList.push({
        id: 'sendReport',
      });
    }
    if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data.Entity != undefined &&
      this.service.responseIO.data.Entity.statusCd != 'PENDING'
    ) {
      optionList.push({
        id: 'linkNewProposal',
      });
      optionList.push({
        id: 'viewProposalList',
      });
    }
    return optionList;
  }

  public previewCSA_click(buttonClicked: { id: string; link: string }) {
    this.previewCSA();
  }

  public viewLead_click(buttonClicked: { id: string; link: string }) {
    this.viewLead();
  }

  public viewProposalList_click(buttonClicked: { id: string; link: string }) {
    this.viewProposalList();
  }

  protected but_DraftSave_click() {
    if (
      this.service.responseIO.data.Entity.visitedTabs != undefined &&
      this.service.responseIO.data.Entity.visitedTabs.includes('tab_declaration')
    )
      if (this.service.responseIO.data.Entity.stepActionTabs != null) {
        if (!this.service.responseIO.data.Entity.stepActionTabs.includes('tab_declaration')) {
          this.service.responseIO.data.Entity.stepActionTabs =
            this.service.responseIO.data.Entity.stepActionTabs + 'tab_declaration';
        }
      }
    if (
      this.service.responseIO.data.Entity.visitedTabs != undefined &&
      this.service.responseIO.data.Entity.visitedTabs.includes('tab_riskProfile')
    )
      if (this.service.responseIO.data.Entity.stepActionTabs != null) {
        if (!this.service.responseIO.data.Entity.stepActionTabs.includes('tab_riskProfile')) {
          this.service.responseIO.data.Entity.stepActionTabs =
            this.service.responseIO.data.Entity.stepActionTabs + 'tab_riskProfile';
        }
      }
    // this.setValidationErrors();
    super.but_DraftSave_click();
  }

  protected viewProposalList() {
    console.log('in view proposal list csa');
    this.service.viewProposalListDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('viewProposalList');
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

  protected previewCSA() {
    let respData: any;
    this.service.getCSAPreview().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        // this.router.navigate(['csa/' + respData.data.Entity.id]);
        console.log('previewCSA  successful.');
      },
      (error) => {
        console.log('previewCSA failed.');
        console.log('Error:', error);
      }
    );
  }

  // public createQuotation_click(buttonClicked: { id: string; link: string }) {
  //   this.createQuotation();
  // }

  public linkNewProposal_click(buttonClicked: { id: string; link: string }) {
    this.createQuotation();
  }

  public linkExisitingProposal_click(buttonClicked: { id: string; link: string }) {
    console.log('in link csa');
    this.service.csaLinkSISearchDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('linkExistingProposal');
  }
  protected createQuotation() {
    let respData: any;
    this.service.createQuotation().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        this.router.navigate(['quotation/' + respData.data.Entity.quotationSeq]);
        console.log('CreateQuotation  successful.');
      },
      (error) => {
        console.log('CreateQuotation failed.');
        console.log('Error:', error);
      }
    );
  }

  protected close_click() {
    this.confirm(
      'Are you sure want to close CSA #' + this.service.responseIO.data.Entity.leadId + ' ?',
      () => {
        this.service.closeCSA(this.selectedStep.selectedTab.modelList).subscribe(
          () => {
            console.log('CSA closed successfully.');
            this.selectedStep.buttonList = [];
            this.headerService.clear();
            // this.headerService.pageHeader.moreOptionList = [];
          },
          (error) => {
            console.log('CSA closed failed.');
            console.log('Error:', error);
          }
        );
      },
      () => {
        return false;
      }
    );
  }

  protected preStepSelection(selectedStep: StepItem): void {
    //if status is Closed then remove the buttons
    if (this.service.responseIO.data.Entity.statusCd == 'CLOSED') {
      selectedStep.buttonList = [];
    }
  }
  // protected postLoad(nextStepObj?: StepItem): void {
  //   // this.stepList = [];
  //   // this.stepList = this.getStepList();
  //   if (nextStepObj != undefined) {
  //     this.stepList = this.getStepList();
  //     // let dbStep: number = this.service.responseIO.data.Entity.step;
  //     // if (dbStep >= this.stepList.length) dbStep = 0;
  //     nextStepObj = this.stepList[nextStepObj.index];
  //   }
  //   super.postLoad(nextStepObj);
  // }

  // protected but_Continue_click() {
  //   super.but_DraftSave_click();
  //   this.stepList = this.getStepList();
  //   super.but_Continue_click();
  // }
  protected getCustomStepList(): StepItem[] {
    console.log('in get cistom list');
    let customStepList: StepItem[] = new Array();
    let stepIndex = 0;
    let stepObj = new StepItem();
    stepObj.index = stepIndex;
    stepObj.id = 'step_fna';
    stepObj.tabList = [
      {
        id: 'tab_fna_input',
        modelList: ['FNAParty', 'FNARequestAdditionalAllList'],
      },
      {
        id: 'tab_question_details',
        modelList: ['FNAParty', 'FNARequestAdditionalPriorityList'],
      },
    ];
    if (this.service.responseIO != null && this.service.responseIO.data.Entity.statusCd != 'ACCEPTED') {
      stepObj.buttonList = ['but_DraftSave', 'but_Continue'];
    }
    customStepList.push(stepObj);

    let isRPQApplicable =
      this.service.responseIO != null ? this.service.responseIO.data.Entity.isRPQApplicable : false;

    if (isRPQApplicable) {
      //2nd step
      stepObj = new StepItem();
      stepObj.index = ++stepIndex;
      stepObj.id = 'step_riskProfile';
      stepObj.tabList = [{ id: 'tab_riskProfile', modelList: ['LeadRPQ', 'FNAFundList'] }];
      if (this.service.responseIO != null && this.service.responseIO.data.Entity.statusCd != 'ACCEPTED') {
        stepObj.buttonList = ['but_Back', 'but_DraftSave', 'but_Continue'];
      }
      customStepList.push(stepObj);
    }
    //3rd step
    stepObj = new StepItem();
    stepObj.index = ++stepIndex;
    stepObj.id = 'step_declaration';
    stepObj.tabList = [{ id: 'tab_declaration', modelList: ['LeadRPQ', 'FNAFundList'] }];
    if (this.service.responseIO != null && this.service.responseIO.data.Entity.statusCd != 'ACCEPTED') {
      stepObj.buttonList = ['but_Back', 'but_DraftSave', 'but_Continue'];
    }
    customStepList.push(stepObj);
    //4th step
    // let previewShow =
    //   this.service.responseIO != null && this.service.responseIO.data.Entity.statusCd == 'COMPLETED'
    //     ? true
    //     : false;
    // console.log('previewShow' + previewShow);
    // if (previewShow) {
    stepObj = new StepItem();
    stepObj.index = ++stepIndex;
    stepObj.id = 'step_csaPreview';
    stepObj.tabList = [{ id: 'tab_csaPreview', modelList: ['FNAParty', 'LeadRPQ', 'ServiceSignatureList'] }];
    if (this.service.responseIO != null && this.service.responseIO.data.Entity.statusCd != 'ACCEPTED') {
      stepObj.buttonList = ['but_Back'];
    }
    console.log('customStepList' + customStepList);
    customStepList.push(stepObj);
    // }
    return customStepList;
  }

  protected loadCompanyFacets(): void {
    //TODO in product selection component clear out the productfacets on change of product.
    let productSeq = null;
    // if (this.service.responseIO && this.service.responseIO.data && this.service.companyFacets == undefined) {
    //   this.service.getProductUIFacets(productSeq).subscribe(
    //     (facets) => {
    //       this.service.companyFacets = [];
    //       this.service.companyFacets = JSON.parse(JSON.stringify(facets));
    //       // console.log(facets);
    //       console.log('Company facets loaded successful.');
    //     },
    //     (error) => {
    //       console.log('Company facets load failed.');
    //       console.log('Error:', error);
    //     }
    //   );
    // }
  }

  ngOnDestroy() {
    console.log('in ng');
    super.ngOnDestroy();
    this.closeModal('viewProposalList');
    this.service.viewProposalListDisplayed = false;
    // this.stepList = [];
  }

  computeRiskScoreClick() {
    console.log('in computeriskscore');
    this.but_DraftSave_click();
    // this.service
  }

  protected preProcess(): boolean {
    let shouldSave: boolean = true;
    if (this.service.responseIO.data.Entity.statusCd == 'CLOSED') {
      //closed cases should not be edited and saved just viewed hence return false
      shouldSave = false;
    }
    return shouldSave;
  }
  public sendReport_click() {
    this.sendReportFNAData();
  }

  protected sendReportFNAData() {
    let respData: any;
    let fnaRef: 'FnaRef';
    if (this.service.responseIO.data.Entity.fnaNum != '') {
      this.service.getSendReport(fnaRef, this.service.responseIO.data.Entity.fnaNum).subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          // if (respData !== undefined && respData.data !== undefined && respData.data.fnaId !== null) {
          //   console.log('success response ');
          // }
          console.log('send Report FNA successful.');
        },
        (error) => {
          console.log('Send Report FNA failed.');
          console.log('Error:', error);
        }
      );
    }
  }
}
