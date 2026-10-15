import { BasePlanOtherHandlerComponent } from './base-plan-other.handler';
import { Component, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { CustomFormatPipe } from 'src/app/system-common/pipe/custom-format.pipe';

@Component({
  selector: 'sym-base-plan-other',
  templateUrl: './base-plan-other.component.html',
  styleUrls: ['./base-plan-other.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BasePlanOtherComponent extends BasePlanOtherHandlerComponent {
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }

  ngOnInit(): void {
    if (
      this.service.productFacets &&
      this.service.productFacets.data &&
      this.service.productFacets.data['PREMIUMHOLIDAY'] == 'YES'
    )
      this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'isPremiumHolidayFlSelected', 'YES');
  }
}
