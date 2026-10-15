import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { LeadService } from '../services/lead.service';
import { HeaderService } from './../../system-common/services/header.service';
import { SettingService } from './../../system-common/services/setting.service';
import { BreadCrumb } from './../../models/common/bread-crumb';
import { LeadDynamicComponentList } from '../services/lead-dynamic-component-list';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadStepFormHandlerComponent extends BaseStepFormComponent<LeadService> implements OnInit {
  isFNAClicked: boolean;
  constructor(
    service: LeadService,
    route: ActivatedRoute,
    public router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.isFNAClicked = false;
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
        id: 'Create Lead',
      },
    ];
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.refNumber = this.service.responseIO.data.Entity.leadId;
    header.title = 'Lead';
    if (this.service.responseIO.data.Entity.leadId && this.service.responseIO.data.Entity.statusCd != 'CLOSED') {
      header.moreOptionList = this.getMoreOptionList();
    }
    return header;
  }

  protected getStepList(): StepItem[] {
    const stepList: StepItem[] = [
      new StepItem(
        0,
        'step_leadDataEntry',
        [
          {
            id: 'tab_leadbasic',
            isSelected: true,
            modelList: ['LeadParty'],
          },
          {
            id: 'tab_activity',
            isSelected: false,
            modelList: ['LeadParty', 'LeadActivityList'],
          },
        ],
        ['but_DraftSave']
      ),
    ];

    return stepList;
  }

  protected getMoreOptionList(): any[] {
    return [
      {
        id: 'openInsuranceType',
      },
      {
        id: 'createFNA',
      },
      {
        id: 'close',
      },
    ];
  }

  public openInsuranceType_click(buttonClicked: { id: string; link: string }) {
    this.openModal('selectInsuranceType');
  }

  public createQuotation_click(buttonClicked: { id: string; link: string }) {
    this.createQuotation();
  }

  public createFNA_click(buttonClicked: { id: string; link: string }) {
    this.createFNA();
  }

  protected createQuotation(insuranceType?: string) {
    let respData: any;
    this.service.createQuotation().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        let quotationLink = 'quotation/';
        // if (insuranceType != undefined) quotationLink = this.getQuotationLink(insuranceType);
        this.router.navigate([quotationLink + respData.data.Entity.quotationSeq]);
        console.log('CreateQuotation  successful.');
      },
      (error) => {
        console.log('CreateQuotation failed.');
        console.log('Error:', error);
      }
    );
  }

  protected createFNA() {
    let respData: any;
    this.service.createFNA().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        this.router.navigate(['fna/' + respData.data.Entity.fnaSeq]);
        console.log('createFNA  successful.');
      },
      (error) => {
        console.log('createFNA failed.');
        console.log('Error:', error);
      }
    );
  }

  protected close_click() {
    this.confirm(
      'Are you sure want to close lead #' + this.service.responseIO.data.Entity.leadId + ' ?',
      () => {
        this.service.closeLead(this.selectedStep.tabList[0].modelList).subscribe(
          () => {
            console.log('Lead closed successfully.');
            this.selectedStep.buttonList = [];
            this.headerService.clear();
            // this.headerService.pageHeader.moreOptionList = [];
          },
          (error) => {
            console.log('Lead closed failed.');
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
  protected postLoad() {
    this.loadCompanyFacets();
  }

  protected loadCompanyFacets(): void {
    //TODO in product selection component clear out the productfacets on change of product.
    let productSeq = null;
    if (this.service.companyFacets == undefined) {
      this.service.getProductUIFacets(productSeq).subscribe(
        (facets) => {
          this.service.companyFacets = [];
          this.service.companyFacets = JSON.parse(JSON.stringify(facets));
          // console.log(facets);
          this.postLoadCompanyFacets();
          console.log('Company facets loaded successful.');
        },
        (error) => {
          console.log('Company facets load failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  protected preProcess(): boolean {
    let shouldSave: boolean = true;
    if (this.service.responseIO.data.Entity.statusCd == 'CLOSED') {
      //closed cases should not be edited and saved just viewed hence return false
      shouldSave = false;
    }
    return shouldSave;
  }

  onInsuranceTypeSelect(insuranceType: string) {
    this.closeModal('selectInsuranceType');
    this.createQuotation(insuranceType);
  }

  private getQuotationLink(insuranceTypeCd: string) {
    let quotationLink = 'quotation/';
    if (insuranceTypeCd != undefined) {
      if (insuranceTypeCd == 'LIFE' || insuranceTypeCd == 'HEALTH')
        quotationLink = insuranceTypeCd == 'HEALTH' ? 'quotationHealth/' : 'quotation/';
      // } else {
      //   quotationLink = 'quotationInsurance/';
      // }
      // else if (insuranceTypeCd == 'HOME') quotationLink = '/quotationHome';
      // else if (insuranceTypeCd == 'TRAVEL') quotationLink = '/quotationTravel';
      // else if (insuranceTypeCd == 'HEALTH') quotationLink = '/quotationHealth';
    }
    return quotationLink;
  }

  protected getComponentListToDisplay() {
    return LeadDynamicComponentList.componentMap;
  }

  protected postLoadCompanyFacets() {}
}
