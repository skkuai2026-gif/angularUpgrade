import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ResponseIO } from 'src/app/models/responseIO';

import { QuotationService } from 'src/app/quotation/services/quotation.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-bank-quotation-comparison',
  templateUrl: './bank-quotation-comparison.component.html',
  styleUrls: ['./bank-quotation-comparison.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BankQuotationComparisonComponent
  extends BaseComponent<QuotationService>
  implements OnInit, OnChanges
{
  constructor(service: QuotationService) {
    super(service);
  }

  ngOnInit() {
    console.log('quotation response io list:', this.service.compareQuotaionResponseIOMap);
  }

  ngOnChanges(changes: SimpleChanges) {}

  public onQuoteSelection(event, selectedResponseIO: ResponseIO) {
    if (event.target.checked) {
      //replace version id back to actual service repsonse...as row was updated issue occur.
      let versionId = this.service.responseIO.data.BasePlan.versionID;
      if (selectedResponseIO != undefined) {
        this.service.responseIO.data.BasePlan = selectedResponseIO.data.BasePlan;
        this.service.responseIO.data.RiderList = [];
        this.service.responseIO.data.RiderList = selectedResponseIO.data.RiderList;
        this.service.refreshMetaData(selectedResponseIO);
      }
      this.service.responseIO.data.BasePlan.versionID = versionId;
      this.service.addAdditionalData('ISQUOTESELECTED', true);
    }
  }
}
