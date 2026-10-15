import { LeadService } from '../services/lead.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-view-csa-list',
  templateUrl: './view-csa-list.component.html',
  styleUrls: ['./view-csa-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ViewCSAListComponent extends BaseSearchComponent<LeadService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  public searchCriteriaData: any;
  @Input() leadId: any;
  constructor(public service: LeadService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }
  ngOnInit() {
    this.isAdvanceSearchDisplayed = false;
    this.searchCriteriaData = {
      'SearchFNARquestDO.leadId': this.leadId,
    };
  }
  protected getMoreOptionList(): any[] {
    return [];
  }

  ngOnDestroy(): void {
    this.closeModal('viewCSAList');
  }
}
