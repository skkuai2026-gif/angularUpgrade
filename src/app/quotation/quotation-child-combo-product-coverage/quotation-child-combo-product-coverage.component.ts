import { QuotationStepFormHandlerComponent } from 'src/app/quotation/quotation-step-form/quotation-step-form.handler';
import { BreadCrumb } from './../../models/common/bread-crumb';
import { PageHeader } from './../../models/common/page-header';
import { StepItem } from './../../models/common/step-item';
import { HeaderService } from './../../system-common/services/header.service';
import { SettingService } from './../../system-common/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from './../services/quotation.service';
import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { ResponseIO } from 'src/app/models/responseIO';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-quotation-child-combo-product-coverage',
  templateUrl: './quotation-child-combo-product-coverage.component.html',
  styleUrls: ['./quotation-child-combo-product-coverage.component.scss'],
  providers: [QuotationService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationChildComboProductCoverageComponent extends QuotationStepFormHandlerComponent {
  @Input() quotationId: number;
  @Input() isDataSaved: boolean;
  @Output() notifyChildComboChange = new EventEmitter<QuotationService>();

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

  ngOnInit() {
    if (this.service.responseIO == undefined) {
      this.stepList = [];
      this.stepList = this.getStepList();
      this.setComponentListToDisplay(this.getComponentListToDisplay());
      this.selectedStep = this.stepList[0];
      this.stepList[0].selectedTab = this.stepList[0].tabList[0];
      this.id = this.quotationId;
      this.service.id = this.quotationId;

      let modelNameBodyList = this.getModelNameBodyList(this.getStepList()[0].tabList[0].modelList);
      this.preLoad();
      this.service.load(this.quotationId, modelNameBodyList).subscribe((body) => {
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(body));
        this.service.productFacets = undefined;
        this.postLoad();
        if (this.selectedStep != undefined) {
          this.checkForRiderTab(this.selectedStep);
          this.checkForSupplementaryTab(this.selectedStep);
        }
      });
    }
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_coverageDet1',
        [
          {
            id: 'tab_plan',
            modelList: [
              'BasePlan',
              'InitialInvestment',
              'RegularTopup',
              'AdHocTopupList',
              'TransferTopupList',
              'WithdrawalList',
              'RiderList',
            ],
          },
          { id: 'tab_supplementary', modelList: ['SupplementaryList', 'BasePlan'] },
          { id: 'tab_rider', modelList: ['RiderList', 'BasePlan'] },
        ],
        []
      ),
    ];
    return stepList;
  }

  protected getPageHeader(): PageHeader {
    return undefined;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return undefined;
  }

  public saveComboProduct() {
    this.saveUpdatedModels(this.selectedStep);
  }

  public onInputModify(item: FieldItem) {
    this.notifyChildComboChange.emit(this.service);
    //console.log('child combo ', this.service);
  }

  protected but_Continue_click() {
    this.saveComboProduct();
  }
}
