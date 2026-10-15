import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CSAService } from '../service/csa-service.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'sym-view-proposal-list',
  templateUrl: './view-proposal-list.component.html',
  styleUrls: ['./view-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ViewProposalListComponent extends BaseSearchComponent<CSAService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  @Input() searchCriteriaData: any;
  @Input() searchCriteriaforProposal: any;
  constructor(public service: CSAService, public headerService: HeaderService, public router: Router) {
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
