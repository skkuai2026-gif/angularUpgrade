import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'sym-view-proposal-list-lead',
  templateUrl: './view-proposal-list-lead.component.html',
  styleUrls: ['./view-proposal-list-lead.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ViewProposalListLeadComponent extends BaseSearchComponent<LeadService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  @Input() leadId: any;
  public searchCriteriaData: any;
  constructor(public service: LeadService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }
  ngOnInit() {
    this.isAdvanceSearchDisplayed = false;

    this.searchCriteriaData = {
      'SearchProspectDO.leadId': this.leadId,
    };
  }
  protected getMoreOptionList(): any[] {
    return [];
  }
}
