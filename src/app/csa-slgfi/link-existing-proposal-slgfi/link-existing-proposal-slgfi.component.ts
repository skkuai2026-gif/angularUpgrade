import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';

@Component({
  selector: 'sym-link-existing-proposal-slgfi',
  templateUrl: './link-existing-proposal-slgfi.component.html',
  styleUrls: ['./link-existing-proposal-slgfi.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LinkExistingProposalSLGFIComponent extends BaseSearchComponent<CSASLGFIService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  @Input() firstName: any;
  @Input() lastName: any;
  constructor(public service: CSASLGFIService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }
  ngOnInit() {
    this.isAdvanceSearchDisplayed = false;

    let searchCriteriaData = {
      'ProposalLinkCSADO.firstName': this.firstName,
      'ProposalLinkCSADO.lastName': this.lastName,
    };
    this.service.getCSALinkSISearch(true, searchCriteriaData).subscribe(
      (searchList) => {
        let list = JSON.parse(JSON.stringify(searchList));
        this.service.searchResponseIO = new SearchResponseIO();
        this.service.searchResponseIO = list;

        console.log('calling find from ngOnInit method');
      },
      (error) => {
        console.log('Get search list failed.');
        console.log('Error:', error);
      }
    );
  }
  protected getMoreOptionList(): any[] {
    return [];
  }
}
