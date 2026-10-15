import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { CustomFormatPipe } from 'src/app/system-common/pipe/custom-format.pipe';
import { QuotationService } from '../services/quotation.service';
import { FieldItem } from './../../models/common/field-item';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BasePlanOtherHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  constructor(quotationService: QuotationService) {
    super(quotationService);
    // console.log(this.service.responseIO.data['BasePlan']);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected targetFundFl_change(item: FieldItem) {
    if (item.model.targetFundFl == 'YES') {
      this.setFieldFocus(item.model, 'payingYears');
    } else {
      this.service.responseIO.data.BasePlan.payingYears = undefined;
      this.service.responseIO.data.BasePlan.targetFundVal = undefined;
      this.service.responseIO.data.BasePlan.targetPeriodRefCd = undefined;
      this.service.responseIO.data.BasePlan.targetPeriod = undefined;
    }
  }
}
