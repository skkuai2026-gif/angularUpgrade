import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { QuotationService } from '../services/quotation.service';

@Component({
  selector: 'sym-csa-link-proposal',
  templateUrl: './csa-link-proposal.component.html',
  styleUrls: ['./csa-link-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSALinkProposalComponent extends BaseSearchComponent<QuotationService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  @Input() firstName: any;
  @Input() lastName: any;
  constructor(public service: QuotationService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }
  public searchCriteriaData: any;
  ngOnInit() {
    super.ngOnInit();

    this.searchCriteriaData = {
      'CSALinkProposalDO.firstName1': this.firstName,
      'CSALinkProposalDO.lastName1': this.lastName,
      'CSALinkProposalDO.ownerName': this.firstName + ' ' + this.lastName,
    };
    // this.service.getCSALinkSISearch(true, searchCriteriaData).subscribe(
    //   (searchList) => {
    //     let list = JSON.parse(JSON.stringify(searchList));
    //     this.service.searchResponseIO = new SearchResponseIO();
    //     this.service.searchResponseIO = list;

    //     // console.log('calling find from ngOnInit method');
    //   },
    //   (error) => {
    //     console.log('Get search list failed.');
    //     console.log('Error:', error);
    //   }
    // );
  }
  protected getMoreOptionList(): any[] {
    return [];
  }
}
