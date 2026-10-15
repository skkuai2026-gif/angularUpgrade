import { Component, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Router } from '@angular/router';
import { QuotationSearchHandlerComponent } from './quotation-search.handler';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OfflineService } from './../../offline/offline.service';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { SearchResultRow } from 'src/app/models/common/search-result';

@Component({
  selector: 'sym-quotation-search',
  templateUrl: './quotation-search.component.html',
  styleUrls: ['./quotation-search.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationSearchComponent extends QuotationSearchHandlerComponent {
  constructor(
    public service: QuotationService,
    public headerService: HeaderService,
    public router: Router,
    public settingService: SettingService,
    public offlineService: OfflineService
  ) {
    super(service, headerService, router, settingService, offlineService);
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
  } // new added code by shastri
  onMoreButtonClicked(searchRecord: SearchResultRow) {
    let recordVal = this.getRecordValue(searchRecord, 'SearchProspectDO.quoteStatusLookupCd');
    if ('PENDING' == recordVal) {
      let newMoreOptionList = this.getMoreOptions(['Download']);
      searchRecord.moreOptionList = newMoreOptionList;
    }
  }
}
