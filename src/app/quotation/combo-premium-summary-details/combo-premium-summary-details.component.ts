import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { QuotationStepFormHandlerComponent } from '../quotation-step-form/quotation-step-form.handler';
import { QuotationService } from '../services/quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';
import { ResponseIO } from 'src/app/models/responseIO';
import { StepItem } from 'src/app/models/common/step-item';
import { PageHeader } from 'src/app/models/common/page-header';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';

@Component({
  selector: '[sym-combo-premium-summary-details]',
  templateUrl: './combo-premium-summary-details.component.html',
  styleUrls: ['./combo-premium-summary-details.component.scss'],
  providers: [QuotationService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ComboPremiumSummaryDetailsComponent extends QuotationStepFormHandlerComponent {
  @Input() quotationId: number;
  @Input() rider: any;
  @Output() notifyComboChildPrdLoad = new EventEmitter<QuotationService>();

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
      this.notifyComboChildPrdLoad.emit(this.service);
      if (this.selectedStep != undefined) {
        this.checkForRiderTab(this.selectedStep);
        this.checkForSupplementaryTab(this.selectedStep);
      }
    });
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_quoteSummary',
        [
          {
            id: 'tab_premiumSummary',
            modelList: [
              'Entity',
              'BasePlan',
              'RiderList',
              'Proposer',
              'PrimaryInsured',
              'JointLife',
              'SupplementaryList',
              'InitialInvestment',
            ],
          },
        ],
        ['but_Back', 'but_Continue']
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

  public getNetPremium(modalPremium: number, discount: number): number {
    let netPremium = 0;
    if (modalPremium != null && discount != null) {
      netPremium = modalPremium - discount;
    }
    return netPremium;
  }
}
