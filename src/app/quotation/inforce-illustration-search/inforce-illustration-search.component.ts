import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../../quotation/services/quotation.service';
import { HeaderService } from '../../system-common/services/header.service';
import { Router } from '@angular/router';
import { SettingService } from '../../system-common/services/setting.service';
import { OfflineService } from '../../offline/offline.service';
import { QuotationSearchHandlerComponent } from '../quotation-search/quotation-search.handler';
import { BreadCrumb } from '../../models/common/bread-crumb';
import { PageHeader } from '../../models/common/page-header';

@Component({
  selector: 'sym-inforce-illustration-search',
  templateUrl: './inforce-illustration-search.component.html',
  styleUrls: ['./inforce-illustration-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class InforceIllustrationSearchComponent extends QuotationSearchHandlerComponent {
  constructor(
    public service: QuotationService,
    public headerService: HeaderService,
    public router: Router,
    public settingService: SettingService,
    public offlineService: OfflineService
  ) {
    super(service, headerService, router, settingService, offlineService);
    this.addLink = '/inforce-illustration';
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'Search',
      },
    ];
  }

  ngOnInit(): void {
    this.settingService.setSessionStorageValue('insuranceTypeCd', 'LIFE');
    super.ngOnInit();
    this.addLink = '/inforce-illustration';
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.title = 'searchInforceQuotation';
    header.additionalInfo =
      this.service.getSessionStorageValue('insuranceTypeCd') != undefined
        ? '(' + this.service.getSessionStorageValue('insuranceTypeCd') + ')'
        : undefined;
    return header;
  }
}
