import { QuotationStepFormComponent } from './../quotation-step-form/quotation-step-form.component';
import { StepItem } from './../../models/common/step-item';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotationService } from '../services/quotation.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';
import { PageHeader } from 'src/app/models/common/page-header';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { ResponseIO } from 'src/app/models/responseIO';

@Component({
  selector: 'sym-quotation-preview',
  templateUrl: './quotation-preview.component.html',
  styleUrls: ['./quotation-preview.component.scss'],
  providers: [QuotationService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationPreviewComponent extends QuotationStepFormComponent implements OnInit {
  @Input() quotationId: number;
  @Input() quotationResponseIO: ResponseIO;

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

  ngOnInit(): void {
    if (this.quotationResponseIO != null) {
      this.service.responseIO = this.quotationResponseIO;
      this.service.id = this.quotationResponseIO.data.Entity.id;
      super.postInit();
    } else {
      this.id = this.quotationId;
      super.ngOnInit();
    }
    // super.loadInitData();
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
            ],
          },
        ],
        []
      ),
    ];
    return stepList;
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

  protected getPageHeader(): PageHeader {
    return undefined;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return undefined;
  }
}
