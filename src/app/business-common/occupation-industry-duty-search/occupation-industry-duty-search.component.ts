import { OccupationIndustryDutyService } from './../service/occupation-industry-duty.service';
import { BusinessCommonService } from './../service/business-common.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../system-common/services/header.service';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from 'src/app/lead/services/lead.service';
import { SearchResponseIO } from 'src/app/models/search-responseIO';

@Component({
  selector: 'sym-occupation-industry-duty-search',
  templateUrl: './occupation-industry-duty-search.component.html',
  styleUrls: ['./occupation-industry-duty-search.component.scss'],
  providers: [OccupationIndustryDutyService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OccupationIndustryDutySearchComponent
  extends BaseSearchComponent<OccupationIndustryDutyService>
  implements OnInit
{
  isAdvanceSearchDisplayed: boolean;
  constructor(
    public service: OccupationIndustryDutyService,
    public headerService: HeaderService,
    public router: Router
  ) {
    super(service, router, headerService);
  }

  ngOnInit() {
    // super.ngOnInit();
    // console.log(this.searchResponseIO);
    this.isAdvanceSearchDisplayed = true;
    this.service.find(false).subscribe(
      (searchList) => {
        let list = JSON.parse(JSON.stringify(searchList));
        this.service.searchResponseIO = new SearchResponseIO();
        this.service.searchResponseIO = list;

        console.log('Get search list successful.');
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
