import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';

@Component({
  selector: 'sym-view-proposal-list-slgfi',
  templateUrl: './view-proposal-list-slgfi.component.html',
  styleUrls: ['./view-proposal-list-slgfi.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ViewProposalListSLGFIComponent extends BaseSearchComponent<CSASLGFIService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  searchCriteriaData: any;
  @Input() searchCriteriaforProposal: any;
  constructor(public service: CSASLGFIService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }
  ngOnInit() {
    this.isAdvanceSearchDisplayed = false;
    this.searchCriteriaData = {
      'SearchProspectDO.fnaId': this.searchCriteriaforProposal,
    };
  }
  protected getMoreOptionList(): any[] {
    return [];
  }
}
