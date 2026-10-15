import { StepItem } from './../../models/common/step-item';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { QuotationService } from '../services/quotation.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { PageHeader } from 'src/app/models/common/page-header';
import { Location } from '@angular/common';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';

@Component({
  selector: 'sym-quotation-comparison',
  templateUrl: './quotation-comparison.component.html',
  styleUrls: ['./quotation-comparison.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationComparisonComponent extends BaseStepFormComponent<QuotationService> implements OnInit {
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

  idList: string[];

  ngOnInit() {
    const ids = this.route.snapshot.paramMap.get('ids');
    this.idList = ids.split(',');
    // this.service.loadScroll();
    this.headerService.pageHeader = this.getPageHeader();
    super.ngOnInit();
  }

  onDeleteSelected(quotationId) {
    this.idList.splice(this.idList.indexOf(quotationId), 1);
  }

  onProceedButtonClick(quotationId) {
    this.router.navigate(['/quotation/' + quotationId]);
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[];
    return stepList;
  }

  protected loadInitData() {}

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    // header.refNumber = this.service.responseIO.data.Entity.quotationRefNum;
    header.title = 'quotationComparison';
    return header;
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'search',
        link: '/quotation-search',
      },
      {
        id: 'quotationComparison',
      },
    ];
  }
}
