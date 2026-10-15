import { Component, OnInit, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { QuotationPartyHandlerComponent } from '../../quotation/quotation-party/quotation-party.handler';
import { QuotationService } from '../../quotation/services/quotation.service';
import { SettingService } from '../../system-common/services/setting.service';
import { FieldItem } from '../../models/common/field-item';

@Component({
  selector: 'sym-customer-quotation-party',
  templateUrl: './customer-quotation-party.component.html',
  styleUrls: ['./customer-quotation-party.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CustomerQuotationPartyComponent extends QuotationPartyHandlerComponent {
  @Input() public model: any;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && changes['model'].currentValue) {
      this.model = this.model;
      // console.log(this.service.responseIO);
    }
  }
}
