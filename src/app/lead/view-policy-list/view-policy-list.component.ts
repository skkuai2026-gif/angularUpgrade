import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'sym-view-policy-list',
  templateUrl: './view-policy-list.component.html',
  styleUrls: ['./view-policy-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ViewPolicyListComponent extends BaseSearchComponent<LeadService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  @Input() searchCriteriaforPolicy: any;
  @Input() leadId: any;
  public searchCriteriaData: any;
  constructor(public service: LeadService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }
  ngOnInit() {
    this.isAdvanceSearchDisplayed = false;
    this.searchCriteriaData = {
      'SearchPolicyDO.leadId': this.leadId,
    };
  }

  protected getMoreOptionList(): any[] {
    return [];
  }
}
